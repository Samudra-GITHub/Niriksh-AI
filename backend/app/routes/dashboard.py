from fastapi import APIRouter

from app.schemas.dashboard import DashboardMetrics
from app.services.dashboard_service import get_dashboard_metrics

router = APIRouter()


@router.get(
    "/dashboard",
    response_model=DashboardMetrics,
    summary="Merchant dashboard metrics",
    description=(
        "Revenue, payment success rate, transaction volume, AI health score, "
        "and 14 days of revenue/transaction/refund chart data for the merchant "
        "overview screen."
    ),
)
async def read_dashboard() -> DashboardMetrics:
    return await get_dashboard_metrics()
