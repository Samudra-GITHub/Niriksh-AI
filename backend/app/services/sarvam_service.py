"""
Sarvam AI investigation engine.

Isolated on purpose: everything specific to Sarvam's HTTP contract (the
endpoint, auth headers, model name, request/response shape) lives in this
one module. Swapping providers later means rewriting `generate_investigation`
— nothing else in the codebase needs to change, since callers only see the
typed `MerchantInvestigationContext` in / `ActiveInvestigation` out.

API reference: https://docs.sarvam.ai/api-reference/chat/chat-completions
"""

import json
import logging

import httpx
from pydantic import ValidationError

from app.config import get_settings
from app.schemas.investigation import ActiveInvestigation
from app.schemas.sarvam import MerchantInvestigationContext

logger = logging.getLogger(__name__)

SARVAM_CHAT_COMPLETIONS_URL = "https://api.sarvam.ai/v1/chat/completions"
SARVAM_MODEL = "sarvam-105b"
REQUEST_TIMEOUT_SECONDS = 15.0
MAX_ATTEMPTS = 2  # one real attempt + one retry

SYSTEM_PROMPT = """You are Niriksh AI, an autonomous merchant operations teammate for Paytm merchants.
Your job is to investigate unusual merchant activity.
You must:
1. Detect anomalies.
2. Explain the evidence.
3. Identify the most likely root cause.
4. Recommend merchant-approved actions.
5. Suggest verification metrics.

Return structured JSON only. Never return markdown. Never return conversational text."""

_RESPONSE_SCHEMA_HINT = (
    '{"anomaly_title": string, "summary": string, "confidence": integer 0-100, '
    '"root_cause": string, "evidence": [string], "recommended_actions": [string], '
    '"verification_checks": [string], "merchant_message": string, "workflow_status": string}'
)


class SarvamServiceError(RuntimeError):
    """Raised whenever Sarvam can't be reached or returns something unusable.

    Callers (investigation_service.py) catch this and fall back to a
    static mocked investigation — Sarvam being down must never break the
    frontend.
    """


def _build_user_prompt(context: MerchantInvestigationContext) -> str:
    return (
        "Investigate this merchant's activity and return ONLY a JSON object "
        f"matching exactly this schema, with no other text:\n{_RESPONSE_SCHEMA_HINT}\n\n"
        f"Merchant data:\n{context.model_dump_json(indent=2)}"
    )


def _build_payload(context: MerchantInvestigationContext) -> dict:
    return {
        "model": SARVAM_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": _build_user_prompt(context)},
        ],
        "temperature": 0.3,
        "response_format": {"type": "json_object"},
    }


async def generate_investigation(context: MerchantInvestigationContext) -> ActiveInvestigation:
    """Call Sarvam AI and return a typed, validated investigation.

    Raises `SarvamServiceError` on any failure (missing key, network error,
    timeout, non-2xx response, or a response that doesn't parse into
    `ActiveInvestigation`) after one retry — callers are expected to catch
    this and fall back gracefully.
    """
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise SarvamServiceError("SARVAM_API_KEY is not configured.")

    payload = _build_payload(context)
    headers = {
        "Authorization": f"Bearer {settings.sarvam_api_key}",
        "api-subscription-key": settings.sarvam_api_key,
        "Content-Type": "application/json",
    }

    last_error: Exception | None = None

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                response = await client.post(SARVAM_CHAT_COMPLETIONS_URL, json=payload, headers=headers)
                response.raise_for_status()

                body = response.json()
                content = body["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                return ActiveInvestigation.model_validate(parsed)

            except httpx.TimeoutException as exc:
                last_error = exc
                logger.warning("Sarvam request timed out (attempt %d/%d)", attempt, MAX_ATTEMPTS)
            except httpx.HTTPError as exc:
                last_error = exc
                logger.warning("Sarvam request failed (attempt %d/%d): %s", attempt, MAX_ATTEMPTS, exc)
            except (KeyError, IndexError, json.JSONDecodeError) as exc:
                last_error = exc
                logger.warning(
                    "Sarvam returned an unexpected response shape (attempt %d/%d): %s",
                    attempt,
                    MAX_ATTEMPTS,
                    exc,
                )
            except ValidationError as exc:
                last_error = exc
                logger.warning(
                    "Sarvam's JSON didn't match ActiveInvestigation (attempt %d/%d): %s",
                    attempt,
                    MAX_ATTEMPTS,
                    exc,
                )

    raise SarvamServiceError(f"Sarvam request failed after {MAX_ATTEMPTS} attempt(s): {last_error}") from last_error
