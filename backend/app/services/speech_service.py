"""
Sarvam Speech — voice input and output for the investigation page.

Isolated exactly like sarvam_service.py / cognee_service.py / n8n_service.py:
everything specific to Sarvam's *speech* HTTP contract (a different API
surface from chat completions — different base path, multipart uploads,
base64 audio) lives in this one module. Translation before Text-to-Speech
reuses sarvam_service.translate_text, since that's still a chat-completion
call under the hood.

API reference:
  https://docs.sarvam.ai/api-reference/speech-to-text/transcribe
  https://docs.sarvam.ai/api-reference/text-to-speech/convert
"""

import logging

import httpx

from app.config import get_settings
from app.schemas.speech import SpeakResponse, TranscriptionResponse
from app.services.sarvam_service import SarvamServiceError, translate_text

logger = logging.getLogger(__name__)

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"
STT_MODEL = "saaras:v3"
TTS_MODEL = "bulbul:v3"
TTS_SPEAKER = "shubh"
REQUEST_TIMEOUT_SECONDS = 20.0
MAX_ATTEMPTS = 2  # one real attempt + one retry

# The five languages this hackathon build supports, per the product spec.
# Sarvam itself understands more Indic languages; this is just the display
# mapping for the frontend's language badge.
SUPPORTED_LANGUAGES: dict[str, str] = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "kn-IN": "Kannada",
    "ta-IN": "Tamil",
    "bn-IN": "Bengali",
}


class SpeechServiceError(RuntimeError):
    """Raised when Sarvam Speech can't be reached or returns something
    unusable. Routes catch this and respond with an error the frontend
    uses to fall back to typed text (transcription) or silent text-only
    display (speech synthesis) — voice failing must never break the
    investigation page.
    """


def _headers(api_key: str) -> dict[str, str]:
    return {"api-subscription-key": api_key}


async def transcribe_audio(audio_bytes: bytes, filename: str, content_type: str) -> TranscriptionResponse:
    """Send recorded audio to Sarvam Speech-to-Text with auto language
    detection (language_code="unknown"). Retries once on failure."""
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise SpeechServiceError("SARVAM_API_KEY is not configured.")

    last_error: Exception | None = None

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                response = await client.post(
                    SARVAM_STT_URL,
                    headers=_headers(settings.sarvam_api_key),
                    data={"model": STT_MODEL, "language_code": "unknown"},
                    files={"file": (filename, audio_bytes, content_type)},
                )
                response.raise_for_status()
                body = response.json()

                language_code = body.get("language_code") or "en-IN"
                language_name = SUPPORTED_LANGUAGES.get(language_code, language_code)

                return TranscriptionResponse(
                    transcript=body.get("transcript", ""),
                    language_code=language_code,
                    language_name=language_name,
                    confidence=float(body.get("language_probability") or 0.0),
                )

            except httpx.TimeoutException as exc:
                last_error = exc
                logger.warning("Sarvam STT timed out (attempt %d/%d)", attempt, MAX_ATTEMPTS)
            except httpx.HTTPError as exc:
                last_error = exc
                logger.warning("Sarvam STT failed (attempt %d/%d): %s", attempt, MAX_ATTEMPTS, exc)
            except (KeyError, ValueError) as exc:
                last_error = exc
                logger.warning(
                    "Sarvam STT returned an unexpected response shape (attempt %d/%d): %s",
                    attempt,
                    MAX_ATTEMPTS,
                    exc,
                )

    raise SpeechServiceError(f"Sarvam STT failed after {MAX_ATTEMPTS} attempt(s): {last_error}") from last_error


async def synthesize_speech(text: str, language_code: str) -> SpeakResponse:
    """Translate `text` into the target language (skipped for English) and
    synthesize it with Sarvam Text-to-Speech. Retries the TTS call once on
    failure; if translation itself fails, falls back to speaking the
    original text rather than failing the whole request.
    """
    settings = get_settings()
    if not settings.sarvam_api_key:
        raise SpeechServiceError("SARVAM_API_KEY is not configured.")

    language_name = SUPPORTED_LANGUAGES.get(language_code, "English")

    spoken_text = text
    if language_name != "English":
        try:
            spoken_text = await translate_text(text, language_name)
        except SarvamServiceError as exc:
            logger.warning("Translation to %s failed, speaking the original text: %s", language_name, exc)
            spoken_text = text

    last_error: Exception | None = None

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                response = await client.post(
                    SARVAM_TTS_URL,
                    headers={**_headers(settings.sarvam_api_key), "Content-Type": "application/json"},
                    json={
                        "text": spoken_text,
                        "language_code": language_code,
                        "model": TTS_MODEL,
                        "speaker": TTS_SPEAKER,
                    },
                )
                response.raise_for_status()
                body = response.json()
                audios = body.get("audios") or []
                if not audios:
                    raise SpeechServiceError("Sarvam TTS returned no audio.")

                return SpeakResponse(
                    audio_base64=audios[0],
                    audio_format="wav",
                    language_code=language_code,
                    spoken_text=spoken_text,
                )

            except httpx.TimeoutException as exc:
                last_error = exc
                logger.warning("Sarvam TTS timed out (attempt %d/%d)", attempt, MAX_ATTEMPTS)
            except httpx.HTTPError as exc:
                last_error = exc
                logger.warning("Sarvam TTS failed (attempt %d/%d): %s", attempt, MAX_ATTEMPTS, exc)

    raise SpeechServiceError(f"Sarvam TTS failed after {MAX_ATTEMPTS} attempt(s): {last_error}") from last_error
