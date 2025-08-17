// File: src/components/recruitment/PipelineColumn.tsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidateCard } from "./CandidateCard";
import { PipelineColumn as PipelineColumnType, Candidate } from "@/types/recruitment";
import { Plus, Settings, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PipelineColumnProps {
  column: PipelineColumnType;
  selectedCandidates: Set<string>;
  onCandidateSelect: (candidateId: string) => void;
  onCandidateOpen: (candidateId: string) => void;
  onCandidateAssign: (candidateId: string) => void;
  onCandidateMessage: (candidateId: string) => void;
  onCandidateSchedule?: (candidateId: string) => void;
  onAddCandidate: (status: string) => void;
  onColumnSettings: (columnId: string) => void;
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({
  column,
  selectedCandidates,
  onCandidateSelect,
  onCandidateOpen,
  onCandidateAssign,
  onCandidateMessage,
  onCandidateSchedule,
  onAddCandidate,
  onColumnSettings,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

  const candidateIds = column.candidates.map(candidate => candidate.id);

  return (
    <Card
      ref={setNodeRef}
      className={`
        min-w-[320px] max-w-[320px] shadow-card transition-all duration-200
        ${isOver ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''}
      `}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
              aria-hidden="true"
            />
            <CardTitle className="text-sm font-medium">
              {column.title}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {column.candidates.length}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddCandidate(column.id)}
              aria-label={`Add candidate to ${column.title}`}
              className="h-7 w-7 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={`${column.title} column settings`}
                  className="h-7 w-7 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onColumnSettings(column.id)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddCandidate(column.id)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
          <div 
            className="space-y-3 min-h-[200px]"
            role="list"
            aria-label={`${column.title} candidates`}
          >
            {column.candidates.map((candidate) => (
              <div key={candidate.id} role="listitem">
                <CandidateCard
                  candidate={candidate}
                  isSelected={selectedCandidates.has(candidate.id)}
                  onSelect={onCandidateSelect}
                  onOpen={onCandidateOpen}
                  onAssign={onCandidateAssign}
                  onQuickMessage={onCandidateMessage}
                  onSchedule={onCandidateSchedule}
                />
              </div>
            ))}
            
            {column.candidates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-4xl mb-2" role="img" aria-label="Empty">
                  📋
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  No candidates in {column.title.toLowerCase()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddCandidate(column.id)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Candidate
                </Button>
              </div>
            )}
          </div>
        </SortableContext>
      </CardContent>
    </Card>
  );
};