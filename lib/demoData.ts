// ============================================================================
// Illustrative Demo Data — Niriksh AI Merchant Dashboard (/dashboard only)
// Every value in this file is fictional and for product demonstration only.
// Replace with live API data when backend integration is ready.
// ============================================================================

export const merchant = {
  name: "Kavita General Store",
  category: "Grocery & Daily Essentials",
};

// The one merchant this hackathon build models — matches
// backend/app/services/cognee_service.py's DEFAULT_MERCHANT_ID. Used
// wherever the frontend needs to identify "this merchant" to the API
// (e.g. approving a workflow), since there's no auth/session yet.
export const DEFAULT_MERCHANT_ID = "M102";

export type HourlyPoint = { hour: string; value: number };

export interface StatCardsData {
  revenueToday: {
    label: string;
    value: number;
    prefix: string;
    deltaPercent: number;
    trend: "up" | "down" | "flat";
  };
  paymentSuccessRate: {
    label: string;
    value: number;
    suffix: string;
  };
  transactionsToday: {
    label: string;
    value: number;
    hourly: HourlyPoint[];
  };
  aiHealthScore: {
    label: string;
    value: number;
    max: number;
    status: string;
  };
}

export const statCards: StatCardsData = {
  revenueToday: {
    label: "Today's Revenue",
    value: 18450,
    prefix: "₹",
    deltaPercent: -24,
    trend: "down",
  },
  paymentSuccessRate: {
    label: "Payment Success Rate",
    value: 96.2,
    suffix: "%",
  },
  transactionsToday: {
    label: "Transactions Today",
    value: 1842,
    hourly: [
      { hour: "6 AM", value: 62 },
      { hour: "9 AM", value: 148 },
      { hour: "12 PM", value: 214 },
      { hour: "3 PM", value: 196 },
      { hour: "6 PM", value: 132 },
      { hour: "9 PM", value: 58 },
    ],
  },
  aiHealthScore: {
    label: "AI Health Score",
    value: 82,
    max: 100,
    status: "Needs Attention",
  },
};

export type RevenueAnalyticsPoint = {
  date: string;
  label: string;
  revenue: number;
  transactions: number;
  refunds: number;
  isAnomaly?: boolean;
};

// 14-day trend — decline begins Sep 5 (index 8), matching the narrative
// on the Live Investigation screen. Today (Sep 10) matches the stat cards above.
export const revenueAnalytics14d: RevenueAnalyticsPoint[] = [
  { date: "2026-08-28", label: "Aug 28", revenue: 24200, transactions: 2320, refunds: 8 },
  { date: "2026-08-29", label: "Aug 29", revenue: 24800, transactions: 2380, refunds: 7 },
  { date: "2026-08-30", label: "Aug 30", revenue: 25100, transactions: 2410, refunds: 9 },
  { date: "2026-08-31", label: "Aug 31", revenue: 25600, transactions: 2450, refunds: 6 },
  { date: "2026-09-01", label: "Sep 1", revenue: 24950, transactions: 2390, refunds: 8 },
  { date: "2026-09-02", label: "Sep 2", revenue: 25800, transactions: 2470, refunds: 7 },
  { date: "2026-09-03", label: "Sep 3", revenue: 26200, transactions: 2510, refunds: 9 },
  { date: "2026-09-04", label: "Sep 4", revenue: 25400, transactions: 2440, refunds: 8 },
  { date: "2026-09-05", label: "Sep 5", revenue: 22100, transactions: 2150, refunds: 19, isAnomaly: true },
  { date: "2026-09-06", label: "Sep 6", revenue: 19800, transactions: 1980, refunds: 26 },
  { date: "2026-09-07", label: "Sep 7", revenue: 17650, transactions: 1890, refunds: 31 },
  { date: "2026-09-08", label: "Sep 8", revenue: 16200, transactions: 1790, refunds: 34 },
  { date: "2026-09-09", label: "Sep 9", revenue: 17100, transactions: 1810, refunds: 24 },
  { date: "2026-09-10", label: "Sep 10", revenue: 18450, transactions: 1842, refunds: 17 },
];

export type ActivityStatus = "alert" | "info" | "success" | "pending";

export interface ActivityEvent {
  time: string;
  status: ActivityStatus;
  description: string;
}

export const activityFeed: ActivityEvent[] = [
  { time: "09:42 AM", status: "alert", description: "Revenue anomaly detected." },
  { time: "09:43 AM", status: "info", description: "Payment logs collected." },
  { time: "09:44 AM", status: "info", description: "Refund spike investigated." },
  { time: "09:45 AM", status: "success", description: "Root cause identified." },
  { time: "09:46 AM", status: "pending", description: "Awaiting merchant approval." },
];

export interface ActiveInvestigationData {
  investigationId: string;
  badge: string;
  headline: string;
  confidence: number;
  rootCause: string;
  evidence: string[];
}

export const activeInvestigation: ActiveInvestigationData = {
  investigationId: "demo-investigation",
  badge: "Investigation Running",
  headline: "Revenue anomaly detected.",
  confidence: 91,
  rootCause: "Payment processing disruption.",
  evidence: [
    "Payment success decreased.",
    "Refunds increased.",
    "Transactions dropped during evening hours.",
  ],
};

// Full Sarvam-shaped investigation report — used only by the standalone
// /investigation page (app/investigation/page.tsx). This is the frontend's
// last line of defense if the backend itself is unreachable; the backend
// already falls back gracefully on its own if only Sarvam is unavailable.
export interface InvestigationReportData {
  investigationId: string;
  anomalyTitle: string;
  summary: string;
  confidence: number;
  rootCause: string;
  evidence: string[];
  recommendedActions: string[];
  verificationChecks: string[];
  merchantMessage: string;
  workflowStatus: string;
}

export const investigationReport: InvestigationReportData = {
  investigationId: "demo-investigation",
  anomalyTitle: "Revenue anomaly detected",
  summary:
    "Revenue dropped sharply this evening alongside a spike in payment failures and refunds.",
  confidence: 91,
  rootCause: "Payment processing disruption.",
  evidence: [
    "Payment success decreased.",
    "Refunds increased.",
    "Transactions dropped during evening hours.",
  ],
  recommendedActions: [
    "Approve the recovery workflow to retry failed transactions.",
    "Notify affected customers of the resolved delay.",
  ],
  verificationChecks: [
    "Payment success rate returns above 95%.",
    "Refund count returns to baseline within 24 hours.",
  ],
  merchantMessage:
    "We noticed a dip in your evening sales and are already on it — approve the fix below to recover affected transactions.",
  workflowStatus: "Awaiting merchant approval",
};

export type StatusTone = "success" | "warning" | "neutral";

export interface MerchantSnapshotField {
  label: string;
  value: string;
  tone: StatusTone;
}

export const merchantSnapshot: MerchantSnapshotField[] = [
  { label: "Store Name", value: "Kavita General Store", tone: "neutral" },
  { label: "Category", value: "Grocery & Daily Essentials", tone: "neutral" },
  { label: "UPI Status", value: "Operational", tone: "success" },
  { label: "QR Status", value: "Operational", tone: "success" },
  { label: "Settlement Status", value: "Delayed", tone: "warning" },
  { label: "Last Sync", value: "2 minutes ago", tone: "neutral" },
];

export type Severity = "High" | "Medium" | "Low";
export type InvestigationStatus = "Investigating" | "Resolved" | "Verified";

export interface RecentInvestigationRow {
  incident: string;
  severity: Severity;
  status: InvestigationStatus;
  time: string;
}

export const recentInvestigations: RecentInvestigationRow[] = [
  { incident: "Revenue Drop", severity: "High", status: "Investigating", time: "09:42 AM" },
  { incident: "Refund Spike", severity: "Medium", status: "Resolved", time: "Yesterday" },
  { incident: "QR Offline", severity: "High", status: "Resolved", time: "Friday" },
  { incident: "Payment Delay", severity: "Low", status: "Verified", time: "Last Week" },
];

// Cognee-backed merchant memory — past incidents for merchant M102, newest
// first. Used by the investigation page's "Previous Similar Incidents"
// timeline and Memory Insight card, and the dashboard's Merchant Memory
// widget. Mirrors backend/app/services/cognee_service.py's mock store so
// the fallback content matches the live API exactly.
export interface MemoryIncident {
  incidentDate: string;
  incidentType: string;
  rootCause: string;
  actionsTaken: string[];
  verificationResult: string;
  notes: string;
  confidence: number;
  outcome: string;
}

export const memoryTimeline: MemoryIncident[] = [
  {
    incidentDate: "Yesterday",
    incidentType: "refund_spike",
    rootCause: "Refund spike after lunch rush caused by duplicate order submissions.",
    actionsTaken: [
      "Reviewed the refund queue for duplicate charges.",
      "Merchant approved a manual refund batch clearance.",
    ],
    verificationResult: "Refund volume returned to baseline within 2 hours.",
    notes:
      "A duplicate-order refund spike happened yesterday after the lunch rush. It resolved within 2 hours once the merchant approved the refund batch.",
    confidence: 88,
    outcome: "Resolved",
  },
  {
    incidentDate: "Friday",
    incidentType: "payment_failure",
    rootCause: "Payment gateway disruption during evening peak hours.",
    actionsTaken: [
      "Retried failed transactions through gateway failover.",
      "Notified affected customers of the delay.",
    ],
    verificationResult: "Payment success rate returned to 98% within 15 minutes.",
    notes:
      "A similar payment processing issue occurred last Friday between 7:00 PM and 9:00 PM. The previous recovery workflow restored payment success within 15 minutes.",
    confidence: 93,
    outcome: "Recovered",
  },
  {
    incidentDate: "Last week",
    incidentType: "qr_outage",
    rootCause: "QR code deactivated due to an expired merchant certificate.",
    actionsTaken: ["Reissued the QR certificate.", "Reactivated the QR endpoint."],
    verificationResult: "QR scans resumed normally within 30 minutes.",
    notes:
      "The store's QR code went inactive last week after its certificate expired. Reissuing the certificate restored scans within 30 minutes.",
    confidence: 95,
    outcome: "Verified",
  },
];
