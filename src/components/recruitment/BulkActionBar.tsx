// File: src/components/recruitment/BulkActionBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PipelineStatus } from "@/types/recruitment";
import { X, Download, Send, ArrowRight } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onMove: (targetStatus: PipelineStatus) => void;
  onExport: () => void;
  onClear: () => void;
  columns: Array<{ id: PipelineStatus; title: string }>;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onMove,
  onExport,
  onClear,
  columns,
}) => {
  const [targetStatus, setTargetStatus] = React.useState<PipelineStatus | "">("");

  const handleMove = () => {
    if (targetStatus) {
      onMove(targetStatus as PipelineStatus);
      setTargetStatus("");
    }
  };

  return (
    <Card className="sticky top-0 z-50 shadow-elegant border-primary/20">
      <CardContent className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="text-sm">
                {selectedCount} selected
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                aria-label="Clear selection"
                className="h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Move to:</span>
              <Select 
                value={targetStatus} 
                onValueChange={(value) => setTargetStatus(value as PipelineStatus)}
              >
                <SelectTrigger className="w-48 h-8">
                  <SelectValue placeholder="Select status..." />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleMove}
                disabled={!targetStatus}
                className="h-8"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Move
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-8"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Implement bulk message
                console.log("Bulk message");
              }}
              className="h-8"
            >
              <Send className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};