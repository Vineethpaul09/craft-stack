// File: src/components/recruitment/KanbanBoard.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PipelineColumn } from "./PipelineColumn";
import { CandidateCard } from "./CandidateCard";
import { BulkActionBar } from "./BulkActionBar";
import { 
  PipelineColumn as PipelineColumnType, 
  Candidate, 
  PipelineStatus,
  MoveResponse 
} from "@/types/recruitment";
import { useRecruitmentAPI } from "@/hooks/useRecruitmentAPI";
import { useToast } from "@/hooks/useToast";
import { Card, CardContent } from "@/components/ui/card";

interface KanbanBoardProps {
  columns: PipelineColumnType[];
  onCandidateOpen: (candidateId: string) => void;
  onCandidateAssign: (candidateId: string) => void;
  onCandidateMessage: (candidateId: string) => void;
  onCandidateSchedule?: (candidateId: string) => void;
  onAddCandidate: (status: PipelineStatus) => void;
  onColumnSettings: (columnId: string) => void;
  onBulkExport: (candidateIds: string[]) => void;
  onRefresh?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns: initialColumns,
  onCandidateOpen,
  onCandidateAssign,
  onCandidateMessage,
  onCandidateSchedule,
  onAddCandidate,
  onColumnSettings,
  onBulkExport,
  onRefresh,
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [lastMove, setLastMove] = useState<{
    candidateId: string;
    from: PipelineStatus;
    to: PipelineStatus;
    timestamp: number;
  } | null>(null);

  const { moveCandidate, bulkMoveCandidate, loading } = useRecruitmentAPI();
  const { toast } = useToast();

  // Update columns when prop changes
  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Find candidate across all columns
  const findCandidate = useCallback((candidateId: string): { candidate: Candidate; columnId: string } | null => {
    for (const column of columns) {
      const candidate = column.candidates.find(c => c.id === candidateId);
      if (candidate) {
        return { candidate, columnId: column.id };
      }
    }
    return null;
  }, [columns]);

  // Optimistic update with rollback capability
  const optimisticMove = useCallback((
    candidateId: string, 
    sourceColumnId: string, 
    destColumnId: string
  ) => {
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(column => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            candidates: column.candidates.filter(c => c.id !== candidateId)
          };
        } else if (column.id === destColumnId) {
          const candidateToMove = prevColumns
            .find(c => c.id === sourceColumnId)
            ?.candidates.find(c => c.id === candidateId);
          
          if (candidateToMove) {
            return {
              ...column,
              candidates: [
                { ...candidateToMove, status: destColumnId as PipelineStatus },
                ...column.candidates
              ]
            };
          }
        }
        return column;
      });
      
      return newColumns;
    });
  }, []);

  // Rollback optimistic update
  const rollbackMove = useCallback(() => {
    if (onRefresh) {
      onRefresh();
    } else {
      setColumns(initialColumns);
    }
  }, [initialColumns, onRefresh]);

  // Handle candidate selection
  const handleCandidateSelect = useCallback((candidateId: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId);
      } else {
        newSet.add(candidateId);
      }
      return newSet;
    });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedCandidates(new Set());
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const candidateData = findCandidate(event.active.id as string);
    if (candidateData) {
      setActiveCandidate(candidateData.candidate);
    }
  }, [findCandidate]);

  // Handle drag end
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const sourceData = findCandidate(candidateId);
    
    if (!sourceData) return;

    const destColumnId = over.id as string;
    const sourceColumnId = sourceData.columnId;

    // No move if same column
    if (sourceColumnId === destColumnId) return;

    const candidate = sourceData.candidate;
    const timestamp = Date.now();

    // Store move for undo
    setLastMove({
      candidateId,
      from: sourceColumnId as PipelineStatus,
      to: destColumnId as PipelineStatus,
      timestamp,
    });

    // Optimistic update
    optimisticMove(candidateId, sourceColumnId, destColumnId);

    try {
      // API call
      const result = await moveCandidate(
        candidateId,
        sourceColumnId as PipelineStatus,
        destColumnId as PipelineStatus,
        "drag_drop"
      );

      if (result) {
        toast({
          type: "success",
          title: "Candidate moved",
          description: `${candidate.name} moved to ${destColumnId}`,
          action: {
            label: "Undo",
            onClick: () => handleUndo(),
          },
          duration: 7000,
        });

        // Trigger automation rules if any
        if (result.triggeredRules && result.triggeredRules.length > 0) {
          toast({
            type: "info",
            title: "Automation triggered",
            description: `${result.triggeredRules.length} rule(s) executed`,
            duration: 3000,
          });
        }
      } else {
        throw new Error("Move failed - no response");
      }
    } catch (error) {
      // Rollback on error
      rollbackMove();
      toast({
        type: "error",
        title: "Move failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        action: {
          label: "Retry",
          onClick: () => {
            optimisticMove(candidateId, sourceColumnId, destColumnId);
            // Could retry the API call here
          },
        },
      });
    }
  }, [
    findCandidate,
    optimisticMove,
    rollbackMove,
    moveCandidate,
    toast,
  ]);

  // Handle undo
  const handleUndo = useCallback(async () => {
    if (!lastMove) return;

    const { candidateId, from, to } = lastMove;
    
    // Optimistic undo
    optimisticMove(candidateId, to, from);

    try {
      await moveCandidate(candidateId, to, from, "undo");
      toast({
        type: "success",
        title: "Move undone",
        description: "Candidate returned to previous column",
      });
      setLastMove(null);
    } catch (error) {
      // Rollback the undo
      optimisticMove(candidateId, from, to);
      toast({
        type: "error",
        title: "Undo failed",
        description: "Could not undo the move",
      });
    }
  }, [lastMove, optimisticMove, moveCandidate, toast]);

  // Handle bulk actions
  const handleBulkMove = useCallback(async (targetStatus: PipelineStatus) => {
    const candidateIds = Array.from(selectedCandidates);
    if (candidateIds.length === 0) return;

    try {
      const result = await bulkMoveCandidate(candidateIds, targetStatus);
      
      if (result) {
        if (result.partial) {
          toast({
            type: "warning",
            title: "Partial success",
            description: `${result.success.length} moved, ${result.failed.length} failed`,
          });
        } else {
          toast({
            type: "success",
            title: "Bulk move completed",
            description: `${result.success.length} candidates moved to ${targetStatus}`,
          });
        }
        
        clearSelection();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Bulk move failed",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [selectedCandidates, bulkMoveCandidate, toast, clearSelection, onRefresh]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Global shortcuts
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        // TODO: Open shortcuts help modal
        console.log("Show shortcuts help");
      }
      
      if (event.key === 'Escape') {
        clearSelection();
      }
      
      // Bulk actions with selection
      if (selectedCandidates.size > 0) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          // TODO: Handle bulk delete/reject
          console.log("Bulk delete/reject");
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedCandidates.size, clearSelection]);

  return (
    <div className="flex flex-col h-full">
      {/* Bulk Action Bar */}
      {selectedCandidates.size > 0 && (
        <BulkActionBar
          selectedCount={selectedCandidates.size}
          onMove={handleBulkMove}
          onExport={() => onBulkExport(Array.from(selectedCandidates))}
          onClear={clearSelection}
          columns={columns.map(c => ({ id: c.id, title: c.title }))}
        />
      )}

      {/* Kanban Board */}
      <div className="flex-1 overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div 
            className="flex gap-6 p-6 min-h-full"
            role="application"
            aria-label="Recruitment pipeline kanban board"
          >
            {columns.map((column) => (
              <PipelineColumn
                key={column.id}
                column={column}
                selectedCandidates={selectedCandidates}
                onCandidateSelect={handleCandidateSelect}
                onCandidateOpen={onCandidateOpen}
                onCandidateAssign={onCandidateAssign}
                onCandidateMessage={onCandidateMessage}
                onCandidateSchedule={onCandidateSchedule}
                onAddCandidate={onAddCandidate}
                onColumnSettings={onColumnSettings}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeCandidate ? (
              <Card className="rotate-3 shadow-2xl opacity-95">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {activeCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{activeCandidate.name}</h3>
                      <p className="text-xs text-muted-foreground">{activeCandidate.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};