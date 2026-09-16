"""
Domain entities — the shape data will have once it comes from Supabase
tables, before it's adapted into an API response schema.

Services currently build these directly from constants. Once Maithrayi
wires up Supabase, a service will instead build these from
`client.table(...).select(...).execute().data` rows, and the mapping into
`app/schemas/*` response models below stays unchanged.
"""

from dataclasses import dataclass, field


@dataclass
class MerchantRecord:
    id: str
    store_name: str
    category: str
    upi_status: str
    qr_status: str
    settlement_status: str
    last_sync_label: str


@dataclass
class AnalyticsPointRecord:
    date: str
    label: str
    revenue: float
    transactions: int
    refunds: int
    is_anomaly: bool = False


@dataclass
class HourlyPointRecord:
    hour: str
    value: int


@dataclass
class DashboardMetricsRecord:
    revenue_value: float
    revenue_delta_percent: float
    payment_success_rate: float
    transactions_today: int
    transactions_hourly: list[HourlyPointRecord]
    ai_health_score: int
    ai_health_status: str
    analytics: list[AnalyticsPointRecord] = field(default_factory=list)


@dataclass
class ActivityEventRecord:
    time_label: str
    status: str
    description: str


@dataclass
class InvestigationRecord:
    """The static fallback used when Sarvam is unavailable — see
    services/sarvam_service.py and services/investigation_service.py."""

    id: str
    anomaly_title: str
    summary: str
    confidence: int
    root_cause: str
    evidence: list[str]
    recommended_actions: list[str]
    verification_checks: list[str]
    merchant_message: str
    workflow_status: str


@dataclass
class InvestigationHistoryRecord:
    incident: str
    severity: str
    status: str
    time_label: str


@dataclass
class MerchantMemoryRecord:
    """A single past incident in a merchant's memory — see
    services/cognee_service.py. Once Supabase is wired up, this becomes a
    row in a `merchant_memory` table (Cognee would still hold the
    graph/semantic index over the same data; Supabase holds the durable
    row-level record)."""

    merchant_id: str
    merchant_name: str
    incident_date: str
    incident_type: str
    root_cause: str
    actions_taken: list[str]
    verification_result: str
    notes: str
    confidence: int
    outcome: str
