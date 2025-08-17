import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { MapPin, Mail, Phone, Calendar, FileText, Star } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  position: string;
  experience: string;
  skills: string[];
  status: "screening" | "interview" | "offer" | "rejected";
  appliedDate: string;
  rating: number;
  resumeUrl?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onViewProfile: (id: string) => void;
  onScheduleInterview: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const CandidateCard = ({ 
  candidate, 
  onViewProfile,
  onScheduleInterview,
  onUpdateStatus 
}: CandidateCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                {getInitials(candidate.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-heading font-semibold text-lg">{candidate.name}</h3>
              <p className="text-muted-foreground text-sm">{candidate.position}</p>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {candidate.location}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={candidate.status} />
            <div className="flex items-center text-xs text-muted-foreground">
              <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
              {candidate.rating}/5
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {candidate.email}
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            {candidate.phone}
          </div>
        </div>

        {/* Experience & Skills */}
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Experience:</span> {candidate.experience}
          </p>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Applied Date */}
        <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="w-3 h-3 mr-1" />
          Applied {candidate.appliedDate}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewProfile(candidate.id)}
            >
              <FileText className="w-4 h-4 mr-1" />
              View Resume
            </Button>
            {candidate.status === "screening" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onScheduleInterview(candidate.id)}
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Interview
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            ID: {candidate.id}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;