"use client";

import { memo, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import {
  revenueAnalytics14d as defaultAnalytics,
  type RevenueAnalyticsPoint,
} from "@/lib/demoData";

const RevenueAreaChart = dynamic(
  () => import("@/components/dashboard/RevenueAreaChart").then((m) => m.RevenueAreaChart),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse rounded-xl bg-muted-surface/60" />,
  }
);

type Metric = "revenue" | "transactions" | "refunds";

const metrics: { id: Metric; label: string; color: string; format: (v: number) => string }[] = [
  { id: "revenue", label: "Revenue", color: "#F5C542", format: (v) => `₹${v.toLocaleString("en-IN")}` },
  { id: "transactions", label: "Transactions", color: "#111111", format: (v) => v.toLocaleString("en-IN") },
  { id: "refunds", label: "Refunds", color: "#F59E0B", format: (v) => v.toLocaleString("en-IN") },
];

function RevenueAnalyticsCardBase({
  data = defaultAnalytics,
}: {
  data?: RevenueAnalyticsPoint[];
}) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const active = metrics.find((m) => m.id === metric)!;

  const anomalyIndex = useMemo(() => {
    const flagged = data.findIndex((d) => d.isAnomaly);
    return flagged === -1 ? data.length - 1 : flagged;
  }, [data]);
  const anomalyPoint = data[anomalyIndex];

  return (
    <DashboardCard className="col-span-12 xl:col-span-8" delay={0.24}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-caps text-ink-secondary">Revenue Analytics</p>
          <p className="mt-1 font-heading text-xl font-bold text-ink">Last 14 Days</p>
        </div>

        <div role="tablist" aria-label="Chart metric" className="inline-flex rounded-full border border-border bg-muted-surface/60 p-1">
          {metrics.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={metric === m.id}
              onClick={() => setMetric(m.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95",
                metric === m.id
                  ? "bg-ink text-background"
                  : "text-ink-secondary hover:text-ink"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/[0.06] px-3.5 py-2.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
        <p className="text-xs text-ink-secondary">
          Revenue dropped sharply on{" "}
          <span className="font-semibold text-ink">{anomalyPoint.label}</span> — highlighted below.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={metric}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 h-[280px] w-full"
        >
          <RevenueAreaChart
            data={data}
            metric={metric}
            color={active.color}
            format={active.format}
            anomalyPoint={anomalyPoint}
          />
        </motion.div>
      </AnimatePresence>
    </DashboardCard>
  );
}

// Memoized: on the dashboard, a workflow completing re-fetches only
// history/memory, leaving this component's `data` prop referentially
// unchanged — memo lets it skip re-rendering (and re-animating) then.
export const RevenueAnalyticsCard = memo(RevenueAnalyticsCardBase);
