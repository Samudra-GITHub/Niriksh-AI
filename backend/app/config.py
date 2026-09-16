"""
Application configuration.

Settings are read from environment variables (and an optional `.env` file
in the `backend/` directory). Copy `.env.example` to `.env` and fill in
real values — nothing here is hardcoded.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Niriksh AI Backend"
    app_version: str = "1.0.0"
    environment: str = "development"

    # Supabase project credentials (read-only anon key — no auth yet).
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # Sarvam AI — powers investigation reasoning. See services/sarvam_service.py.
    sarvam_api_key: str = ""

    # Cognee — the persistent, per-merchant memory behind investigation
    # context. See services/cognee_service.py.
    cognee_api_key: str = ""

    # n8n — triggers the merchant-approved recovery workflow. See
    # services/n8n_service.py. Left blank, workflow progress is fully
    # simulated locally by services/workflow_service.py.
    n8n_webhook_url: str = ""

    # Comma-separated list of origins allowed to call this API.
    cors_origins: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
