// File: src/hooks/useRecruitmentAPI.ts
// API integration hooks for recruitment pipeline

import { useState, useCallback } from "react";
import { Candidate, PipelineStatus, MoveResponse, BulkMoveResponse, ApiResponse } from "@/types/recruitment";

const API_BASE = "/api"; // Replace with actual API base

export const useRecruitmentAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // Add auth header
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const moveCandidate = useCallback(async (
    candidateId: string,
    from: PipelineStatus,
    to: PipelineStatus,
    reason?: string
  ): Promise<MoveResponse | null> => {
    const result = await apiCall<MoveResponse>(`/candidates/${candidateId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        from,
        to,
        reason: reason || "manual_move",
        movedBy: "current_user", // Replace with actual user ID
      }),
    });

    return result.success ? result.data! : null;
  }, [apiCall]);

  const bulkMoveCandidate = useCallback(async (
    candidateIds: string[],
    to: PipelineStatus
  ): Promise<BulkMoveResponse | null> => {
    const result = await apiCall<BulkMoveResponse>("/candidates/bulk/move", {
      method: "POST",
      body: JSON.stringify({
        candidateIds,
        to,
        movedBy: "current_user", // Replace with actual user ID
      }),
    });

    return result.success ? result.data! : null;
  }, [apiCall]);

  const assignCandidate = useCallback(async (
    candidateId: string,
    assigneeId: string
  ): Promise<boolean> => {
    const result = await apiCall(`/candidates/${candidateId}/actions/assign`, {
      method: "POST",
      body: JSON.stringify({ assigneeId }),
    });

    return result.success;
  }, [apiCall]);

  const scheduleInterview = useCallback(async (
    candidateId: string,
    jobId: string,
    startTime: string,
    endTime: string,
    participants: string[]
  ): Promise<boolean> => {
    const result = await apiCall("/interviews", {
      method: "POST",
      body: JSON.stringify({
        candidateId,
        jobId,
        startTime,
        endTime,
        participants,
        location: "Zoom", // Default location
        metadata: {},
      }),
    });

    return result.success;
  }, [apiCall]);

  const sendNotification = useCallback(async (
    type: "email" | "sms",
    to: string[],
    template: string,
    payload: Record<string, any>
  ): Promise<boolean> => {
    const result = await apiCall("/notifications", {
      method: "POST",
      body: JSON.stringify({
        type,
        to,
        template,
        payload,
      }),
    });

    return result.success;
  }, [apiCall]);

  return {
    loading,
    error,
    moveCandidate,
    bulkMoveCandidate,
    assignCandidate,
    scheduleInterview,
    sendNotification,
  };
};