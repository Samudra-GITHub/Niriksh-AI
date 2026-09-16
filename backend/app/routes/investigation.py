from fastapi import APIRouter

from app.schemas.investigation import ActiveInvestigationResponse, InvestigationHistory
from app.services.investigation_service import (
    get_active_investigation,
    get_investigation_history,
)

router = APIRouter()


@router.get(
    "/investigation/active",
    response_model=ActiveInvestigationResponse,
    summary="Active investigation",
    description=(
        "The anomaly Niriksh is currently investigating, reasoned about live by "
        "Sarvam AI using this merchant's Cognee memory as context, when both "
        "SARVAM_API_KEY and COGNEE_API_KEY are configured (falls back gracefully "
        "otherwise — this endpoint never errors): confidence, likely root cause, "
        "evidence, recommended actions, verification checks, a merchant-facing "
        "message, and workflow status — plus an investigation_id to pass to "
        "POST /api/workflow/run once a merchant approves it."
    ),
)
async def read_active_investigation() -> ActiveInvestigationResponse:
    return await get_active_investigation()


@router.get(
    "/investigations",
    response_model=InvestigationHistory,
    summary="Recent investigations",
    description="A history of previous incidents, their severity, and how each was resolved.",
)
async def read_investigation_history() -> InvestigationHistory:
    return await get_investigation_history()
