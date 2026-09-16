"use client";

import Link from "next/link";
import { ArrowUpRight, Brain } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { memoryTimeline as defaultMemoryTimeline, type MemoryIncident } from "@/lib/demoData";

function humanize(type: string) {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function MerchantMemoryWidget({
  memories = defaultMemoryTimeline,
}: {
  memories?: MemoryIncident[];
}) {
  const mostRecent = memories[0];

  return (
    <DashboardCard className="col-span-12 lg:col-span-5" delay={0.48}>
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-brand-yellow" />
        <p className="label-caps text-ink-secondary">Merchant Memory</p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-xs text-ink-secondary">Recurring incident this week</span>
          <span className="text-sm font-semibold text-ink">
            {mostRecent ? humanize(mostRecent.incidentType) : "None"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-xs text-ink-secondary">Last successful recovery</span>
          <span className="text-sm font-semibold text-ink">
            {mostRecent ? `${mostRecent.outcome} · ${mostRecent.incidentDate}` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-secondary">Total investigations this month</span>
          <span className="text-sm font-semibold text-ink">{memories.length}</span>
        </div>
      </div>

      <Link
        href="/investigation"
        className="group mt-5 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-ink-secondary transition-colors hover:border-ink hover:text-ink"
      >
        View Timeline
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </DashboardCard>
  );
}
