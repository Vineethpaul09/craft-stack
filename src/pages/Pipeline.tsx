// File: src/pages/Pipeline.tsx
import React, { useState, useCallback } from "react";
import { KanbanBoard } from "@/components/recruitment/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  PipelineColumn, 
  Candidate, 
  PipelineStatus 
} from "@/types/recruitment";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Settings,
  Users,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";

// Mock data for demonstration
const MOCK_CANDIDATES: Candidate[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    avatarUrl: null,
    score: 4.8,
    appliedAt: "2024-01-15T10:00:00Z",
    resumeUrl: "https://example.com/resume-sarah.pdf",
    status: "Applied",
    jobId: "job-1",
    assigneeId: undefined,
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "m.chen@email.com",
    title: "DevOps Engineer",
    location: "Seattle, WA",
    avatarUrl: null,
    score: 4.5,
    appliedAt: "2024-01-12T14:30:00Z",
    resumeUrl: "https://example.com/resume-michael.pdf",
    status: "Screening",
    jobId: "job-2",
    assigneeId: "recruiter-1",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    title: "Product Manager",
    location: "Austin, TX",
    avatarUrl: null,
    score: 4.9,
    appliedAt: "2024-01-18T09:15:00Z",
    resumeUrl: "https://example.com/resume-emily.pdf",
    status: "Phone Screen",
    jobId: "job-1",
    assigneeId: "recruiter-2",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@email.com",
    title: "Frontend Developer",
    location: "Remote",
    avatarUrl: null,
    score: 4.2,
    appliedAt: "2024-01-10T16:45:00Z",
    resumeUrl: "https://example.com/resume-david.pdf",
    status: "Technical Interview",
    jobId: "job-3",
    assigneeId: "recruiter-1",
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@email.com",
    title: "UX Designer",
    location: "New York, NY",
    avatarUrl: null,
    score: 4.7,
    appliedAt: "2024-01-08T11:20:00Z",
    resumeUrl: "https://example.com/resume-lisa.pdf",
    status: "Finalist",
    jobId: "job-2",
    assigneeId: "recruiter-3",
  },
  {
    id: "6",
    name: "James Wilson",
    email: "james.wilson@email.com",
    title: "Backend Engineer",
    location: "Chicago, IL",
    avatarUrl: null,
    score: 4.4,
    appliedAt: "2024-01-05T13:10:00Z",
    resumeUrl: "https://example.com/resume-james.pdf",
    status: "Offer",
    jobId: "job-1",
    assigneeId: "recruiter-2",
  },
];

const INITIAL_COLUMNS: PipelineColumn[] = [
  {
    id: "Applied",
    title: "Applied",
    color: "#6B7280",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Applied"),
  },
  {
    id: "Screening",
    title: "Screening", 
    color: "#F59E0B",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Screening"),
  },
  {
    id: "Phone Screen",
    title: "Phone Screen",
    color: "#3B82F6",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Phone Screen"),
  },
  {
    id: "Technical Interview",
    title: "Technical Interview",
    color: "#8B5CF6",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Technical Interview"),
  },
  {
    id: "Finalist",
    title: "Finalist",
    color: "#06B6D4",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Finalist"),
  },
  {
    id: "Offer",
    title: "Offer",
    color: "#10B981",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Offer"),
  },
  {
    id: "Hired",
    title: "Hired",
    color: "#059669",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Hired"),
  },
  {
    id: "Rejected",
    title: "Rejected",
    color: "#DC2626",
    candidates: MOCK_CANDIDATES.filter(c => c.status === "Rejected"),
  },
];

const Pipeline: React.FC = () => {
  const [columns, setColumns] = useState<PipelineColumn[]>(INITIAL_COLUMNS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Refresh data
  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setColumns(INITIAL_COLUMNS);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Open candidate profile
  const handleCandidateOpen = useCallback((candidateId: string) => {
    console.log("Opening candidate:", candidateId);
    // TODO: Implement candidate drawer/modal
  }, []);

  // Assign candidate  
  const handleCandidateAssign = useCallback((candidateId: string) => {
    console.log("Assigning candidate:", candidateId);
    // TODO: Implement assignment modal
  }, []);

  // Send message to candidate
  const handleCandidateMessage = useCallback((candidateId: string) => {
    console.log("Messaging candidate:", candidateId);
    // TODO: Implement messaging modal
  }, []);

  // Schedule interview
  const handleCandidateSchedule = useCallback((candidateId: string) => {
    console.log("Scheduling interview for candidate:", candidateId);
    // TODO: Implement scheduling modal
  }, []);

  // Add new candidate
  const handleAddCandidate = useCallback((status: PipelineStatus) => {
    console.log("Adding candidate to:", status);
    // TODO: Implement add candidate modal
  }, []);

  // Column settings
  const handleColumnSettings = useCallback((columnId: string) => {
    console.log("Opening settings for column:", columnId);
    // TODO: Implement column settings modal
  }, []);

  // Bulk export
  const handleBulkExport = useCallback((candidateIds: string[]) => {
    console.log("Exporting candidates:", candidateIds);
    // TODO: Implement CSV/PDF export
  }, []);

  // Calculate metrics
  const totalCandidates = MOCK_CANDIDATES.length;
  const inProgress = MOCK_CANDIDATES.filter(c => 
    !["Hired", "Rejected"].includes(c.status)
  ).length;
  const avgTimeInPipeline = "5.2 days"; // Mock calculation
  const conversionRate = "23%"; // Mock calculation

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="border-b bg-white shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Recruitment Pipeline
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage candidates through your hiring process
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log("Open global settings")}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-4 gap-6">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-primary mr-3" />
                  <div>
                    <p className="text-2xl font-bold font-heading">{totalCandidates}</p>
                    <p className="text-xs text-muted-foreground">Total Candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-accent mr-3" />
                  <div>
                    <p className="text-2xl font-bold font-heading">{inProgress}</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-secondary mr-3" />
                  <div>
                    <p className="text-2xl font-bold font-heading">{avgTimeInPipeline}</p>
                    <p className="text-xs text-muted-foreground">Avg Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-accent mr-3" />
                  <div>
                    <p className="text-2xl font-bold font-heading">{conversionRate}</p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Keyboard shortcuts:</span>
              <Badge variant="outline" className="text-xs">? for help</Badge>
              <Badge variant="outline" className="text-xs">ESC to deselect</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="flex-1">
        <KanbanBoard
          columns={columns}
          onCandidateOpen={handleCandidateOpen}
          onCandidateAssign={handleCandidateAssign}
          onCandidateMessage={handleCandidateMessage}
          onCandidateSchedule={handleCandidateSchedule}
          onAddCandidate={handleAddCandidate}
          onColumnSettings={handleColumnSettings}
          onBulkExport={handleBulkExport}
          onRefresh={handleRefresh}
        />
      </main>
    </div>
  );
};

export default Pipeline;