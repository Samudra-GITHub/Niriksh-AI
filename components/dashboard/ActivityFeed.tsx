"use client";

import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import {
  activityFeed as defaultActivityFeed,
  type ActivityEvent,
  type ActivityStatus,
} from "@/lib/demoData";

const dotColor: Record<ActivityStatus, string> = {
  alert: "bg-red-500",
  info: "bg-ink-secondary",
  success: "bg-success",
  pending: "bg-warning",
};

export function ActivityFeed({ events = defaultActivityFeed }: { events?: ActivityEvent[] }) {
  return (
    <DashboardCard className="col-span-12 lg:col-span-5" delay={0.3}>
      <p className="label-caps text-ink-secondary">Niriksh Activity</p>
      <p className="mt-1 font-heading text-lg font-bold text-ink">Live investigation log</p>

      <div className="relative mt-6">
        <div className="absolute left-[3px] top-1 h-[calc(100%-8px)] w-px bg-border" />
        <ul className="space-y-5 pl-5">
          {events.map((event, i) => (
            <li key={`${event.time}-${i}`} className="relative">
              <span
                className={cn(
                  "absolute -left-5 top-1 h-2 w-2 rounded-full ring-4 ring-white",
                  dotColor[event.status]
                )}
              />
              <p className="text-xs font-semibold text-ink-secondary">{event.time}</p>
              <p className="mt-0.5 text-sm text-ink">{event.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  );
}
