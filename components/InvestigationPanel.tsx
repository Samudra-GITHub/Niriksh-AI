"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  FileSearch,
  MessageCircle,
  Moon,
  Search,
  Sparkles,
  TrendingDown,
  Workflow,
} from "lucide-react";
import {
  DEFAULT_MERCHANT_ID,
  investigationReport as defaultInvestigationReport,
  memoryTimeline as defaultMemoryTimeline,
  type InvestigationReportData,
  type MemoryIncident,
} from "@/lib/demoData";
import { MemoryInsightCard } from "@/components/investigation/MemoryInsightCard";
import { MemoryTimelineSection } from "@/components/investigation/MemoryTimelineSection";
import { VoiceCopilot } from "@/components/investigation/VoiceCopilot";
import { WorkflowProgress } from "@/components/investigation/WorkflowProgress";

function findRelevantMemory(
  rootCause: string,
  memories: MemoryIncident[]
): MemoryIncident | undefined {
  const lowered = rootCause.toLowerCase();
  return memories.find((m) => lowered.includes(m.incidentType.split("_")[0]));
}

const metrics = [
  { label: "Revenue", value: "↓ 24%", icon: TrendingDown, tone: "warning" as const },
  { label: "Payment failures", value: "↑ 4.3×", icon: CreditCard, tone: "danger" as const },
  { label: "Evening transactions", value: "↓ 31%", icon: Moon, tone: "warning" as const },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function InvestigationPanel({
  data = defaultInvestigationReport,
  memory = defaultMemoryTimeline,
}: {
  data?: InvestigationReportData;
  memory?: MemoryIncident[];
}) {
  const relevantMemory = useMemo(
    () => findRelevantMemory(data.rootCause, memory),
    [data.rootCause, memory]
  );
  const [approved, setApproved] = useState(false);

  return (
    <div>
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-yellow">
            Investigation Running
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-2.5 py-1">
          <Sparkles className="h-3 w-3 text-brand-yellow" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-yellow">
            Powered by Sarvam AI
          </span>
        </span>
        <span className="text-xs text-white/40">Merchant · Kavita General Store</span>
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="show"
        custom={1}
        variants={fadeUp}
        className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
      >
        Live Investigation
      </motion.h1>

      <motion.div
        initial="hidden"
        animate="show"
        custom={2}
        variants={fadeUp}
        className="mt-4 flex items-center gap-2 text-white/60"
      >
        <FileSearch className="h-4 w-4 text-brand-yellow" />
        <p className="text-sm">{data.anomalyTitle} — investigation launched automatically.</p>
      </motion.div>

      {/* Voice copilot (Sarvam Speech) */}
      <VoiceCopilot merchantMessage={data.merchantMessage} />

      {/* Metrics */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={3}
        variants={fadeUp}
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-center justify-between">
              <span className="label-caps text-white/40">{m.label}</span>
              <m.icon className={m.tone === "danger" ? "h-3.5 w-3.5 text-red-400" : "h-3.5 w-3.5 text-warning"} />
            </div>
            <p
              className={
                "mt-2 font-heading text-2xl font-extrabold tabular-nums " +
                (m.tone === "danger" ? "text-red-400" : "text-warning")
              }
            >
              {m.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Checklist */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={4}
        variants={fadeUp}
        className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <p className="label-caps text-white/40">Investigation Checklist</p>
        <ul className="mt-4 space-y-3">
          {data.evidence.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
              className="flex items-center gap-2.5 text-sm text-white/80"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {item}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Root cause */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={5}
        variants={fadeUp}
        className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-brand-yellow" />
          <p className="label-caps text-white/40">Root Cause</p>
        </div>
        <p className="mt-2 font-heading text-lg font-bold text-white">
          {data.rootCause}
        </p>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[11px] text-white/40">
            <span>Confidence</span>
            <span className="font-semibold text-brand-yellow">{data.confidence}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: data.confidence / 100 }}
              transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full w-full origin-left rounded-full bg-brand-yellow"
            />
          </div>
        </div>
      </motion.div>

      {/* Previous similar incidents (Cognee-backed merchant memory) */}
      <MemoryTimelineSection incidents={memory} />
      {relevantMemory && <MemoryInsightCard incident={relevantMemory} />}

      {/* Merchant message */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={5.5}
        variants={fadeUp}
        className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-brand-yellow" />
          <p className="label-caps text-white/40">Merchant Message</p>
        </div>
        <p className="mt-2 text-sm italic text-white/70">&ldquo;{data.merchantMessage}&rdquo;</p>
      </motion.div>

      {/* Action */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={6}
        variants={fadeUp}
        className="mt-4 rounded-2xl border border-success/25 bg-success/[0.06] p-5"
      >
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-success" />
          <p className="label-caps text-success/80">Action · {data.workflowStatus}</p>
        </div>
        <p className="mt-2 font-heading text-lg font-bold text-white">
          Recovery workflow ready
        </p>
        <p className="mt-1 text-sm text-white/50">
          {data.recommendedActions.join(" ")}
        </p>
      </motion.div>

      {/* Buttons / live workflow status */}
      <motion.div initial="hidden" animate="show" custom={7} variants={fadeUp} className="mt-7">
        {approved ? (
          <WorkflowProgress
            merchantId={DEFAULT_MERCHANT_ID}
            investigationId={data.investigationId}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setApproved(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
            >
              Approve &amp; Run Workflow
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 active:scale-95"
            >
              View Evidence
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
