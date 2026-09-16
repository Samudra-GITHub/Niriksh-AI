from fastapi import APIRouter

from app.schemas.memory import MemoryTimeline
from app.services.cognee_service import DEFAULT_MERCHANT_ID, get_merchant_memory

router = APIRouter()


@router.get(
    "/memory/timeline",
    response_model=MemoryTimeline,
    summary="Merchant memory timeline",
    description=(
        "Chronological history of past incidents for this merchant, newest "
        "first — powered by Cognee's per-merchant graph memory, falling back "
        "to a local mocked history if Cognee is unavailable. This endpoint "
        "never errors."
    ),
)
async def read_memory_timeline() -> MemoryTimeline:
    memories = await get_merchant_memory(DEFAULT_MERCHANT_ID)
    return MemoryTimeline(items=memories)
