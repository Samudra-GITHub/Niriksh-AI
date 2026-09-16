"""
Merchant profile service.

Mocked for now. When Maithrayi wires up Supabase, replace `_get_mock_record`
with a query like:

    from app.utils.supabase_client import get_supabase_client

    async def _get_record(merchant_id: str) -> MerchantRecord:
        client = get_supabase_client()
        row = client.table("merchants").select("*").eq("id", merchant_id).single().execute().data
        return MerchantRecord(**row)

The mapping into `MerchantSnapshot` below stays the same either way.
"""

from app.models.entities import MerchantRecord
from app.schemas.merchant import MerchantSnapshot


def _get_mock_record() -> MerchantRecord:
    return MerchantRecord(
        id="merchant_kavita_general_store",
        store_name="Kavita General Store",
        category="Grocery & Daily Essentials",
        upi_status="Operational",
        qr_status="Operational",
        settlement_status="Delayed",
        last_sync_label="2 minutes ago",
    )


async def get_merchant_snapshot() -> MerchantSnapshot:
    record = _get_mock_record()
    return MerchantSnapshot(
        store_name=record.store_name,
        category=record.category,
        upi_status=record.upi_status,
        qr_status=record.qr_status,
        settlement_status=record.settlement_status,
        last_sync_label=record.last_sync_label,
    )
