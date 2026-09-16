from fastapi import APIRouter

from app.schemas.merchant import MerchantSnapshot
from app.services.merchant_service import get_merchant_snapshot

router = APIRouter()


@router.get(
    "/merchant",
    response_model=MerchantSnapshot,
    summary="Merchant profile snapshot",
    description="Store identity plus UPI, QR, and settlement health for the merchant snapshot card.",
)
async def read_merchant() -> MerchantSnapshot:
    return await get_merchant_snapshot()
