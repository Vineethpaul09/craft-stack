// File: src/utils/mockApiServer.ts
// Mock API server responses for development and testing

import { 
  Candidate, 
  PipelineStatus, 
  MoveResponse, 
  BulkMoveResponse, 
  ApiResponse 
} from "@/types/recruitment";

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database
let mockCandidates: Candidate[] = [
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
  // Add more mock data as needed
];

export class MockApiServer {
  // Move candidate API
  static async moveCandidate(
    candidateId: string,
    from: PipelineStatus,
    to: PipelineStatus,
    reason?: string
  ): Promise<ApiResponse<MoveResponse>> {
    await delay(300); // Simulate network delay

    // Find candidate
    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) {
      return {
        success: false,
        error: "Candidate not found",
        code: "CANDIDATE_NOT_FOUND"
      };
    }

    // Validate current status
    if (candidate.status !== from) {
      return {
        success: false,
        error: `Candidate is in ${candidate.status}, not ${from}`,
        code: "INVALID_STATUS_TRANSITION"
      };
    }

    // Simulate business rules
    if (from === "Applied" && to === "Offer") {
      return {
        success: false,
        error: "Cannot move directly from Applied to Offer. Must go through screening process.",
        code: "INVALID_TRANSITION"
      };
    }

    // Update candidate status
    candidate.status = to;

    // Simulate automation rule triggers
    const triggeredRules: string[] = [];
    if (to === "Screening") {
      triggeredRules.push("auto-assign-recruiter");
      triggeredRules.push("send-confirmation-email");
    }
    if (to === "Phone Screen") {
      triggeredRules.push("schedule-availability-poll");
    }

    return {
      success: true,
      data: {
        candidateId,
        from,
        to,
        timestamp: new Date().toISOString(),
        triggeredRules
      }
    };
  }

  // Bulk move candidates API
  static async bulkMoveCandidate(
    candidateIds: string[],
    to: PipelineStatus
  ): Promise<ApiResponse<BulkMoveResponse>> {
    await delay(500); // Longer delay for bulk operations

    const success: Array<{ candidateId: string; status: PipelineStatus }> = [];
    const failed: Array<{ candidateId: string; error: string }> = [];

    for (const candidateId of candidateIds) {
      const candidate = mockCandidates.find(c => c.id === candidateId);
      
      if (!candidate) {
        failed.push({
          candidateId,
          error: "Candidate not found"
        });
        continue;
      }

      // Simulate some failures
      if (Math.random() < 0.1) { // 10% failure rate
        failed.push({
          candidateId,
          error: "Temporary server error"
        });
        continue;
      }

      // Update candidate
      candidate.status = to;
      success.push({
        candidateId,
        status: to
      });
    }

    return {
      success: true,
      data: {
        success,
        failed,
        partial: failed.length > 0
      }
    };
  }

  // Assign candidate API
  static async assignCandidate(
    candidateId: string,
    assigneeId: string
  ): Promise<ApiResponse<void>> {
    await delay(200);

    const candidate = mockCandidates.find(c => c.id === candidateId);
    if (!candidate) {
      return {
        success: false,
        error: "Candidate not found"
      };
    }

    candidate.assigneeId = assigneeId;

    return { success: true };
  }

  // Schedule interview API
  static async scheduleInterview(
    candidateId: string,
    jobId: string,
    startTime: string,
    endTime: string,
    participants: string[]
  ): Promise<ApiResponse<{ interviewId: string }>> {
    await delay(400);

    // Simulate scheduling conflicts
    if (Math.random() < 0.2) { // 20% chance of conflict
      return {
        success: false,
        error: "Scheduling conflict detected",
        code: "SCHEDULING_CONFLICT"
      };
    }

    const interviewId = `interview-${Date.now()}`;

    return {
      success: true,
      data: { interviewId }
    };
  }

  // Send notification API
  static async sendNotification(
    type: "email" | "sms",
    to: string[],
    template: string,
    payload: Record<string, any>
  ): Promise<ApiResponse<void>> {
    await delay(300);

    // Simulate delivery failures
    if (Math.random() < 0.05) { // 5% failure rate
      return {
        success: false,
        error: "Failed to send notification",
        code: "DELIVERY_FAILED"
      };
    }

    return { success: true };
  }

  // Get all candidates (for refresh)
  static async getCandidates(): Promise<ApiResponse<Candidate[]>> {
    await delay(200);
    
    return {
      success: true,
      data: [...mockCandidates]
    };
  }
}

// Example CURL commands that would work with a real API:
/*
# Move candidate
curl -X PATCH "https://api.acmeprocure.com/api/candidates/12345/status" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"from":"Applied","to":"Screening","reason":"manual_move","movedBy":"user:678"}'

# Bulk move
curl -X POST "https://api.acmeprocure.com/api/candidates/bulk/move" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"candidateIds":["c1","c2","c3"], "to":"Phone Screen", "movedBy":"user:678"}'

# Assign candidate
curl -X POST "https://api.acmeprocure.com/api/candidates/12345/actions/assign" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"assigneeId":"user:456"}'

# Schedule interview
curl -X POST "https://api.acmeprocure.com/api/interviews" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId":"12345",
    "jobId":"job:789", 
    "startTime":"2025-09-01T15:00:00Z",
    "endTime":"2025-09-01T15:45:00Z",
    "participants":["user:111","user:222"],
    "location":"Zoom",
    "metadata": {}
  }'

# Send notification
curl -X POST "https://api.acmeprocure.com/api/notifications" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "type":"email",
    "to":["candidate:12345"],
    "template":"interview_invite", 
    "payload": {"time":"2025-09-01T15:00:00Z", "link":"https://zoom.us/j/xxx"}
  }'
*/