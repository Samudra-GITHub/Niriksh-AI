"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";

export function Sparkline({
  data,
  color = "#111111",
}: {
  data: { hour: string; value: number }[];
  color?: string;
}) {
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
