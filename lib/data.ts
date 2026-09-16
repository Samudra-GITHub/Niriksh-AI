// Illustrative Demo Data — for product demonstration purposes only.
// All merchant names, transaction figures, and events below are fictional.

export const revenueTrend14d = [
  { day: "Day 1", label: "Aug 28", revenue: 412000 },
  { day: "Day 2", label: "Aug 29", revenue: 438000 },
  { day: "Day 3", label: "Aug 30", revenue: 447000 },
  { day: "Day 4", label: "Aug 31", revenue: 461000 },
  { day: "Day 5", label: "Sep 1", revenue: 455000 },
  { day: "Day 6", label: "Sep 2", revenue: 468000 },
  { day: "Day 7", label: "Sep 3", revenue: 472000 },
  { day: "Day 8", label: "Sep 4", revenue: 459000 },
  { day: "Day 9", label: "Sep 5", revenue: 402000 },
  { day: "Day 10", label: "Sep 6", revenue: 351000 },
  { day: "Day 11", label: "Sep 7", revenue: 318000 },
  { day: "Day 12", label: "Sep 8", revenue: 296000 },
  { day: "Day 13", label: "Sep 9", revenue: 341000 },
  { day: "Day 14", label: "Sep 10", revenue: 358000 },
];

export const dashboardTransactions = [
  { time: "09:00", success: 96, failed: 4 },
  { time: "11:00", success: 94, failed: 6 },
  { time: "13:00", success: 91, failed: 9 },
  { time: "15:00", success: 78, failed: 22 },
  { time: "17:00", success: 71, failed: 29 },
  { time: "19:00", success: 68, failed: 32 },
  { time: "21:00", success: 82, failed: 18 },
];

export const problemCauses = [
  {
    id: "payment-failure",
    title: "Payment Failure",
    description: "Gateway timeouts spiking during peak evening hours.",
  },
  {
    id: "refund-spike",
    title: "Refund Spike",
    description: "Unusual concentration of refunds from one product line.",
  },
  {
    id: "upi-disruption",
    title: "UPI Disruption",
    description: "Intermittent UPI handshake failures with one issuer.",
  },
  {
    id: "qr-issue",
    title: "QR Issue",
    description: "Static QR codes at two outlets returning stale amounts.",
  },
  {
    id: "customer-dropoff",
    title: "Customer Drop-off",
    description: "Checkout abandonment rising sharply after OTP step.",
  },
  {
    id: "network-delay",
    title: "Network Delay",
    description: "Elevated latency from a regional ISP affecting POS sync.",
  },
];

export const investigationChecklist = [
  "Transaction patterns checked",
  "Payment logs reviewed",
  "Customer signals analyzed",
  "Historical activity validated",
];

export const investigationTimeline = [
  { id: "detect", label: "Detect", detail: "Anomaly flagged at 14:42 IST" },
  { id: "investigate", label: "Investigate", detail: "Cross-referencing 6 data sources" },
  { id: "reason", label: "Reason", detail: "Root cause narrowed to 1 candidate" },
  { id: "act", label: "Act", detail: "Recovery workflow drafted" },
  { id: "verify", label: "Verify", detail: "Awaiting merchant approval" },
];

export const architectureLayers = [
  {
    id: "merchant-interface",
    title: "Merchant Interface",
    description: "Dashboard, alerts, and approvals surfaced where merchants already work.",
    detail:
      "Web dashboard, push notifications, and WhatsApp/SMS alerts — merchants approve actions in one tap without leaving their existing workflow.",
    badges: ["Next.js", "React", "Tailwind"],
  },
  {
    id: "ai-intelligence",
    title: "AI Intelligence Layer",
    description: "Detection, reasoning, and root-cause inference run continuously.",
    detail:
      "LLM-driven reasoning over structured and unstructured signals, powered by fast inference and a persistent memory of merchant-specific patterns.",
    badges: ["Groq", "Cognee"],
  },
  {
    id: "data-backend",
    title: "Data & Backend",
    description: "Every transaction, log, and signal streamed and stored reliably.",
    detail:
      "Transaction streams, payment logs, and merchant metadata unified in a single source of truth with row-level security per merchant.",
    badges: ["Python", "FastAPI", "Supabase"],
  },
  {
    id: "action-layer",
    title: "Action Layer",
    description: "Merchant-approved workflows executed automatically.",
    detail:
      "Orchestrated recovery workflows — retries, refund reconciliation, customer outreach — triggered only after explicit merchant approval.",
    badges: ["n8n", "FastAPI"],
  },
  {
    id: "verification",
    title: "Verification",
    description: "Outcomes measured and confirmed, closing the loop.",
    detail:
      "Post-action metrics are re-checked against the original anomaly to confirm resolution, with a full audit trail for every decision.",
    badges: ["Supabase", "Cognee"],
  },
];

export const merchantBenefits = [
  {
    title: "Never miss a revenue drop",
    description: "Anomalies are flagged within minutes, not discovered days later in a monthly statement.",
  },
  {
    title: "Root cause, not just alerts",
    description: "Niriksh investigates across payments, logs, and customer signals before it ever pings you.",
  },
  {
    title: "One-tap recovery",
    description: "Approve a fully-prepared recovery workflow instead of assembling one from scratch.",
  },
  {
    title: "No new tools to learn",
    description: "Everything surfaces inside the merchant dashboard you already use every day.",
  },
  {
    title: "Confidence in the outcome",
    description: "Every action is verified against the original anomaly, so you know it actually worked.",
  },
];

export const paytmBenefits = [
  {
    title: "Lower merchant churn",
    description: "Merchants who feel supported through incidents stay longer on the platform.",
  },
  {
    title: "Reduced support load",
    description: "Autonomous investigation resolves issues before they become support tickets.",
  },
  {
    title: "Higher platform trust",
    description: "Proactive operations position Paytm as a partner, not just a payments processor.",
  },
  {
    title: "New premium tier",
    description: "Autonomous operations unlock a monetizable tier across the merchant base.",
  },
  {
    title: "Compounding intelligence",
    description: "Every resolved anomaly strengthens the model for every other merchant on Paytm.",
  },
];

export const businessTiers = [
  {
    name: "Merchant Health",
    tagline: "For every merchant, by default",
    capabilities: [
      "Real-time anomaly detection",
      "Daily health summary",
      "Basic root-cause hints",
      "Email & app alerts",
    ],
  },
  {
    name: "Business Pro",
    tagline: "For growing merchants",
    featured: true,
    capabilities: [
      "Everything in Merchant Health",
      "Full autonomous investigation",
      "One-tap recovery workflows",
      "Outcome verification reports",
      "Priority alert routing",
    ],
  },
  {
    name: "Enterprise Operations",
    tagline: "For multi-outlet & franchise operators",
    capabilities: [
      "Everything in Business Pro",
      "Multi-outlet correlation",
      "Custom workflow automation",
      "Dedicated operations analyst",
      "SLA-backed resolution times",
    ],
  },
];

export const impactTimeline = [
  { label: "Reactive Support", description: "Merchants report issues after revenue is already lost." },
  { label: "AI-Assisted Investigation", description: "AI helps support teams diagnose issues faster." },
  { label: "Autonomous Merchant Operations", description: "AI detects, investigates, acts, and verifies — before merchants ask." },
];
