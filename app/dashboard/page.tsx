"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ActiveInvestigationCard } from "@/components/dashboard/ActiveInvestigationCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { InvestigationsTable } from "@/components/dashboard/InvestigationsTable";
import { MerchantMemoryWidget } from "@/components/dashboard/MerchantMemoryWidget";
import { MerchantSnapshot } from "@/components/dashboard/MerchantSnapshot";
import { OverviewStats } from "@/components/dashboard/OverviewStats";
import { RevenueAnalyticsCard } from "@/components/dashboard/RevenueAnalyticsCard";
import {
  getActiveInvestigation,
  getActivity,
  getDashboard,
  getInvestigations,
  getMemoryTimeline,
  getMerchant,
} from "@/lib/api";
import { logError } from "@/lib/logger";
import {
  activeInvestigation as demoActiveInvestigation,
  activityFeed as demoActivityFeed,
  memoryTimeline as demoMemoryTimeline,
  merchant as demoMerchant,
  merchantSnapshot as demoMerchantSnapshot,
  recentInvestigations as demoRecentInvestigations,
  revenueAnalytics14d as demoAnalytics,
  statCards as demoStatCards,
  type ActiveInvestigationData,
  type ActivityEvent,
  type MemoryIncident,
  type MerchantSnapshotField,
  type RecentInvestigationRow,
  type RevenueAnalyticsPoint,
  type StatCardsData,
} from "@/lib/demoData";

// Minimum time the skeleton stays visible, so a fast API response doesn't
// flash the loading state — see the `remaining` delay below.
const MIN_SKELETON_MS = 700;

interface DashboardState {
  statCards: StatCardsData;
  analytics: RevenueAnalyticsPoint[];
  merchantFields: MerchantSnapshotField[];
  activity: ActivityEvent[];
  investigation: ActiveInvestigationData;
  history: RecentInvestigationRow[];
  memory: MemoryIncident[];
}

const fallbackState: DashboardState = {
  statCards: demoStatCards,
  analytics: demoAnalytics,
  merchantFields: demoMerchantSnapshot,
  activity: demoActivityFeed,
  investigation: demoActiveInvestigation,
  history: demoRecentInvestigations,
  memory: demoMemoryTimeline,
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardState>(fallbackState);
  const [merchantName, setMerchantName] = useState(demoMerchant.name);
  const [merchantCategory, setMerchantCategory] = useState(demoMerchant.category);
  const [backendOffline, setBackendOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = Date.now();

    async function load() {
      try {
        // Backend is a plain FastAPI service with no cross-endpoint
        // dependency, so all six resources load in parallel.
        const [dashboard, merchantFields, activity, investigation, history, memory] =
          await Promise.all([
            getDashboard(),
            getMerchant(),
            getActivity(),
            getActiveInvestigation(),
            getInvestigations(),
            getMemoryTimeline(),
          ]);

        if (cancelled) return;

        setData({
          statCards: dashboard.statCards,
          analytics: dashboard.analytics,
          merchantFields,
          activity,
          investigation,
          history,
          memory,
        });

        const storeNameField = merchantFields.find((f) => f.label === "Store Name");
        const categoryField = merchantFields.find((f) => f.label === "Category");
        if (storeNameField) setMerchantName(storeNameField.value);
        if (categoryField) setMerchantCategory(categoryField.value);
        setBackendOffline(false);
      } catch (err) {
        // Backend not running yet, or a request failed — the dashboard
        // stays fully functional on the local Illustrative Demo Data
        // already sitting in `fallbackState`.
        logError("Dashboard initial load failed", err);
        if (!cancelled) setBackendOffline(true);
      } finally {
        const elapsed = Date.now() - started;
        const remaining = Math.max(MIN_SKELETON_MS - elapsed, 0);
        setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, remaining);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Shared by two triggers: a merchant-approved workflow finishing (the
  // backend appends a new entry to /api/investigations and
  // /api/memory/timeline) and Demo Mode's reset (the backend restores both
  // back to their seed). Either way, re-fetching just these two keeps the
  // table and memory widget in sync without a full page reload.
  const refreshHistoryAndMemory = useCallback(() => {
    Promise.all([getInvestigations(), getMemoryTimeline()])
      .then(([history, memory]) => {
        setData((prev) => ({ ...prev, history, memory }));
      })
      .catch((err) => {
        // Backend unreachable — the table/widget simply keep showing
        // whatever they already had.
        logError("Refreshing history/memory failed", err);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-muted-surface/40">
      <DashboardHeader name={merchantName} category={merchantCategory} onReset={refreshHistoryAndMemory} />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-8 md:px-10">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-12 gap-4 md:gap-6"
          >
            <OverviewStats data={data.statCards} />
            <RevenueAnalyticsCard data={data.analytics} />
            <ActiveInvestigationCard
              data={data.investigation}
              onWorkflowCompleted={refreshHistoryAndMemory}
            />
            <ActivityFeed events={data.activity} />
            <MerchantSnapshot fields={data.merchantFields} />
            <MerchantMemoryWidget memories={data.memory} />
            <InvestigationsTable rows={data.history} />
          </motion.div>
        )}

        <p className="mt-8 text-center text-xs text-ink-secondary">
          All figures on this dashboard are Illustrative Demo Data for hackathon
          presentation purposes.
          {backendOffline && (
            <span className="mt-1 block text-[#B45309]">
              Backend unreachable — showing the last known demo data.
            </span>
          )}
        </p>
      </main>
    </div>
  );
}
