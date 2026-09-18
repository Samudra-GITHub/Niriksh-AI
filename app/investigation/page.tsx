"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { InvestigationPanel } from "@/components/InvestigationPanel";
import { Timeline } from "@/components/Timeline";
import { TerminalLoader } from "@/components/investigation/TerminalLoader";
import { getInvestigationReport, getMemoryTimeline } from "@/lib/api";
import { logError } from "@/lib/logger";
import {
  investigationReport as fallbackReport,
  memoryTimeline as fallbackMemory,
  type InvestigationReportData,
  type MemoryIncident,
} from "@/lib/demoData";
import { cn } from "@/lib/utils";

type Phase = "loading" | "ready";

export default function InvestigationPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [report, setReport] = useState<InvestigationReportData>(fallbackReport);
  const [memory, setMemory] = useState<MemoryIncident[]>(fallbackMemory);
  const [fetchDone, setFetchDone] = useState(false);
  const [runId, setRunId] = useState(0);
  const [backendOffline, setBackendOffline] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFetchDone(false);

    Promise.all([getInvestigationReport(), getMemoryTimeline()])
      .then(([reportData, memoryData]) => {
        if (cancelled) return;
        setReport(reportData);
        setMemory(memoryData);
        setBackendOffline(false);
      })
      .catch((err) => {
        // Backend unreachable — fall back to the local Illustrative Demo
        // Data. The backend itself already falls back gracefully if only
        // Sarvam or Cognee is unavailable, so this only triggers if the
        // API is down entirely.
        logError("Investigation fetch failed", err);
        if (!cancelled) {
          setReport(fallbackReport);
          setMemory(fallbackMemory);
          setBackendOffline(true);
        }
      })
      .finally(() => {
        if (!cancelled) setFetchDone(true);
      });

    return () => {
      cancelled = true;
    };
  }, [runId]);

  const handleRunNew = useCallback(() => {
    setPhase("loading");
    setRunId((id) => id + 1);
  }, []);

  const handleLoaderFinished = useCallback(() => {
    setPhase("ready");
  }, []);

  return (
    <main className="relative min-h-screen flex-1 overflow-hidden bg-dark-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-15%] h-[520px] w-[520px] rounded-full bg-brand-yellow/10 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[420px] w-[420px] rounded-full bg-success/10 blur-[150px]"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 py-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Niriksh AI
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunNew}
              disabled={phase === "loading"}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
              aria-label="Run a new investigation"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", phase === "loading" && "animate-spin")} />
              Run New Investigation
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-white/40 hover:text-white active:scale-95"
            >
              Merchant Dashboard
            </Link>
          </div>
        </div>

        {phase === "loading" ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <TerminalLoader key={runId} done={fetchDone} onFinished={handleLoaderFinished} />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-14 pb-24 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
            <InvestigationPanel key={report.investigationId} data={report} memory={memory} />

            <div className="lg:border-l lg:border-white/10 lg:pl-10">
              <p className="label-caps text-white/40">Operations Timeline</p>
              <div className="mt-6">
                <Timeline activeIndex={3} />
              </div>
              {backendOffline && (
                <p className="mt-8 text-xs text-warning">
                  Backend unreachable — showing Illustrative Demo Data.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
