from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

WorkflowStatus = Literal["pending_approval", "running", "verifying", "completed", "failed"]


class Workflow(BaseModel):
    """A merchant-approved recovery workflow. Response for POST /api/workflow/run."""

    workflow_id: str
    merchant_id: str
    anomaly_type: str = Field(..., description="Short category, e.g. 'payment_failure'.")
    root_cause: str
    recommended_actions: list[str]
    merchant_approved: bool
    status: WorkflowStatus
    started_at: datetime
    completed_at: datetime | None = None
    verification_status: str = Field(..., description="e.g. 'pending', 'verified', 'failed'.")


class WorkflowRunRequest(BaseModel):
    """Body for POST /api/workflow/run."""

    merchant_id: str
    investigation_id: str
    merchant_approved: bool


class WorkflowStatusResponse(BaseModel):
    """Response for GET /api/workflow/status/{workflow_id} — polled by the
    frontend's WorkflowProgress component roughly once a second."""

    workflow_id: str
    status: WorkflowStatus
    progress: int = Field(..., ge=0, le=100)
    current_step: str
    verification_status: str
    updated_at: datetime
