import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "screening" | "interview" | "offer" | "rejected" | "active" | "draft" | "closed";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "screening":
        return {
          label: "Screening",
          className: "status-screening"
        };
      case "interview": 
        return {
          label: "Interview",
          className: "status-interview"
        };
      case "offer":
        return {
          label: "Offer",
          className: "status-offer"
        };
      case "rejected":
        return {
          label: "Rejected", 
          className: "status-rejected"
        };
      case "active":
        return {
          label: "Active",
          className: "status-offer"
        };
      case "draft":
        return {
          label: "Draft",
          className: "bg-muted text-muted-foreground"
        };
      case "closed":
        return {
          label: "Closed",
          className: "bg-muted text-muted-foreground"
        };
      default:
        return {
          label: status,
          className: "bg-muted text-muted-foreground"
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      className={cn(config.className, "text-xs font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;