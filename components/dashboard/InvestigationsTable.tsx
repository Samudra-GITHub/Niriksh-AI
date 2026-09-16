"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import {
  recentInvestigations as defaultRecentInvestigations,
  type InvestigationStatus,
  type RecentInvestigationRow,
  type Severity,
} from "@/lib/demoData";

const severityStyles: Record<Severity, string> = {
  High: "bg-red-50 text-red-600",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted-surface text-ink-secondary",
};

const statusStyles: Record<InvestigationStatus, string> = {
  Investigating: "bg-warning/10 text-warning",
  Resolved: "bg-success/10 text-success",
  Verified: "bg-success/10 text-success",
};

export function InvestigationsTable({
  rows = defaultRecentInvestigations,
}: {
  rows?: RecentInvestigationRow[];
}) {
  return (
    <DashboardCard className="col-span-12" delay={0.42}>
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-ink-secondary">History</p>
          <p className="mt-1 font-heading text-lg font-bold text-ink">Recent Investigations</p>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="label-caps pb-3 font-semibold text-ink-secondary">Incident</th>
              <th className="label-caps pb-3 font-semibold text-ink-secondary">Severity</th>
              <th className="label-caps pb-3 font-semibold text-ink-secondary">Status</th>
              <th className="label-caps pb-3 text-right font-semibold text-ink-secondary">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${i}-${row.incident}-${row.time}`} className="border-b border-border last:border-0">
                <td className="py-3.5 font-semibold text-ink">{row.incident}</td>
                <td className="py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", severityStyles[row.severity])}>
                    {row.severity}
                  </span>
                </td>
                <td className="py-3.5">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[row.status])}>
                    {row.status}
                  </span>
                </td>
                <td className="py-3.5 text-right text-ink-secondary">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
