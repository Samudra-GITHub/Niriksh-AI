"""
Cognee memory engine.

Gives Niriksh persistent, per-merchant memory of past incidents, so an
investigation can reason with context like "this happened before, and
here's how it was resolved" instead of starting from zero every time.

Isolated exactly like sarvam_service.py: everything specific to Cognee's
HTTP contract lives in this one module. A real call is attempted only when
COGNEE_API_KEY is set; on any failure (or when it's unset) every public
function here falls back to an in-process mock store seeded with M102's
history. Memory being unavailable must never fail an investigation.

API reference: https://docs.cognee.ai/api-reference/introduction

Note on the real-call path: `_cognee_search` below calls the documented
POST /search endpoint with real auth, but its response shape depends on
`search_type` and isn't fully mapped into MerchantMemory yet — that mapping
needs a live Cognee Cloud account to verify against, so for now a
successful-but-unparsed response still falls through to the mock store
rather than guessing at a shape. This is the one place a future
integration needs to touch.
"""

import logging

import httpx

from app.config import get_settings
from app.models.entities import MerchantMemoryRecord
from app.schemas.investigation import ActiveInvestigation
from app.schemas.memory import MerchantMemory
from app.utils.classify import infer_incident_type

logger = logging.getLogger(__name__)

COGNEE_BASE_URL = "https://api.cognee.ai/api/v1"
REQUEST_TIMEOUT_SECONDS = 10.0

# The one merchant this hackathon build models. Once there's auth/session
# context, this comes from the logged-in merchant instead of a constant —
# see the same note in app/services/investigation_service.py.
DEFAULT_MERCHANT_ID = "M102"

# ---------------------------------------------------------------------------
# Mock memory store — seeded with M102's incident history, newest first.
# Once Supabase is wired up, this dict becomes a `merchant_memory` table
# query (see the note on MerchantMemoryRecord in app/models/entities.py);
# the Cognee calls below are unaffected, since Cognee holds the graph/
# semantic index rather than the row-level record.
# ---------------------------------------------------------------------------

_MOCK_STORE: dict[str, list[MerchantMemoryRecord]] = {
    "M102": [
        MerchantMemoryRecord(
            merchant_id="M102",
            merchant_name="Kavita General Store",
            incident_date="Yesterday",
            incident_type="refund_spike",
            root_cause="Refund spike after lunch rush caused by duplicate order submissions.",
            actions_taken=[
                "Reviewed the refund queue for duplicate charges.",
                "Merchant approved a manual refund batch clearance.",
            ],
            verification_result="Refund volume returned to baseline within 2 hours.",
            notes=(
                "A duplicate-order refund spike happened yesterday after the lunch "
                "rush. It resolved within 2 hours once the merchant approved the "
                "refund batch."
            ),
            confidence=88,
            outcome="Resolved",
        ),
        MerchantMemoryRecord(
            merchant_id="M102",
            merchant_name="Kavita General Store",
            incident_date="Friday",
            incident_type="payment_failure",
            root_cause="Payment gateway disruption during evening peak hours.",
            actions_taken=[
                "Retried failed transactions through gateway failover.",
                "Notified affected customers of the delay.",
            ],
            verification_result="Payment success rate returned to 98% within 15 minutes.",
            notes=(
                "A similar payment processing issue occurred last Friday between "
                "7:00 PM and 9:00 PM. The previous recovery workflow restored "
                "payment success within 15 minutes."
            ),
            confidence=93,
            outcome="Recovered",
        ),
        MerchantMemoryRecord(
            merchant_id="M102",
            merchant_name="Kavita General Store",
            incident_date="Last week",
            incident_type="qr_outage",
            root_cause="QR code deactivated due to an expired merchant certificate.",
            actions_taken=[
                "Reissued the QR certificate.",
                "Reactivated the QR endpoint.",
            ],
            verification_result="QR scans resumed normally within 30 minutes.",
            notes=(
                "The store's QR code went inactive last week after its certificate "
                "expired. Reissuing the certificate restored scans within 30 minutes."
            ),
            confidence=95,
            outcome="Verified",
        ),
    ]
}


def _record_to_schema(record: MerchantMemoryRecord) -> MerchantMemory:
    return MerchantMemory(
        merchant_id=record.merchant_id,
        merchant_name=record.merchant_name,
        incident_date=record.incident_date,
        incident_type=record.incident_type,
        root_cause=record.root_cause,
        actions_taken=record.actions_taken,
        verification_result=record.verification_result,
        notes=record.notes,
        confidence=record.confidence,
        outcome=record.outcome,
    )


def _headers(api_key: str) -> dict[str, str]:
    return {"X-Api-Key": api_key, "Content-Type": "application/json"}


async def _cognee_search(api_key: str, query: str) -> list[MerchantMemory] | None:
    """Attempt a real Cognee semantic search. Returns None on any failure,
    or if the response can't yet be mapped, so callers fall back to the
    mock store without special-casing errors."""
    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.post(
                f"{COGNEE_BASE_URL}/search",
                json={"query": query, "search_type": "GRAPH_COMPLETION"},
                headers=_headers(api_key),
            )
            response.raise_for_status()
            # See the module docstring — response parsing isn't wired up
            # yet, so a live response still defers to the mock store below.
            return None
    except httpx.HTTPError as exc:
        logger.warning("Cognee search failed, falling back to mock memory: %s", exc)
        return None


async def get_merchant_memory(merchant_id: str) -> list[MerchantMemory]:
    """All known incidents for a merchant, newest first."""
    settings = get_settings()

    if settings.cognee_api_key:
        result = await _cognee_search(
            settings.cognee_api_key, f"incident history for merchant {merchant_id}"
        )
        if result is not None:
            return result

    records = _MOCK_STORE.get(merchant_id, [])
    return [_record_to_schema(r) for r in records]


async def search_similar_incidents(merchant_id: str, anomaly_type: str) -> list[MerchantMemory]:
    """Incidents whose type or root cause relates to `anomaly_type`
    (e.g. 'payment_failure')."""
    settings = get_settings()

    if settings.cognee_api_key:
        result = await _cognee_search(
            settings.cognee_api_key,
            f"incidents similar to '{anomaly_type}' for merchant {merchant_id}",
        )
        if result is not None:
            return result

    memories = await get_merchant_memory(merchant_id)
    needle = anomaly_type.lower()
    return [m for m in memories if needle in m.incident_type.lower() or needle in m.root_cause.lower()]


async def save_investigation_memory(merchant_id: str, investigation: ActiveInvestigation) -> MerchantMemory:
    """Persist a completed investigation as a new memory.

    This is a placeholder — implemented and callable today, but not yet
    wired into any route. See the TODO in investigation_service.py for
    where this gets called once workflow completion (via a future n8n
    webhook) is real, instead of merely proposed by Sarvam.
    """
    settings = get_settings()

    record = MerchantMemoryRecord(
        merchant_id=merchant_id,
        merchant_name="Kavita General Store",  # TODO: resolve via merchant_service once multi-merchant.
        incident_date="Today",
        incident_type=infer_incident_type(investigation.root_cause),
        root_cause=investigation.root_cause,
        actions_taken=investigation.recommended_actions,
        verification_result="; ".join(investigation.verification_checks) or "Pending verification.",
        notes=investigation.merchant_message,
        confidence=investigation.confidence,
        outcome="Recorded",  # Not yet a real outcome — see docstring above.
    )

    if settings.cognee_api_key:
        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
                await client.post(
                    f"{COGNEE_BASE_URL}/add",
                    json={
                        "raw_data": investigation.model_dump_json(),
                        "datasetName": f"merchant-{merchant_id}",
                    },
                    headers=_headers(settings.cognee_api_key),
                )
                await client.post(
                    f"{COGNEE_BASE_URL}/cognify",
                    json={"datasets": [f"merchant-{merchant_id}"]},
                    headers=_headers(settings.cognee_api_key),
                )
        except httpx.HTTPError as exc:
            logger.warning(
                "Cognee save failed, keeping this memory in the local mock store only: %s", exc
            )

    _MOCK_STORE.setdefault(merchant_id, []).insert(0, record)
    return _record_to_schema(record)
