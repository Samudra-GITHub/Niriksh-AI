from typing import Literal

from pydantic import BaseModel, Field


class HourlyPoint(BaseModel):
    hour: str = Field(..., description="Short hour label, e.g. '9 AM'.")
    value: int = Field(..., description="Transaction count in that hour.")


class AnalyticsPoint(BaseModel):
    date: str = Field(..., description="ISO date for this data point.")
    label: str = Field(..., description="Short chart-axis label, e.g. 'Sep 5'.")
    revenue: float = Field(..., description="Revenue for the day, in rupees.")
    transactions: int = Field(..., description="Transaction count for the day.")
    refunds: int = Field(..., description="Refund count for the day.")
    is_anomaly: bool = Field(
        default=False,
        description="True on the day Niriksh flagged an anomaly — the frontend highlights this point.",
    )


class RevenueStat(BaseModel):
    label: str
    value: float = Field(..., description="Today's revenue, in rupees.")
    prefix: str = Field(default="₹", description="Currency prefix for display.")
    delta_percent: float = Field(..., description="Percent change vs. the recent baseline. Negative means a drop.")
    trend: Literal["up", "down", "flat"]


class SuccessRateStat(BaseModel):
    label: str
    value: float = Field(..., description="Payment success rate, 0-100.")
    suffix: str = Field(default="%")


class TransactionsStat(BaseModel):
    label: str
    value: int = Field(..., description="Total transactions today.")
    hourly: list[HourlyPoint] = Field(..., description="Intraday transaction volume, for the sparkline.")


class HealthScoreStat(BaseModel):
    label: str
    value: int = Field(..., description="AI-computed health score, 0-100.")
    max: int = Field(default=100)
    status: str = Field(..., description="Human-readable status label, e.g. 'Needs Attention'.")


class DashboardMetrics(BaseModel):
    """Aggregate response for GET /api/dashboard — everything the
    merchant overview and revenue analytics card need in one call."""

    revenue_today: RevenueStat
    payment_success_rate: SuccessRateStat
    transactions_today: TransactionsStat
    ai_health_score: HealthScoreStat
    analytics: list[AnalyticsPoint] = Field(
        ..., description="Last 14 days of revenue, transactions and refunds — one entry per day."
    )
