import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useJobs } from "@/hooks/useJobs";
import { useCandidates } from "@/hooks/useCandidates";
import MetricsCard from "@/components/MetricsCard";
import JobCard from "@/components/JobCard";

import { 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp,
  Plus,
  Building2,
  LogOut
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, signOut, isRecruiter } = useAuth();
  const tenantId = profile?.tenant_id;
  const { jobs } = useJobs(tenantId);
  const { candidates } = useCandidates(tenantId);
  const navigate = useNavigate();

  const activeJobs = jobs.filter(j => j.status === 'active' || j.status === 'open');
  const totalApplications = jobs.reduce((sum, job) => sum + (job.application_count || 0), 0);

  const handleViewApplications = (id: string) => {
    navigate(`/jobs/${id}/applications`);
  };

  const handleEditJob = (id: string) => {
    navigate(`/jobs/${id}/edit`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-gradient-hero text-white shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Building2 className="w-10 h-10" />
              <div>
                <h1 className="text-2xl font-heading font-bold">TalentPro</h1>
                <p className="text-white/80 text-sm">{profile?.tenant_name || 'Recruitment Platform'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{profile?.full_name}</p>
                <p className="text-xs text-white/80">{profile?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={signOut} className="text-white border-white hover:bg-white hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-2/3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            {isRecruiter && <TabsTrigger value="candidates">Candidates</TabsTrigger>}
            {isRecruiter && <TabsTrigger value="pipeline">Pipeline</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsCard
                title="Total Candidates"
                value={candidates.length.toString()}
                change="Active applicants"
                changeType="neutral"
                icon={Users}
              />
              <MetricsCard
                title="Active Jobs"
                value={activeJobs.length.toString()}
                change={`${jobs.length} total`}
                changeType="positive"
                icon={Briefcase}
              />
              <MetricsCard
                title="Total Applications"
                value={totalApplications.toString()}
                change="All time"
                changeType="neutral"
                icon={Calendar}
              />
              <MetricsCard
                title="Open Positions"
                value={activeJobs.length.toString()}
                change="Ready to hire"
                changeType="positive"
                icon={TrendingUp}
              />
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {isRecruiter && (
                  <>
                    <Button onClick={() => navigate('/jobs/new')} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      New Job
                    </Button>
                    <Button onClick={() => navigate('/pipeline')} variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      View Pipeline
                    </Button>
                  </>
                )}
                <Button onClick={() => navigate('/jobs')} variant="outline" className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button onClick={() => navigate('/profile')} variant="outline" className="w-full">
                  Profile Settings
                </Button>
              </CardContent>
            </Card>

            {/* Recent Jobs */}
            {isRecruiter && jobs.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Job Postings
                    <Button variant="ghost" size="sm" onClick={() => navigate('/jobs')}>
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {jobs.slice(0, 2).map((job) => (
                      <JobCard
                        key={job.id}
                        job={{
                          id: job.id,
                          title: job.title,
                          company: profile?.tenant_name || 'Company',
                          location: 'Remote',
                          type: 'Full-time' as const,
                          salary: 'Competitive',
                          description: job.description || '',
                          requirements: [],
                          status: job.status as any || 'active',
                          postedDate: new Date(job.created_at || '').toLocaleDateString(),
                          applicationCount: job.application_count || 0,
                          department: 'General'
                        }}
                        onViewApplications={handleViewApplications}
                        onEditJob={handleEditJob}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6 mt-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  All Job Postings
                  {isRecruiter && (
                    <Button onClick={() => navigate('/jobs/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Job
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {isRecruiter ? 'Create your first job posting to start recruiting.' : 'No jobs are currently available.'}
                    </p>
                    {isRecruiter && (
                      <Button onClick={() => navigate('/jobs/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Job
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={{
                          id: job.id,
                          title: job.title,
                          company: profile?.tenant_name || 'Company',
                          location: 'Remote',
                          type: 'Full-time' as const,
                          salary: 'Competitive',
                          description: job.description || '',
                          requirements: [],
                          status: job.status as any || 'active',
                          postedDate: new Date(job.created_at || '').toLocaleDateString(),
                          applicationCount: job.application_count || 0,
                          department: 'General'
                        }}
                        onViewApplications={handleViewApplications}
                        onEditJob={handleEditJob}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isRecruiter && (
            <>
              <TabsContent value="candidates" className="space-y-6 mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>All Candidates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{candidates.length} Total Candidates</h3>
                      <p className="text-muted-foreground mb-4">
                        View detailed candidate information in the Pipeline view
                      </p>
                      <Button onClick={() => navigate('/pipeline')}>
                        Open Pipeline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pipeline" className="space-y-6 mt-6">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Recruitment Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-lg font-heading font-semibold mb-2">
                        Kanban Pipeline Ready
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Drag-and-drop candidates through your recruitment stages
                      </p>
                      <Button onClick={() => navigate('/pipeline')}>
                        Open Pipeline View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
