import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type JobRow = Database['public']['Tables']['jobs']['Row'];
type JobInsert = Database['public']['Tables']['jobs']['Insert'];
type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export interface Job extends JobRow {
  application_count?: number;
}

export const useJobs = (tenantId?: string) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tenantId) {
      fetchJobs();

      // Subscribe to realtime updates
      const channel = supabase
        .channel('jobs-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'jobs', filter: `tenant_id=eq.${tenantId}` },
          () => {
            fetchJobs();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [tenantId]);

  const fetchJobs = async () => {
    if (!tenantId) return;

    try {
      // First get jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // Then get application counts for each job
      const jobsWithCounts = await Promise.all(
        (jobsData || []).map(async (job) => {
          const { count } = await supabase
            .from('candidates')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', job.id);
          
          return {
            ...job,
            application_count: count || 0
          };
        })
      );

      setJobs(jobsWithCounts);
    } catch (error: any) {
      toast({
        title: "Error fetching jobs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: JobInsert) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Job created",
        description: "The job posting has been created successfully."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating job",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateJob = async (id: string, jobData: JobUpdate) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Job updated",
        description: "The job posting has been updated successfully."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating job",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const deleteJob = async (id: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Job deleted",
        description: "The job posting has been deleted successfully."
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error deleting job",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  return {
    jobs,
    loading,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs: fetchJobs
  };
};
