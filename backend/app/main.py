"""
Niriksh AI Backend — FastAPI entry point.

Run from the `backend/` directory:

    uvicorn app.main:app --reload

Swagger UI:  http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import activity, dashboard, demo, health, investigation, memory, merchant, speech, workflow

settings = get_settings()
is_production = settings.environment.lower() == "production"

app = FastAPI(
    title=settings.app_name,
    description=(
        "Backend for Niriksh AI — an autonomous operations teammate for Paytm "
        "merchants. GET /api/investigation/active is powered by Sarvam AI (with "
        "Cognee-backed merchant memory as context) when the respective API keys "
        "are set, falling back gracefully otherwise. POST /api/workflow/run turns "
        "a merchant-approved investigation into a running recovery workflow, "
        "triggering n8n and simulating progress locally either way. "
        "POST /api/speech/transcribe and /api/speech/speak add a voice "
        "copilot via Sarvam Speech, in English, Hindi, Kannada, Tamil, and "
        "Bengali. Every other endpoint returns mocked data with the real "
        "response contract the frontend integrates against. See "
        "app/services/ for where Supabase plugs in next."
    ),
    version=settings.app_version,
    # Swagger/ReDoc are a demo/dev convenience — hidden when ENVIRONMENT=production.
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(merchant.router, prefix="/api", tags=["Merchant"])
app.include_router(investigation.router, prefix="/api", tags=["Investigation"])
app.include_router(activity.router, prefix="/api", tags=["Activity"])
app.include_router(memory.router, prefix="/api", tags=["Memory"])
app.include_router(workflow.router, prefix="/api", tags=["Workflow"])
app.include_router(speech.router, prefix="/api", tags=["Speech"])

# Demo Mode reset — a hackathon-ops convenience, not a merchant-facing
# feature. Disabled in production so nobody can wipe demo state on a real
# deployment.
if not is_production:
    app.include_router(demo.router, prefix="/api", tags=["Demo"])
