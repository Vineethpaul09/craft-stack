// File: src/components/recruitment/CandidateCard.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Candidate } from "@/types/recruitment";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  User,
  MessageCircle,
  Star
} from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  isSelected?: boolean;
  onSelect?: (candidateId: string) => void;
  onOpen: (candidateId: string) => void;
  onAssign: (candidateId: string) => void;
  onQuickMessage: (candidateId: string) => void;
  onSchedule?: (candidateId: string) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected = false,
  onSelect,
  onOpen,
  onAssign,
  onQuickMessage,
  onSchedule,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      type: "candidate",
      candidate,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger open if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return;
    onOpen(candidate.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(candidate.id);
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        cursor-pointer transition-all duration-200 hover:shadow-elegant
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
        ${isSelected ? 'ring-2 ring-primary shadow-glow' : ''}
        border-l-4 border-l-primary bg-white
      `}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Candidate ${candidate.name}, ${candidate.title || 'No title'}, in ${candidate.status}`}
      aria-grabbed={isDragging}
    >
      <CardContent className="p-4">
        {/* Header with Avatar and Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(candidate.id)}
                onClick={(e) => e.stopPropagation()}
                className="rounded border-border"
                aria-label={`Select ${candidate.name}`}
              />
            )}
            <Avatar className="w-10 h-10">
              <AvatarImage src={candidate.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-semibold text-sm truncate">
                {candidate.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {candidate.title || "No title specified"}
              </p>
            </div>
          </div>
          
          {/* Score */}
          {candidate.score && (
            <div className="flex items-center text-xs">
              <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{candidate.score}/5</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-1 mb-3">
          {candidate.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 mr-2" />
              {candidate.location}
            </div>
          )}
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-2" />
            Applied {new Date(candidate.appliedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAssign(candidate.id);
              }}
              aria-label={`Assign ${candidate.name}`}
              className="h-7 px-2"
            >
              <User className="w-3 h-3 mr-1" />
              Assign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onQuickMessage(candidate.id);
              }}
              aria-label={`Message ${candidate.name}`}
              className="h-7 px-2"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Message
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            {candidate.resumeUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(candidate.resumeUrl, '_blank');
                }}
                aria-label={`Download ${candidate.name}'s resume`}
                className="h-7 px-2"
              >
                <FileText className="w-3 h-3" />
              </Button>
            )}
            {onSchedule && candidate.status === "Phone Screen" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSchedule(candidate.id);
                }}
                aria-label={`Schedule interview with ${candidate.name}`}
                className="h-7 px-2"
              >
                <Calendar className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Assignee if present */}
        {candidate.assigneeId && (
          <div className="mt-2 pt-2 border-t">
            <Badge variant="secondary" className="text-xs">
              Assigned to {candidate.assigneeId}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};