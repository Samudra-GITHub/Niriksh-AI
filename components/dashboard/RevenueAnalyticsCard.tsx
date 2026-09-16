"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import {
  revenueAnalytics14d as defaultAnalytics,
  type RevenueAnalyticsPoint,
} from "@/lib/demoData";

type Metric = "revenue" | "transactions" | "refunds";

const metrics: { id: Metric; label: string; color: string; format: (v: number) => string }[] = [
  { id: "revenue", label: "Revenue", color: "#F5C542", format: (v) => `₹${v.toLocaleString("en-IN")}` },
  { id: "transactions", label: "Transactions", color: "#111111", format: (v) => v.toLocaleString("en-IN") },
  { id: "refunds", label: "Refunds", color: "#F59E0B", format: (v) => v.toLocaleString("en-IN") },
];

export function RevenueAnalyticsCard({
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

        <div className="inline-flex rounded-full border border-border bg-muted-surface/60 p-1">
          {metrics.map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
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
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={active.color} stopOpacity={0.32} />
                  <stop offset="100%" stopColor={active.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#EAE7DE" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#5F6368" }}
                interval={1}
              />
              <YAxis hide domain={["dataMin - 10%", "dataMax + 10%"]} />
              <Tooltip
                content={({ active: tooltipActive, payload, label }) => {
                  if (!tooltipActive || !payload?.length) return null;
                  return (
                    <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-lg">
                      <p className="label-caps text-ink-secondary">{label}</p>
                      <p className="font-heading text-sm font-bold text-ink">
                        {active.format(Number(payload[0].value))}
                      </p>
                    </div>
                  );
                }}
              />
              <ReferenceLine
                x={anomalyPoint.label}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={active.color}
                strokeWidth={2.5}
                fill="url(#analyticsFill)"
                dot={false}
                isAnimationActive
                animationDuration={900}
              />
              <ReferenceDot
                x={anomalyPoint.label}
                y={anomalyPoint[metric]}
                r={5}
                fill="#F59E0B"
                stroke="#fff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>
    </DashboardCard>
  );
}
