"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkflowRun } from "@/lib/useWorkflowRun";

export function WorkflowProgress({
  merchantId,
  investigationId,
}: {
  merchantId: string;
  investigationId: string;
}) {
  const { state, stepIndex, steps, start } = useWorkflowRun(merchantId, investigationId);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDone = state === "completed";
  const isFailed = state === "failed";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <p className="label-caps text-white/40">Workflow Progress</p>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
            isDone && "bg-success/10 text-success",
            isFailed && "bg-red-500/10 text-red-400",
            !isDone && !isFailed && "bg-brand-yellow/10 text-brand-yellow"
          )}
        >
          {state === "pending_approval" ? "Pending Approval" : state}
        </span>
      </div>

      <div className="relative mt-5">
        <div className="absolute left-[7px] top-1 h-[calc(100%-8px)] w-px bg-white/10" />
        <ul className="space-y-4">
          {steps.map((label, i) => {
            const done = isDone || i < stepIndex;
            const isCurrent = !isDone && !isFailed && i === stepIndex;
            const failedHere = isFailed && i === stepIndex;

            return (
              <li key={label} className="relative flex items-center gap-3 pl-7">
                <span
                  className={cn(
                    "absolute left-0 flex h-4 w-4 items-center justify-center rounded-full",
                    done && "bg-success",
                    isCurrent && "bg-brand-yellow",
                    failedHere && "bg-red-500",
                    !done && !isCurrent && !failedHere && "bg-white/10"
                  )}
                >
                  {done && <Check className="h-2.5 w-2.5 text-ink" />}
                  {isCurrent && <Loader2 className="h-2.5 w-2.5 animate-spin text-ink" />}
                  {failedHere && <X className="h-2.5 w-2.5 text-white" />}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    done && "text-white",
                    isCurrent && "font-semibold text-brand-yellow",
                    failedHere && "font-semibold text-red-400",
                    !done && !isCurrent && !failedHere && "text-white/40"
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {isDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs font-semibold text-success"
        >
          Workflow completed — issue verified.
        </motion.p>
      )}
      {isFailed && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-xs font-semibold text-red-400"
        >
          Workflow failed. Please try approving again.
        </motion.p>
      )}
    </div>
  );
}
