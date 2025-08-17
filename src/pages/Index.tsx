import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import Header from "@/components/Header";
import CandidateCard from "@/components/CandidateCard";
import JobCard from "@/components/JobCard";
import MetricsCard from "@/components/MetricsCard";

import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Filter,
  Download,
  Plus
} from "lucide-react";

// Mock data - in real app, this would come from Supabase
const mockCandidates = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    position: "Senior Full Stack Developer",
    experience: "5+ years",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    status: "interview" as const,
    appliedDate: "2 days ago",
    rating: 4.8,
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "Seattle, WA",
    position: "DevOps Engineer",
    experience: "7+ years",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "Python"],
    status: "screening" as const,
    appliedDate: "1 week ago",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com", 
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    position: "Product Manager",
    experience: "6+ years",
    skills: ["Product Strategy", "Agile", "Analytics", "Roadmapping"],
    status: "offer" as const,
    appliedDate: "3 days ago",
    rating: 4.9,
  }
];

const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time" as const,
    salary: "$120,000 - $160,000",
    description: "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building scalable, performant user interfaces using modern web technologies.",
    requirements: ["React", "TypeScript", "CSS-in-JS", "Testing", "GraphQL"],
    status: "active" as const,
    postedDate: "5 days ago",
    applicationCount: 24,
    department: "Engineering"
  },
  {
    id: "2",
    title: "Product Designer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time" as const,
    salary: "$110,000 - $140,000",
    description: "Join our design team to create beautiful, user-centered experiences. You'll work closely with product and engineering teams to ship features that delight users.",
    requirements: ["Figma", "User Research", "Prototyping", "Design Systems"],
    status: "active" as const,
    postedDate: "1 week ago",
    applicationCount: 18,
    department: "Design"
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "DataFlow Corp",
    location: "New York, NY",
    type: "Contract" as const,
    salary: "$80-100/hour",
    description: "Build scalable backend systems that handle millions of requests. Work with modern technologies and be part of a high-performing engineering team.",
    requirements: ["Python", "PostgreSQL", "Redis", "Microservices", "AWS"],
    status: "draft" as const,
    postedDate: "Draft",
    applicationCount: 0,
    department: "Engineering"
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleViewProfile = (id: string) => {
    console.log("View profile:", id);
    // TODO: Implement profile view
  };

  const handleScheduleInterview = (id: string) => {
    console.log("Schedule interview:", id);
    // TODO: Implement interview scheduling
  };

  const handleUpdateStatus = (id: string, status: string) => {
    console.log("Update status:", id, status);
    // TODO: Implement status update
  };

  const handleViewApplications = (id: string) => {
    console.log("View applications:", id);
    // TODO: Implement applications view
  };

  const handleEditJob = (id: string) => {
    console.log("Edit job:", id);
    // TODO: Implement job editing
  };

  const handleViewDetails = (id: string) => {
    console.log("View details:", id);
    // TODO: Implement job details view
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Candidates"
                value="1,247"
                change="+12% from last month"
                changeType="positive"
                icon={Users}
              />
              <MetricsCard
                title="Active Jobs"
                value="23"
                change="+3 new this week"
                changeType="positive" 
                icon={Briefcase}
              />
              <MetricsCard
                title="Interviews Scheduled"
                value="45"
                change="18 this week"
                changeType="neutral"
                icon={Calendar}
              />
              <MetricsCard
                title="Placement Rate"
                value="68%"
                change="+5% improvement"
                changeType="positive"
                icon={TrendingUp}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Candidates
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockCandidates.slice(0, 2).map((candidate) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onViewProfile={handleViewProfile}
                      onScheduleInterview={handleScheduleInterview}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Active Job Postings
                    <Button variant="ghost" size="sm">View All</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockJobs.filter(job => job.status === 'active').slice(0, 2).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onViewApplications={handleViewApplications}
                      onEditJob={handleEditJob}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6 mt-6">
            {/* Filters */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Candidate Pipeline
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Candidate
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <Input placeholder="Search candidates..." />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Positions</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Candidates List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onViewProfile={handleViewProfile}
                  onScheduleInterview={handleScheduleInterview}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6 mt-6">
            {/* Job Management Header */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Job Postings
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Job Posting
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <Input placeholder="Search job postings..." />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onViewApplications={handleViewApplications}
                  onEditJob={handleEditJob}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pipeline" className="space-y-6 mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recruitment Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Pipeline View Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Visual pipeline management with drag-and-drop functionality will be available here.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect Supabase to enable advanced pipeline features and real-time updates.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;