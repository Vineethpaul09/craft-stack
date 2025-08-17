import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./StatusBadge";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Building2,
  Eye,
  Edit
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  salary: string;
  description: string;
  requirements: string[];
  status: "active" | "draft" | "closed";
  postedDate: string;
  applicationCount: number;
  department: string;
}

interface JobCardProps {
  job: Job;
  onViewApplications: (id: string) => void;
  onEditJob: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const JobCard = ({ 
  job, 
  onViewApplications,
  onEditJob,
  onViewDetails 
}: JobCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-elegant transition-all duration-200 border-l-4 border-l-accent">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{job.company}</span>
              <Badge variant="outline" className="text-xs">
                {job.department}
              </Badge>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-1">{job.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {job.type}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {job.salary}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <StatusBadge status={job.status} />
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              {job.applicationCount} applications
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-3">
          {job.description}
        </p>

        {/* Requirements */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Requirements:</h4>
          <div className="flex flex-wrap gap-1">
            {job.requirements.slice(0, 3).map((req) => (
              <Badge key={req} variant="secondary" className="text-xs">
                {req}
              </Badge>
            ))}
            {job.requirements.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.requirements.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Posted Date */}
        <div className="flex items-center text-xs text-muted-foreground pt-2 border-t">
          <Calendar className="w-3 h-3 mr-1" />
          Posted {job.postedDate}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewApplications(job.id)}
              disabled={job.applicationCount === 0}
            >
              <Users className="w-4 h-4 mr-1" />
              View Applications ({job.applicationCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(job.id)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditJob(job.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;