"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { revenueTrend14d } from "@/lib/data";

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-white px-3 py-2 shadow-lg">
      <p className="label-caps text-ink-secondary">{label}</p>
      <p className="font-heading text-sm font-bold text-ink">
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

export function RevenueChart({
  height = 280,
  accentColor = "#F5C542",
}: {
  height?: number;
  accentColor?: string;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueTrend14d} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#EAE7DE" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#5F6368" }}
            interval={2}
          />
          <YAxis hide domain={["dataMin - 40000", "dataMax + 20000"]} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={accentColor}
            strokeWidth={2.5}
            fill="url(#revenueGood)"
            dot={false}
            isAnimationActive
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
