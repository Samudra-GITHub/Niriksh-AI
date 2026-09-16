from pydantic import BaseModel, Field


class MerchantSnapshot(BaseModel):
    """Response for GET /api/merchant."""

    store_name: str
    category: str
    upi_status: str = Field(..., description="e.g. 'Operational', 'Degraded', 'Offline'.")
    qr_status: str = Field(..., description="e.g. 'Operational', 'Degraded', 'Offline'.")
    settlement_status: str = Field(..., description="e.g. 'On Time', 'Delayed'.")
    last_sync_label: str = Field(..., description="Human-readable relative sync time, e.g. '2 minutes ago'.")
