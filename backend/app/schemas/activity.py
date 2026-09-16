from typing import Literal

from pydantic import BaseModel, Field


class ActivityEvent(BaseModel):
    time_label: str = Field(..., description="Timestamp label, e.g. '09:42 AM'.")
    status: Literal["alert", "info", "success", "pending"]
    description: str


class ActivityFeed(BaseModel):
    """Response for GET /api/activity."""

    events: list[ActivityEvent]
