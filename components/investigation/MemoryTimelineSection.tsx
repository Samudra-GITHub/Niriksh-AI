"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { memoryTimeline as defaultMemoryTimeline, type MemoryIncident } from "@/lib/demoData";

function humanize(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const outcomeStyles: Record<string, string> = {
  Resolved: "bg-success/10 text-success",
  Verified: "bg-success/10 text-success",
  Recovered: "bg-success/10 text-success",
};

function outcomeClass(outcome: string) {
  return outcomeStyles[outcome] ?? "bg-white/10 text-white/60";
}

export function MemoryTimelineSection({
  incidents = defaultMemoryTimeline,
}: {
  incidents?: MemoryIncident[];
}) {
  if (incidents.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="label-caps text-white/40">Previous Similar Incidents</p>
        <p className="mt-3 text-sm text-white/50">
          No prior incidents on record yet for this merchant — Niriksh will build this history as
          investigations complete.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="label-caps text-white/40">Previous Similar Incidents</p>

      <div className="relative mt-5">
        <div className="absolute left-[3px] top-1 h-[calc(100%-8px)] w-px bg-white/10" />
        <ul className="space-y-4 pl-5">
          {incidents.map((incident, i) => (
            <motion.li
              key={`${i}-${incident.incidentDate}-${incident.incidentType}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="relative"
            >
              <span className="absolute -left-5 top-1 h-2 w-2 rounded-full bg-brand-yellow ring-4 ring-[#171717]" />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-white/50">{incident.incidentDate}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    outcomeClass(incident.outcome)
                  )}
                >
                  {incident.outcome}
                </span>
              </div>
              <p className="mt-1 text-sm font-bold text-white">{humanize(incident.incidentType)}</p>
              <p className="mt-0.5 text-xs text-white/60">{incident.rootCause}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
