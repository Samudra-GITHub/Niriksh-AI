from typing import Literal

from pydantic import BaseModel, Field


class ActiveInvestigation(BaseModel):
    """Response for GET /api/investigation/active.

    This is also the exact JSON shape Sarvam AI is instructed to return
    (see app/services/sarvam_service.py) — the LLM's structured output IS
    the API response, with no extra mapping layer in between. If Sarvam is
    unavailable, this is filled from a static fallback instead.
    """

    anomaly_title: str = Field(..., description="Short headline naming the detected anomaly.")
    summary: str = Field(..., description="One or two sentence summary of what happened.")
    confidence: int = Field(..., ge=0, le=100, description="Confidence in the root cause, 0-100.")
    root_cause: str = Field(..., description="The most likely root cause identified.")
    evidence: list[str] = Field(..., description="Bullet-point evidence supporting the root cause.")
    recommended_actions: list[str] = Field(..., description="Merchant-approved actions Niriksh recommends.")
    verification_checks: list[str] = Field(..., description="Metrics that would confirm the issue is resolved.")
    merchant_message: str = Field(..., description="Plain-language message written for the merchant.")
    workflow_status: str = Field(..., description="e.g. 'Awaiting merchant approval', 'Running', 'Completed'.")


class ActiveInvestigationResponse(ActiveInvestigation):
    """What GET /api/investigation/active actually returns: the investigation
    content above, plus a server-generated id. Sarvam never sees or produces
    this id — it's attached by investigation_service.py after validation, so
    that POST /api/workflow/run can reference exactly which investigation a
    merchant is approving (see workflow_service.py)."""

    investigation_id: str


class InvestigationHistoryItem(BaseModel):
    incident: str
    severity: Literal["High", "Medium", "Low"]
    status: Literal["Investigating", "Resolved", "Verified"]
    time_label: str = Field(..., description="Human-readable relative time, e.g. 'Yesterday'.")


class InvestigationHistory(BaseModel):
    """Response for GET /api/investigations."""

    items: list[InvestigationHistoryItem]
