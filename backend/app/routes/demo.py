from fastapi import APIRouter
from pydantic import BaseModel

from app.services import cognee_service, investigation_service, workflow_service

router = APIRouter()


class DemoResetResponse(BaseModel):
    reset: bool = True
    message: str = "Demo data reset — merchant memory, investigation history, and workflow state are back to their seeded starting point."


@router.post(
    "/demo/reset",
    response_model=DemoResetResponse,
    summary="Reset demo state",
    description=(
        "Demo Mode: restores merchant memory (Cognee), investigation history, "
        "and clears in-flight/completed workflows back to their seeded "
        "starting point — for a clean, repeatable demo run. Does not touch "
        "any real Supabase data (there isn't any yet); this only resets the "
        "in-process mock stores."
    ),
)
async def reset_demo() -> DemoResetResponse:
    investigation_service.reset_demo_state()
    cognee_service.reset_demo_state()
    workflow_service.reset_demo_state()
    return DemoResetResponse()
