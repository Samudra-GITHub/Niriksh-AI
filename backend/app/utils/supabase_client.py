"""
Reusable Supabase client.

No service in this codebase calls Supabase yet — every service currently
returns mocked data (see app/services/). This module exists so that
swapping a mock for a real query is a one-line change:

    from app.utils.supabase_client import get_supabase_client

    def get_merchant_row(merchant_id: str) -> dict:
        client = get_supabase_client()
        response = client.table("merchants").select("*").eq("id", merchant_id).single().execute()
        return response.data

The client is created lazily and cached — importing this module never
requires SUPABASE_URL / SUPABASE_ANON_KEY to be set, only calling
`get_supabase_client()` does.
"""

from functools import lru_cache

from supabase import Client, create_client

from app.config import get_settings


class SupabaseNotConfiguredError(RuntimeError):
    """Raised when a Supabase call is attempted without credentials set."""


@lru_cache
def get_supabase_client() -> Client:
    settings = get_settings()

    if not settings.supabase_url or not settings.supabase_anon_key:
        raise SupabaseNotConfiguredError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in the environment "
            "(see backend/.env.example) before the Supabase client can be used."
        )

    return create_client(settings.supabase_url, settings.supabase_anon_key)
