"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import {
  merchantSnapshot as defaultMerchantSnapshot,
  type MerchantSnapshotField,
  type StatusTone,
} from "@/lib/demoData";

const dotTone: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  neutral: "bg-ink-secondary/40",
};

export function MerchantSnapshot({
  fields = defaultMerchantSnapshot,
}: {
  fields?: MerchantSnapshotField[];
}) {
  const storeName = fields.find((f) => f.label === "Store Name")?.value ?? "Merchant";

  return (
    <DashboardCard className="col-span-12 lg:col-span-7" delay={0.36}>
      <p className="label-caps text-ink-secondary">Merchant Snapshot</p>
      <p className="mt-1 font-heading text-lg font-bold text-ink">{storeName}</p>

      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs text-ink-secondary">{field.label}</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span className={cn("h-1.5 w-1.5 rounded-full", dotTone[field.tone])} />
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
