// File: src/types/recruitment.ts
// Complete TypeScript definitions for recruitment pipeline

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  title?: string;
  location?: string;
  avatarUrl?: string | null;
  score?: number | null;
  appliedAt: string;
  resumeUrl?: string;
  status: PipelineStatus;
  assigneeId?: string;
  jobId: string;
  metadata?: Record<string, any>;
}

export type PipelineStatus = 
  | "Applied"
  | "Screening" 
  | "Phone Screen"
  | "Technical Interview"
  | "Finalist"
  | "Offer"
  | "Hired"
  | "Rejected";

export interface PipelineColumn {
  id: PipelineStatus;
  title: string;
  color: string;
  candidates: Candidate[];
  automationRules?: AutomationRule[];
}

export interface AutomationRule {
  ruleId: string;
  active: boolean;
  trigger: {
    on: "candidate.moved" | "candidate.assigned" | "time.elapsed";
    to?: PipelineStatus;
    from?: PipelineStatus;
  };
  conditions?: Array<{
    field: string;
    operator: "<" | ">" | "=" | "!=" | "contains";
    value: any;
  }>;
  actions: Array<{
    type: "assign" | "notify" | "schedule" | "tag";
    payload: Record<string, any>;
  }>;
  retry?: {
    attempts: number;
    backoff: "linear" | "exponential";
  };
}

export interface CandidateAction {
  type: "move" | "assign" | "message" | "schedule" | "score" | "reject";
  candidateId: string;
  payload?: Record<string, any>;
  userId: string;
  timestamp: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobId: string;
  startTime: string;
  endTime: string;
  participants: string[];
  location: string;
  metadata?: Record<string, any>;
}

export interface BulkAction {
  type: "move" | "assign" | "message" | "export" | "delete";
  candidateIds: string[];
  payload?: Record<string, any>;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface MoveResponse {
  candidateId: string;
  from: PipelineStatus;
  to: PipelineStatus;
  timestamp: string;
  triggeredRules?: string[];
}

export interface BulkMoveResponse {
  success: Array<{ candidateId: string; status: PipelineStatus }>;
  failed: Array<{ candidateId: string; error: string }>;
  partial: boolean;
}