from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.speech import SpeakRequest, SpeakResponse, TranscriptionResponse
from app.services.speech_service import SpeechServiceError, synthesize_speech, transcribe_audio

router = APIRouter()


@router.post(
    "/speech/transcribe",
    response_model=TranscriptionResponse,
    summary="Transcribe voice input",
    description=(
        "Uploads recorded audio to Sarvam Speech-to-Text with automatic language "
        "detection across English, Hindi, Kannada, Tamil, and Bengali. Returns "
        "502 if Sarvam is unreachable or SARVAM_API_KEY isn't set — the frontend "
        "falls back to a typed-text input in that case."
    ),
)
async def transcribe(file: UploadFile = File(...)) -> TranscriptionResponse:
    audio_bytes = await file.read()
    try:
        return await transcribe_audio(
            audio_bytes, file.filename or "recording.webm", file.content_type or "audio/webm"
        )
    except SpeechServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.post(
    "/speech/speak",
    response_model=SpeakResponse,
    summary="Speak the investigation aloud",
    description=(
        "Translates the given text into the requested language (skipped for "
        "English) and synthesizes it with Sarvam Text-to-Speech, returning "
        "base64-encoded WAV audio. Returns 502 if Sarvam is unreachable or "
        "SARVAM_API_KEY isn't set — the frontend simply doesn't play audio "
        "in that case."
    ),
)
async def speak(payload: SpeakRequest) -> SpeakResponse:
    try:
        return await synthesize_speech(payload.text, payload.language_code)
    except SpeechServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
