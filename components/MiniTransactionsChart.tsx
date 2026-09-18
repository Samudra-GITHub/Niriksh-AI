"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { dashboardTransactions } from "@/lib/data";

// Split out of MerchantDashboard.tsx so it can be lazy-loaded — this is
// the only piece of that hero card that needs the recharts bundle.
export function MiniTransactionsChart() {
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
