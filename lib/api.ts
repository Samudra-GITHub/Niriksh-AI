// ============================================================================
// Niriksh AI API client — talks to the FastAPI backend in /backend.
//
// Every function fetches typed JSON and adapts it into the exact shapes the
// dashboard components already expect (see lib/demoData.ts). Callers are
// expected to catch failures and fall back to the demo data — see the
// loading effect in app/dashboard/page.tsx for the pattern used.
// ============================================================================

import type {
  ActiveInvestigationData,
  ActivityEvent,
  HourlyPoint,
  InvestigationReportData,
  InvestigationStatus,
  MemoryIncident,
  MerchantSnapshotField,
  RecentInvestigationRow,
  RevenueAnalyticsPoint,
  Severity,
  StatCardsData,
  StatusTone,
} from "@/lib/demoData";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Niriksh API ${path} responded with ${res.status}`);
  }

  return (await res.json()) as T;
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Niriksh API ${path} responded with ${res.status}`);
  }

  return (await res.json()) as T;
}

function toneFromStatus(status: string): StatusTone {
  const normalized = status.toLowerCase();
  if (normalized === "operational" || normalized === "on time") return "success";
  if (normalized === "delayed" || normalized === "degraded") return "warning";
  return "neutral";
}

// ---- Raw backend response shapes (snake_case — mirrors backend/app/schemas) ----

interface RawRevenueStat {
  label: string;
  value: number;
  prefix: string;
  delta_percent: number;
  trend: "up" | "down" | "flat";
}

interface RawSuccessRateStat {
  label: string;
  value: number;
  suffix: string;
}

interface RawTransactionsStat {
  label: string;
  value: number;
  hourly: HourlyPoint[];
}

interface RawHealthScoreStat {
  label: string;
  value: number;
  max: number;
  status: string;
}

interface RawAnalyticsPoint {
  date: string;
  label: string;
  revenue: number;
  transactions: number;
  refunds: number;
  is_anomaly: boolean;
}

interface RawDashboardMetrics {
  revenue_today: RawRevenueStat;
  payment_success_rate: RawSuccessRateStat;
  transactions_today: RawTransactionsStat;
  ai_health_score: RawHealthScoreStat;
  analytics: RawAnalyticsPoint[];
}

interface RawMerchantSnapshot {
  store_name: string;
  category: string;
  upi_status: string;
  qr_status: string;
  settlement_status: string;
  last_sync_label: string;
}

interface RawActivityEvent {
  time_label: string;
  status: ActivityEvent["status"];
  description: string;
}

interface RawActivityFeed {
  events: RawActivityEvent[];
}

interface RawActiveInvestigation {
  investigation_id: string;
  anomaly_title: string;
  summary: string;
  confidence: number;
  root_cause: string;
  evidence: string[];
  recommended_actions: string[];
  verification_checks: string[];
  merchant_message: string;
  workflow_status: string;
}

interface RawInvestigationHistoryItem {
  incident: string;
  severity: Severity;
  status: InvestigationStatus;
  time_label: string;
}

interface RawInvestigationHistory {
  items: RawInvestigationHistoryItem[];
}

// ---- Public API ----

export interface DashboardData {
  statCards: StatCardsData;
  analytics: RevenueAnalyticsPoint[];
}

export async function getDashboard(): Promise<DashboardData> {
  const raw = await apiGet<RawDashboardMetrics>("/api/dashboard");

  return {
    statCards: {
      revenueToday: {
        label: raw.revenue_today.label,
        value: raw.revenue_today.value,
        prefix: raw.revenue_today.prefix,
        deltaPercent: raw.revenue_today.delta_percent,
        trend: raw.revenue_today.trend,
      },
      paymentSuccessRate: {
        label: raw.payment_success_rate.label,
        value: raw.payment_success_rate.value,
        suffix: raw.payment_success_rate.suffix,
      },
      transactionsToday: {
        label: raw.transactions_today.label,
        value: raw.transactions_today.value,
        hourly: raw.transactions_today.hourly,
      },
      aiHealthScore: {
        label: raw.ai_health_score.label,
        value: raw.ai_health_score.value,
        max: raw.ai_health_score.max,
        status: raw.ai_health_score.status,
      },
    },
    analytics: raw.analytics.map((point) => ({
      date: point.date,
      label: point.label,
      revenue: point.revenue,
      transactions: point.transactions,
      refunds: point.refunds,
      isAnomaly: point.is_anomaly,
    })),
  };
}

export async function getMerchant(): Promise<MerchantSnapshotField[]> {
  const raw = await apiGet<RawMerchantSnapshot>("/api/merchant");

  return [
    { label: "Store Name", value: raw.store_name, tone: "neutral" },
    { label: "Category", value: raw.category, tone: "neutral" },
    { label: "UPI Status", value: raw.upi_status, tone: toneFromStatus(raw.upi_status) },
    { label: "QR Status", value: raw.qr_status, tone: toneFromStatus(raw.qr_status) },
    { label: "Settlement Status", value: raw.settlement_status, tone: toneFromStatus(raw.settlement_status) },
    { label: "Last Sync", value: raw.last_sync_label, tone: "neutral" },
  ];
}

export async function getActivity(): Promise<ActivityEvent[]> {
  const raw = await apiGet<RawActivityFeed>("/api/activity");

  return raw.events.map((event) => ({
    time: event.time_label,
    status: event.status,
    description: event.description,
  }));
}

// Narrow view used by the dashboard's ActiveInvestigationCard — that card's
// design predates the full Sarvam report shape and only ever showed a
// headline, confidence, root cause, and evidence, under a static badge.
// See getInvestigationReport() below for the full report used on the
// standalone /investigation page.
export async function getActiveInvestigation(): Promise<ActiveInvestigationData> {
  const raw = await apiGet<RawActiveInvestigation>("/api/investigation/active");

  return {
    investigationId: raw.investigation_id,
    badge: "Investigation Running",
    headline: raw.anomaly_title,
    confidence: raw.confidence,
    rootCause: raw.root_cause,
    evidence: raw.evidence,
  };
}

// Full Sarvam-shaped investigation report for the standalone /investigation
// page — includes the summary, recommended actions, verification checks,
// merchant-facing message, and workflow status the dashboard card doesn't
// render.
export async function getInvestigationReport(): Promise<InvestigationReportData> {
  const raw = await apiGet<RawActiveInvestigation>("/api/investigation/active");

  return {
    investigationId: raw.investigation_id,
    anomalyTitle: raw.anomaly_title,
    summary: raw.summary,
    confidence: raw.confidence,
    rootCause: raw.root_cause,
    evidence: raw.evidence,
    recommendedActions: raw.recommended_actions,
    verificationChecks: raw.verification_checks,
    merchantMessage: raw.merchant_message,
    workflowStatus: raw.workflow_status,
  };
}

export async function getInvestigations(): Promise<RecentInvestigationRow[]> {
  const raw = await apiGet<RawInvestigationHistory>("/api/investigations");

  return raw.items.map((item) => ({
    incident: item.incident,
    severity: item.severity,
    status: item.status,
    time: item.time_label,
  }));
}

interface RawMerchantMemory {
  merchant_id: string;
  merchant_name: string;
  incident_date: string;
  incident_type: string;
  root_cause: string;
  actions_taken: string[];
  verification_result: string;
  notes: string;
  confidence: number;
  outcome: string;
}

interface RawMemoryTimeline {
  items: RawMerchantMemory[];
}

// Cognee-backed merchant memory — used by the investigation page's
// "Previous Similar Incidents" timeline / Memory Insight card, and the
// dashboard's Merchant Memory widget.
export async function getMemoryTimeline(): Promise<MemoryIncident[]> {
  const raw = await apiGet<RawMemoryTimeline>("/api/memory/timeline");

  return raw.items.map((item) => ({
    incidentDate: item.incident_date,
    incidentType: item.incident_type,
    rootCause: item.root_cause,
    actionsTaken: item.actions_taken,
    verificationResult: item.verification_result,
    notes: item.notes,
    confidence: item.confidence,
    outcome: item.outcome,
  }));
}

// ---- n8n-backed workflow engine ----
// The "Approve & Run Workflow" flow: POST to start, then poll GET status
// roughly once a second until it reaches "completed" or "failed". See
// lib/useWorkflowRun.ts for the shared polling hook both the investigation
// page and the dashboard's Active Investigation card use.

export type WorkflowState = "pending_approval" | "running" | "verifying" | "completed" | "failed";

export interface WorkflowData {
  workflowId: string;
  merchantId: string;
  anomalyType: string;
  rootCause: string;
  recommendedActions: string[];
  status: WorkflowState;
  startedAt: string;
  completedAt: string | null;
  verificationStatus: string;
}

export interface WorkflowStatusData {
  workflowId: string;
  status: WorkflowState;
  progress: number;
  currentStep: string;
  verificationStatus: string;
  updatedAt: string;
}

interface RawWorkflow {
  workflow_id: string;
  merchant_id: string;
  anomaly_type: string;
  root_cause: string;
  recommended_actions: string[];
  status: WorkflowState;
  started_at: string;
  completed_at: string | null;
  verification_status: string;
}

interface RawWorkflowStatus {
  workflow_id: string;
  status: WorkflowState;
  progress: number;
  current_step: string;
  verification_status: string;
  updated_at: string;
}

export async function runWorkflow(
  merchantId: string,
  investigationId: string
): Promise<WorkflowData> {
  const raw = await apiPost<RawWorkflow>("/api/workflow/run", {
    merchant_id: merchantId,
    investigation_id: investigationId,
    merchant_approved: true,
  });

  return {
    workflowId: raw.workflow_id,
    merchantId: raw.merchant_id,
    anomalyType: raw.anomaly_type,
    rootCause: raw.root_cause,
    recommendedActions: raw.recommended_actions,
    status: raw.status,
    startedAt: raw.started_at,
    completedAt: raw.completed_at,
    verificationStatus: raw.verification_status,
  };
}

export async function getWorkflowStatus(workflowId: string): Promise<WorkflowStatusData> {
  const raw = await apiGet<RawWorkflowStatus>(`/api/workflow/status/${workflowId}`);

  return {
    workflowId: raw.workflow_id,
    status: raw.status,
    progress: raw.progress,
    currentStep: raw.current_step,
    verificationStatus: raw.verification_status,
    updatedAt: raw.updated_at,
  };
}

// ---- Sarvam-backed voice copilot ----
// Speech has no local fallback data (there's no meaningful "fake"
// transcript or audio) — callers catch failures and adjust the UI instead
// (reveal a typed-text input, or simply not offer playback).

export interface TranscriptionData {
  transcript: string;
  languageCode: string;
  languageName: string;
  confidence: number;
}

export interface SpeakData {
  audioBase64: string;
  audioFormat: string;
  languageCode: string;
  spokenText: string;
}

interface RawTranscription {
  transcript: string;
  language_code: string;
  language_name: string;
  confidence: number;
}

interface RawSpeak {
  audio_base64: string;
  audio_format: string;
  language_code: string;
  spoken_text: string;
}

export async function transcribeAudio(audio: Blob): Promise<TranscriptionData> {
  const form = new FormData();
  form.append("file", audio, "recording.webm");

  const res = await fetch(`${API_URL}/api/speech/transcribe`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Niriksh API /api/speech/transcribe responded with ${res.status}`);
  }

  const raw = (await res.json()) as RawTranscription;
  return {
    transcript: raw.transcript,
    languageCode: raw.language_code,
    languageName: raw.language_name,
    confidence: raw.confidence,
  };
}

export async function speakText(text: string, languageCode: string): Promise<SpeakData> {
  const raw = await apiPost<RawSpeak>("/api/speech/speak", {
    text,
    language_code: languageCode,
  });

  return {
    audioBase64: raw.audio_base64,
    audioFormat: raw.audio_format,
    languageCode: raw.language_code,
    spokenText: raw.spoken_text,
  };
}

// ---- Demo Mode ----
// A hackathon-ops convenience (not a merchant-facing feature): resets the
// backend's in-process mock stores — merchant memory, investigation
// history, and any in-flight workflows — back to their seeded starting
// point, so a demo run always starts clean. Disabled server-side in
// production (see backend/app/main.py).
export async function resetDemoData(): Promise<void> {
  await apiPost("/api/demo/reset", {});
}
