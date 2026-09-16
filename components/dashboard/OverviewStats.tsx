"use client";

import { ArrowDownRight, Gauge, IndianRupee, Wallet } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AnimatedNumber } from "@/components/dashboard/AnimatedNumber";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { Sparkline } from "@/components/dashboard/Sparkline";
import { statCards as defaultStatCards, type StatCardsData } from "@/lib/demoData";

export function OverviewStats({ data = defaultStatCards }: { data?: StatCardsData }) {
  const { revenueToday, paymentSuccessRate, transactionsToday, aiHealthScore } = data;

  return (
    <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Today's Revenue */}
      <DashboardCard delay={0}>
        <div className="flex items-center justify-between">
          <span className="label-caps text-ink-secondary">{revenueToday.label}</span>
          <IndianRupee className="h-4 w-4 text-ink-secondary" />
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span className="font-heading text-3xl font-extrabold text-ink">
            <AnimatedNumber value={revenueToday.value} prefix={revenueToday.prefix} />
          </span>
          <span className="mb-1 flex items-center gap-0.5 text-xs font-semibold text-red-500">
            <ArrowDownRight className="h-3.5 w-3.5" />
            {Math.abs(revenueToday.deltaPercent)}%
          </span>
        </div>
      </DashboardCard>

      {/* Payment Success Rate */}
      <DashboardCard delay={0.06}>
        <div className="flex items-center justify-between">
          <div>
            <span className="label-caps text-ink-secondary">{paymentSuccessRate.label}</span>
            <p className="mt-3 font-heading text-3xl font-extrabold text-ink">
              <AnimatedNumber
                value={paymentSuccessRate.value}
                decimals={1}
                suffix={paymentSuccessRate.suffix}
              />
            </p>
          </div>
          <ProgressRing percent={paymentSuccessRate.value} />
        </div>
      </DashboardCard>

      {/* Transactions Today */}
      <DashboardCard delay={0.12}>
        <div className="flex items-center justify-between">
          <span className="label-caps text-ink-secondary">{transactionsToday.label}</span>
          <Wallet className="h-4 w-4 text-ink-secondary" />
        </div>
        <p className="mt-3 font-heading text-3xl font-extrabold text-ink">
          <AnimatedNumber value={transactionsToday.value} />
        </p>
        <div className="mt-2">
          <Sparkline data={transactionsToday.hourly} color="#111111" />
        </div>
      </DashboardCard>

      {/* AI Health Score */}
      <DashboardCard delay={0.18}>
        <div className="flex items-center justify-between">
          <span className="label-caps text-ink-secondary">{aiHealthScore.label}</span>
          <Gauge className="h-4 w-4 text-warning" />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-heading text-3xl font-extrabold text-ink">
            <AnimatedNumber value={aiHealthScore.value} />
          </span>
          <span className="mb-1 text-sm font-semibold text-ink-secondary">
            / {aiHealthScore.max}
          </span>
        </div>
        <span className="mt-3 inline-flex items-center rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
          {aiHealthScore.status}
        </span>
      </DashboardCard>
    </div>
  );
}
