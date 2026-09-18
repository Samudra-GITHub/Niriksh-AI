from pydantic import BaseModel, Field


class TranscriptionResponse(BaseModel):
    """Response for POST /api/speech/transcribe."""

    transcript: str
    language_code: str = Field(..., description="BCP-47 code, e.g. 'kn-IN'.")
    language_name: str = Field(..., description="Human-readable name, e.g. 'Kannada'.")
    confidence: float = Field(..., ge=0, le=1, description="Sarvam's language detection confidence.")


class SpeakRequest(BaseModel):
    """Body for POST /api/speech/speak."""

    text: str
    language_code: str = Field(default="en-IN", description="BCP-47 code to speak the reply in.")


class SpeakResponse(BaseModel):
    """Response for POST /api/speech/speak — audio the frontend plays directly."""

    audio_base64: str = Field(..., description="Base64-encoded WAV audio.")
    audio_format: str = "wav"
    language_code: str
    spoken_text: str = Field(..., description="The text actually spoken — translated, if applicable.")
