from fastapi import APIRouter

from app.schemas.activity import ActivityFeed
from app.services.activity_service import get_activity_feed

router = APIRouter()


@router.get(
    "/activity",
    response_model=ActivityFeed,
    summary="Niriksh activity feed",
    description="The live investigation timeline: what Niriksh has checked, found, and is waiting on.",
)
async def read_activity() -> ActivityFeed:
    return await get_activity_feed()
