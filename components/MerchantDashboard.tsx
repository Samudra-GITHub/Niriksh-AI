"use client";

import { motion } from "framer-motion";
import {
  ArrowDownRight,
  Bell,
  CheckCircle2,
  CircleDot,
  IndianRupee,
  Loader2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { dashboardTransactions } from "@/lib/data";

function MiniTransactionsChart() {
  return (
    <div className="h-[92px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dashboardTransactions} barGap={4} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="time" hide />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-lg border border-border bg-white px-2.5 py-1.5 text-[11px] shadow-lg">
                  <p className="font-semibold text-ink">{label}</p>
                  <p className="text-success">Success {payload[0]?.value}%</p>
                  <p className="text-warning">Failed {payload[1]?.value}%</p>
                </div>
              );
            }}
          />
          <Bar dataKey="success" stackId="a" fill="#18B368" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={1200} />
          <Bar dataKey="failed" stackId="a" fill="#F5C542" radius={[0, 0, 0, 0]} isAnimationActive animationDuration={1200} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MerchantDashboard({ variant = "floating" }: { variant?: "floating" | "full" }) {
  const isFull = variant === "full";

  return (
    <motion.div
      animate={isFull ? undefined : { y: [0, -10, 0] }}
      transition={isFull ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={
        isFull
          ? "w-full rounded-[28px] border border-border bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-7"
          : "w-full max-w-[440px] rounded-[28px] border border-border bg-white/95 p-5 shadow-[0_30px_80px_-20px_rgba(17,17,17,0.25)] backdrop-blur"
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-ink-secondary">Merchant Overview</p>
          <p className="mt-1 font-heading text-lg font-bold text-ink">Kavita General Store</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1.5">
          <CircleDot className="h-3 w-3 text-success" />
          <span className="text-[11px] font-semibold text-success">Live</span>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-muted-surface/60 p-4">
          <div className="flex items-center justify-between">
            <span className="label-caps text-ink-secondary">Revenue Today</span>
            <IndianRupee className="h-3.5 w-3.5 text-ink-secondary" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-2xl font-extrabold tabular-nums text-ink">
              3.58L
            </span>
            <span className="mb-1 flex items-center gap-0.5 text-xs font-semibold text-warning">
              <ArrowDownRight className="h-3.5 w-3.5" />
              24%
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-muted-surface/60 p-4">
          <div className="flex items-center justify-between">
            <span className="label-caps text-ink-secondary">Payment Success</span>
            <ShieldCheck className="h-3.5 w-3.5 text-ink-secondary" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-2xl font-extrabold tabular-nums text-ink">
              81.2%
            </span>
            <span className="mb-1 flex items-center gap-0.5 text-xs font-semibold text-warning">
              <ArrowDownRight className="h-3.5 w-3.5" />
              12pt
            </span>
          </div>
        </div>
      </div>

      {/* Transactions chart */}
      <div className="mt-3 rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="label-caps text-ink-secondary">Transactions · Today</span>
          <TrendingUp className="h-3.5 w-3.5 text-ink-secondary" />
        </div>
        <MiniTransactionsChart />
      </div>

      {/* AI Investigation status */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-ink px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Loader2 className="h-4 w-4 animate-spin text-brand-yellow" />
          <div>
            <p className="text-[13px] font-semibold text-white">AI Investigation running</p>
            <p className="text-[11px] text-white/50">Root cause 82% confident</p>
          </div>
        </div>
        <span className="label-caps rounded-full bg-white/10 px-2 py-1 text-white/70">Step 3/5</span>
      </div>

      {/* Anomaly alert */}
      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <div>
          <p className="text-[13px] font-semibold text-ink">Active anomaly: Evening payment failures</p>
          <p className="text-[11px] text-ink-secondary">Detected 14:42 IST · UPI gateway disruption suspected</p>
        </div>
      </div>

      {/* Recovery status */}
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-success/30 bg-success/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <p className="text-[13px] font-semibold text-ink">Recovery workflow ready</p>
        </div>
        <span className="text-[11px] font-semibold text-success">Awaiting approval</span>
      </div>
    </motion.div>
  );
}
