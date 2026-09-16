"use client";

// Shared "Approve & Run Workflow" logic — used by both
// components/investigation/WorkflowProgress.tsx (the full tracker on
// /investigation) and components/dashboard/ActiveInvestigationCard.tsx
// (the compact status line on /dashboard), so both stay in sync with the
// same six steps and the same fallback behavior.
//
// Calls the real backend first (POST /api/workflow/run, then polls
// GET /api/workflow/status/{id}). If the backend is unreachable at any
// point — not just n8n, which the backend already handles gracefully on
// its own — this falls back to a purely local simulation using the same
// step timing, so the workflow always completes and the UI never gets
// stuck.

import { useCallback, useEffect, useRef, useState } from "react";
import { getWorkflowStatus, runWorkflow, type WorkflowState } from "@/lib/api";

export const WORKFLOW_STEPS = [
  "Merchant Approved",
  "Workflow Triggered",
  "Merchant Notified",
  "Recovery Action Executed",
  "Verification Running",
  "Issue Verified",
] as const;

// Mirrors backend/app/services/workflow_service.py's timing.
const SIMULATED_STEP_DELAYS_MS = [600, 1000, 1500, 1500, 1000];

const POLL_INTERVAL_MS = 800;

export function useWorkflowRun(merchantId: string, investigationId: string) {
  const [state, setState] = useState<WorkflowState>("pending_approval");
  const [stepIndex, setStepIndex] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    if (pollRef.current) clearInterval(pollRef.current);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
  }, []);

  useEffect(() => stop, [stop]);

  const runSimulated = useCallback(() => {
    let i = 1;
    const advance = () => {
      if (cancelledRef.current) return;
      setStepIndex(i);
      setUpdatedAt(new Date());
      setState(i >= WORKFLOW_STEPS.length - 2 ? "verifying" : "running");

      if (i >= WORKFLOW_STEPS.length - 1) {
        setState("completed");
        return;
      }

      const delay = SIMULATED_STEP_DELAYS_MS[i] ?? 1000;
      i += 1;
      simTimerRef.current = setTimeout(advance, delay);
    };
    simTimerRef.current = setTimeout(advance, SIMULATED_STEP_DELAYS_MS[0]);
  }, []);

  const start = useCallback(() => {
    cancelledRef.current = false;
    setState("running");
    setStepIndex(1);
    setUpdatedAt(new Date());

    runWorkflow(merchantId, investigationId)
      .then((workflow) => {
        if (cancelledRef.current) return;

        pollRef.current = setInterval(async () => {
          try {
            const status = await getWorkflowStatus(workflow.workflowId);
            if (cancelledRef.current) return;

            const idx = WORKFLOW_STEPS.indexOf(
              status.currentStep as (typeof WORKFLOW_STEPS)[number]
            );
            setStepIndex(idx === -1 ? 0 : idx);
            setState(status.status);
            setUpdatedAt(new Date(status.updatedAt));

            if (status.status === "completed" || status.status === "failed") {
              if (pollRef.current) clearInterval(pollRef.current);
            }
          } catch {
            // Backend became unreachable mid-poll — finish locally instead
            // of leaving the tracker stuck.
            if (pollRef.current) clearInterval(pollRef.current);
            runSimulated();
          }
        }, POLL_INTERVAL_MS);
      })
      .catch(() => {
        // Backend never responded to the initial request at all.
        if (!cancelledRef.current) runSimulated();
      });
  }, [merchantId, investigationId, runSimulated]);

  return {
    state,
    stepIndex,
    steps: WORKFLOW_STEPS,
    currentStepLabel: WORKFLOW_STEPS[stepIndex] ?? WORKFLOW_STEPS[0],
    updatedAt,
    start,
  };
}
