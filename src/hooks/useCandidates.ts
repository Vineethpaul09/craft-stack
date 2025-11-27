import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type CandidateRow = Database['public']['Tables']['candidates']['Row'];
type CandidateInsert = Database['public']['Tables']['candidates']['Insert'];
type CandidateUpdate = Database['public']['Tables']['candidates']['Update'];

export interface Candidate extends CandidateRow {
  job_title?: string;
}

export const useCandidates = (tenantId?: string, jobId?: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (tenantId) {
      fetchCandidates();

      // Subscribe to realtime updates
      const channel = supabase
        .channel('candidates-changes')
        .on('postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'candidates',
            filter: `tenant_id=eq.${tenantId}`
          },
          () => {
            fetchCandidates();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setLoading(false);
    }
  }, [tenantId, jobId]);

  const fetchCandidates = async () => {
    if (!tenantId) return;

    try {
      let query = supabase
        .from('candidates')
        .select(`
          *,
          jobs!inner (
            title
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (jobId) {
        query = query.eq('job_id', jobId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const enrichedCandidates = (data || []).map((candidate: any) => ({
        ...candidate,
        job_title: candidate.jobs?.title
      }));

      setCandidates(enrichedCandidates);
    } catch (error: any) {
      toast({
        title: "Error fetching candidates",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (id: string, status: string, tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({ status })
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase.from('events').insert({
        tenant_id: tenantId,
        event_type: 'candidate_status_updated',
        payload: { candidate_id: id, new_status: status }
      });

      toast({
        title: "Status updated",
        description: `Candidate moved to ${status}.`
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const assignCandidate = async (id: string, assigneeId: string, tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({ assigned_to: assigneeId })
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) throw error;

      await supabase.from('events').insert({
        tenant_id: tenantId,
        event_type: 'candidate_assigned',
        payload: { candidate_id: id, assignee_id: assigneeId }
      });

      toast({
        title: "Candidate assigned",
        description: "The candidate has been assigned successfully."
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error assigning candidate",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const bulkUpdateStatus = async (candidateIds: string[], status: string, tenantId: string) => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .update({ status })
        .in('id', candidateIds)
        .eq('tenant_id', tenantId)
        .select();

      if (error) throw error;

      toast({
        title: "Bulk update completed",
        description: `${candidateIds.length} candidates moved to ${status}.`
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating candidates",
        description: error.message,
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  return {
    candidates,
    loading,
    updateCandidateStatus,
    assignCandidate,
    bulkUpdateStatus,
    refreshCandidates: fetchCandidates
  };
};
