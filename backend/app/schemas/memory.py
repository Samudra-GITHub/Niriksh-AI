from pydantic import BaseModel, Field


class MerchantMemory(BaseModel):
    """One past incident recalled from a merchant's memory. Powered by
    Cognee's graph memory (see app/services/cognee_service.py), falling
    back to a local mocked history if Cognee is unavailable."""

    merchant_id: str
    merchant_name: str
    incident_date: str = Field(..., description="Human-readable relative date, e.g. 'Friday', 'Yesterday'.")
    incident_type: str = Field(..., description="Short category, e.g. 'payment_failure', 'refund_spike', 'qr_outage'.")
    root_cause: str
    actions_taken: list[str]
    verification_result: str
    notes: str = Field(..., description="Human-readable insight text, e.g. for a 'Memory Insight' card.")
    confidence: int = Field(..., ge=0, le=100)
    outcome: str = Field(..., description="Short outcome badge, e.g. 'Resolved', 'Verified', 'Recovered'.")


class MemoryTimeline(BaseModel):
    """Response for GET /api/memory/timeline. Newest incident first."""

    items: list[MerchantMemory]
