"""
Sarvam AI chat/reasoning engine.

Isolated on purpose: everything specific to Sarvam's chat completions HTTP
contract (the endpoint, auth headers, model name, request/response shape)
lives in this one module. Swapping providers later means rewriting
`_chat_completion` — nothing else in the codebase needs to change, since
callers only see typed inputs/outputs.

Sarvam's *speech* endpoints (speech-to-text, text-to-speech) are a
different API surface entirely (different base path, multipart/binary
payloads) — those live in speech_service.py instead, even though both
modules read the same SARVAM_API_KEY.

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

    Callers catch this and fall back gracefully — Sarvam being down must
    never break the frontend (investigation_service.py falls back to a
    mocked investigation; speech_service.py skips translation and speaks
    the original text instead).
    """


async def _chat_completion(
    messages: list[dict[str, str]],
    *,
    temperature: float = 0.3,
    json_mode: bool = False,
) -> str:
    """Low-level Sarvam chat completion call — returns the raw response
    content string. Shared by `generate_investigation` below and by
    speech_service.py's translation step, so both get the same retry/
    timeout handling without duplicating the HTTP plumbing.

    Raises `SarvamServiceError` on any failure after one retry.
    """
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise SarvamServiceError("SARVAM_API_KEY is not configured.")

    payload: dict[str, object] = {
        "model": SARVAM_MODEL,
        "messages": messages,
        "temperature": temperature,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

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
                return body["choices"][0]["message"]["content"]

            except httpx.TimeoutException as exc:
                last_error = exc
                logger.warning("Sarvam request timed out (attempt %d/%d)", attempt, MAX_ATTEMPTS)
            except httpx.HTTPError as exc:
                last_error = exc
                logger.warning("Sarvam request failed (attempt %d/%d): %s", attempt, MAX_ATTEMPTS, exc)
            except (KeyError, IndexError) as exc:
                last_error = exc
                logger.warning(
                    "Sarvam returned an unexpected response shape (attempt %d/%d): %s",
                    attempt,
                    MAX_ATTEMPTS,
                    exc,
                )

    raise SarvamServiceError(f"Sarvam request failed after {MAX_ATTEMPTS} attempt(s): {last_error}") from last_error


def _build_user_prompt(context: MerchantInvestigationContext) -> str:
    return (
        "Investigate this merchant's activity and return ONLY a JSON object "
        f"matching exactly this schema, with no other text:\n{_RESPONSE_SCHEMA_HINT}\n\n"
        f"Merchant data:\n{context.model_dump_json(indent=2)}"
    )


async def generate_investigation(context: MerchantInvestigationContext) -> ActiveInvestigation:
    """Call Sarvam AI and return a typed, validated investigation.

    Raises `SarvamServiceError` on any failure (missing key, network error,
    timeout, non-2xx response, or a response that doesn't parse into
    `ActiveInvestigation`) — callers are expected to catch this and fall
    back gracefully.
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": _build_user_prompt(context)},
    ]

    try:
        content = await _chat_completion(messages, temperature=0.3, json_mode=True)
        parsed = json.loads(content)
        return ActiveInvestigation.model_validate(parsed)
    except json.JSONDecodeError as exc:
        raise SarvamServiceError(f"Sarvam returned non-JSON content: {exc}") from exc
    except ValidationError as exc:
        raise SarvamServiceError(f"Sarvam's JSON didn't match ActiveInvestigation: {exc}") from exc


async def translate_text(text: str, target_language_name: str) -> str:
    """Translate `text` into `target_language_name` (e.g. 'Kannada') using
    the same Sarvam chat model. Used by speech_service.py to localize the
    merchant-facing message before Text-to-Speech synthesis, so a merchant
    who spoke in Kannada hears Niriksh reply in Kannada.

    Raises `SarvamServiceError` on failure — the caller falls back to
    speaking the original (untranslated) text rather than failing outright.
    """
    if target_language_name.lower() == "english":
        return text

    messages = [
        {
            "role": "system",
            "content": (
                "You are a translation engine. Translate the user's text faithfully "
                "and naturally. Return ONLY the translated text — no notes, no "
                "quotes, no markdown, no explanation."
            ),
        },
        {"role": "user", "content": f"Translate the following into {target_language_name}:\n\n{text}"},
    ]
    content = await _chat_completion(messages, temperature=0.1)
    return content.strip()
