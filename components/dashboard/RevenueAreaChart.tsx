"use client";

// Split out of RevenueAnalyticsCard.tsx so the recharts bundle can be
// lazy-loaded — everything else in that card (the metric toggle, the
// anomaly callout) renders instantly without waiting on this chunk.
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
import type { RevenueAnalyticsPoint } from "@/lib/demoData";

type Metric = "revenue" | "transactions" | "refunds";

export function RevenueAreaChart({
  data,
  metric,
  color,
  format,
  anomalyPoint,
}: {
  data: RevenueAnalyticsPoint[];
  metric: Metric;
  color: string;
  format: (v: number) => string;
  anomalyPoint: RevenueAnalyticsPoint;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
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
                  {format(Number(payload[0].value))}
                </p>
              </div>
            );
          }}
        />
        <ReferenceLine x={anomalyPoint.label} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
        <Area
          type="monotone"
          dataKey={metric}
          stroke={color}
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
  );
}
