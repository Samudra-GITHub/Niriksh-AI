from pydantic import BaseModel, Field


class MerchantInvestigationContext(BaseModel):
    """Structured merchant snapshot sent to Sarvam AI as investigation input.

    Built from mocked data today (see investigation_service.py); once
    Supabase is wired up this will be built from the same tables backing
    /api/dashboard and /api/merchant instead.
    """

    merchant_name: str
    merchant_category: str
    revenue_today: float
    revenue_change_percent: float
    payment_success_rate: float
    refund_count: int
    transaction_count: int
    upi_status: str
    qr_status: str
    historical_notes: str = Field(
        default="", description="Free-text context about similar past incidents, if any."
    )
