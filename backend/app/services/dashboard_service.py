"""
Dashboard metrics service.

Mocked for now — values mirror the frontend's Illustrative Demo Data
(frontend/lib/demoData.ts) so the UI looks identical whether it's reading
from this API or from its local fallback.

When Maithrayi wires up Supabase, `_get_mock_record` becomes a query
against a `daily_metrics` table (or a materialized view) filtered to the
current merchant and the last 14 days; the mapping into `DashboardMetrics`
stays the same.

Sarvam / Cognee note: the anomaly flag on each AnalyticsPoint (`is_anomaly`)
is hardcoded here. Once wired up, this is where Cognee's pattern memory
would flag the anomalous day, and Sarvam would generate the plain-language
summary consumed by `investigation_service.py`.
"""

from app.models.entities import (
    AnalyticsPointRecord,
    DashboardMetricsRecord,
    HourlyPointRecord,
)
from app.schemas.dashboard import (
    AnalyticsPoint,
    DashboardMetrics,
    HealthScoreStat,
    HourlyPoint,
    RevenueStat,
    SuccessRateStat,
    TransactionsStat,
)

_ANALYTICS_14D: list[tuple[str, str, float, int, int, bool]] = [
    ("2026-08-28", "Aug 28", 24200, 2320, 8, False),
    ("2026-08-29", "Aug 29", 24800, 2380, 7, False),
    ("2026-08-30", "Aug 30", 25100, 2410, 9, False),
    ("2026-08-31", "Aug 31", 25600, 2450, 6, False),
    ("2026-09-01", "Sep 1", 24950, 2390, 8, False),
    ("2026-09-02", "Sep 2", 25800, 2470, 7, False),
    ("2026-09-03", "Sep 3", 26200, 2510, 9, False),
    ("2026-09-04", "Sep 4", 25400, 2440, 8, False),
    ("2026-09-05", "Sep 5", 22100, 2150, 19, True),
    ("2026-09-06", "Sep 6", 19800, 1980, 26, False),
    ("2026-09-07", "Sep 7", 17650, 1890, 31, False),
    ("2026-09-08", "Sep 8", 16200, 1790, 34, False),
    ("2026-09-09", "Sep 9", 17100, 1810, 24, False),
    ("2026-09-10", "Sep 10", 18450, 1842, 17, False),
]

_HOURLY_TRANSACTIONS = [
    ("6 AM", 62),
    ("9 AM", 148),
    ("12 PM", 214),
    ("3 PM", 196),
    ("6 PM", 132),
    ("9 PM", 58),
]


def _get_mock_record() -> DashboardMetricsRecord:
    return DashboardMetricsRecord(
        revenue_value=18450,
        revenue_delta_percent=-24,
        payment_success_rate=96.2,
        transactions_today=1842,
        transactions_hourly=[HourlyPointRecord(hour=h, value=v) for h, v in _HOURLY_TRANSACTIONS],
        ai_health_score=82,
        ai_health_status="Needs Attention",
        analytics=[
            AnalyticsPointRecord(
                date=date, label=label, revenue=revenue, transactions=transactions, refunds=refunds, is_anomaly=anomaly
            )
            for date, label, revenue, transactions, refunds, anomaly in _ANALYTICS_14D
        ],
    )


async def get_dashboard_metrics() -> DashboardMetrics:
    record = _get_mock_record()

    return DashboardMetrics(
        revenue_today=RevenueStat(
            label="Today's Revenue",
            value=record.revenue_value,
            prefix="₹",
            delta_percent=record.revenue_delta_percent,
            trend="down" if record.revenue_delta_percent < 0 else "up",
        ),
        payment_success_rate=SuccessRateStat(
            label="Payment Success Rate",
            value=record.payment_success_rate,
        ),
        transactions_today=TransactionsStat(
            label="Transactions Today",
            value=record.transactions_today,
            hourly=[HourlyPoint(hour=p.hour, value=p.value) for p in record.transactions_hourly],
        ),
        ai_health_score=HealthScoreStat(
            label="AI Health Score",
            value=record.ai_health_score,
            max=100,
            status=record.ai_health_status,
        ),
        analytics=[
            AnalyticsPoint(
                date=p.date,
                label=p.label,
                revenue=p.revenue,
                transactions=p.transactions,
                refunds=p.refunds,
                is_anomaly=p.is_anomaly,
            )
            for p in record.analytics
        ],
    )
