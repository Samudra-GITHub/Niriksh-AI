from datetime import datetime, timezone

from fastapi import APIRouter

from app.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Confirms the backend is up. Useful for the hackathon demo and for uptime checks.",
)
async def health_check() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        status="healthy",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(timezone.utc),
    )
