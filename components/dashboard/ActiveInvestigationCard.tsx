"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Search } from "lucide-react";
import {
  DEFAULT_MERCHANT_ID,
  activeInvestigation as defaultActiveInvestigation,
  type ActiveInvestigationData,
} from "@/lib/demoData";
import { useWorkflowRun } from "@/lib/useWorkflowRun";
import { cn } from "@/lib/utils";

const stateStyles: Record<string, string> = {
  running: "bg-brand-yellow/10 text-brand-yellow",
  verifying: "bg-brand-yellow/10 text-brand-yellow",
  completed: "bg-success/10 text-success",
  failed: "bg-red-500/10 text-red-400",
};

export function ActiveInvestigationCard({
  data = defaultActiveInvestigation,
  onWorkflowCompleted,
}: {
  data?: ActiveInvestigationData;
  onWorkflowCompleted?: () => void;
}) {
  const workflow = useWorkflowRun(DEFAULT_MERCHANT_ID, data.investigationId);
  const triggered = workflow.state !== "pending_approval";
  const completedFiredRef = useRef(false);

  useEffect(() => {
    if (workflow.state === "completed" && !completedFiredRef.current) {
      completedFiredRef.current = true;
      onWorkflowCompleted?.();
    }
  }, [workflow.state, onWorkflowCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -4 }}
      className="col-span-12 rounded-2xl border border-ink bg-ink p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-24px_rgba(17,17,17,0.6)] sm:p-6 xl:col-span-4"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow" />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-yellow">
          {data.badge}
        </span>
      </span>

      <p className="mt-4 font-heading text-xl font-bold text-white">
        {data.headline}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-brand-yellow" />
        <p className="text-sm text-white/70">
          Likely root cause:{" "}
          <span className="font-semibold text-white">{data.rootCause}</span>
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-white/40">
          <span>Confidence</span>
          <span className="font-semibold text-brand-yellow">{data.confidence}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.confidence}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-brand-yellow"
          />
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {data.evidence.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {item}
          </li>
        ))}
      </ul>

      {triggered && (
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
          <div className="flex items-center justify-between">
            <span className="label-caps text-white/40">Workflow Status</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em]",
                stateStyles[workflow.state] ?? "bg-white/10 text-white/60"
              )}
            >
              {workflow.state}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/60">
            Last action executed: <span className="text-white/80">{workflow.currentStepLabel}</span>
          </p>
          <p className="mt-1 text-xs text-white/40">
            {workflow.state === "completed" || workflow.state === "verifying"
              ? "Last verification: "
              : "Updated: "}
            {workflow.updatedAt ? workflow.updatedAt.toLocaleTimeString() : "—"}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link
          href="/investigation"
          className="group inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-3 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          View Investigation
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        {!triggered && (
          <button
            type="button"
            onClick={() => workflow.start()}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40"
          >
            Approve &amp; Run Workflow
          </button>
        )}
      </div>
    </motion.div>
  );
}
