# Niriksh AI — Backend

FastAPI service powering the Niriksh AI merchant dashboard. Every endpoint
currently returns mocked data with the exact response shape the frontend
expects — this is the real API contract, ready for Supabase to be wired in
behind it.

## Structure

```
backend/
  app/
    main.py            FastAPI app, CORS, router registration
    config.py           Environment-driven settings (Pydantic Settings)
    routes/              One file per resource — thin, calls a service
    services/            Business logic; mocked today, Supabase-backed later
      sarvam_service.py   Isolated Sarvam AI client — powers /api/investigation/active
      cognee_service.py   Isolated Cognee client — powers /api/memory/timeline
      n8n_service.py       Isolated n8n webhook client — fires the recovery workflow
      workflow_service.py  Simulated workflow state machine — powers /api/workflow/*
    models/               Domain entities (future DB row shapes)
    schemas/              Pydantic request/response models
    utils/
      supabase_client.py  Lazy, cached Supabase client factory
  requirements.txt
  .env.example
```

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS / Linux

pip install -r requirements.txt
copy .env.example .env          # Windows: copy, macOS/Linux: cp
```

Fill in `.env` with real Supabase credentials once the project exists —
until then the app runs fine with all values blank, since no service calls
Supabase yet.

To get real AI-generated investigations instead of the mocked fallback,
set `SARVAM_API_KEY` in `.env` to a key from https://dashboard.sarvam.ai.
Everything works with it blank too — `/api/investigation/active` just
returns the static fallback investigation instead, with no error.

Same story for `COGNEE_API_KEY` (get one from
https://docs.cognee.ai/cognee-cloud/ui/api-keys) — it powers merchant
memory. Left blank, `/api/memory/timeline` and the investigation's
historical context both fall back to a local mocked history for merchant
`M102`.

`N8N_WEBHOOK_URL` is the odd one out: leave it blank and everything still
works end to end — `POST /api/workflow/run` skips the webhook call and
simulates the full recovery workflow locally regardless.

## Run

```bash
uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`.

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- Health check: `GET /api/health`

## Endpoints

| Method | Path                        | Returns                                   |
| ------ | --------------------------- | ------------------------------------------ |
| GET    | `/api/health`               | Service status, version, timestamp         |
| GET    | `/api/dashboard`             | Revenue, success rate, transactions, AI health score, 14-day chart data |
| GET    | `/api/merchant`              | Merchant profile snapshot (UPI/QR/settlement status) |
| GET    | `/api/investigation/active`  | The anomaly currently being investigated — Sarvam AI-generated, or mocked as a fallback |
| GET    | `/api/investigations`        | History of past incidents                  |
| GET    | `/api/activity`               | The live investigation activity feed       |
| GET    | `/api/memory/timeline`        | Chronological merchant incident memory, newest first — Cognee-backed, or mocked as a fallback |
| POST   | `/api/workflow/run`           | Approve an investigation and trigger its recovery workflow — 400 if not approved |
| GET    | `/api/workflow/status/{id}`   | Current step, progress %, and verification status for a running workflow |

## Replacing mocks with Supabase

Every service (`app/services/*.py`) has a `_get_mock_*()` function that
builds a domain entity (`app/models/entities.py`) from constants. To go
live:

1. Create the Supabase table.
2. Replace the body of `_get_mock_*()` with a query via
   `app.utils.supabase_client.get_supabase_client()`, returning the same
   entity dataclass.
3. Leave the mapping into the Pydantic response schema untouched.

## Sarvam AI investigation engine

`GET /api/investigation/active` calls `services/sarvam_service.py`, which:

1. Builds a `MerchantInvestigationContext` (merchant profile + today's
   metrics — mocked in `investigation_service.py` for now).
2. Sends it to Sarvam's chat completions API (`sarvam-105b`, JSON mode)
   with a system prompt instructing it to behave as Niriksh AI and return
   only structured JSON.
3. Validates the response against the `ActiveInvestigation` schema —
   Sarvam's structured output IS the API response, with no extra mapping.
4. Retries once on a network error, timeout, or malformed response.
5. If both attempts fail (or `SARVAM_API_KEY` isn't set), the caller falls
   back to a static mocked investigation. The endpoint never errors.

Everything Sarvam-specific (the endpoint URL, auth headers, model name,
request/response shape) is isolated in that one file — swapping providers
later means rewriting `generate_investigation`, nothing else.

## Cognee memory engine

`GET /api/memory/timeline` and the investigation's `historical_notes` both
call `services/cognee_service.py`, which:

1. Keeps a per-merchant, in-process mock history (three seeded incidents
   for merchant `M102`) as its fallback.
2. When `COGNEE_API_KEY` is set, attempts a real call to Cognee's hosted
   search API first — see the module docstring for exactly how far that
   integration goes today (the auth and request shape are real; response
   parsing is the one piece still to be verified against a live account).
3. Exposes `get_merchant_memory`, `search_similar_incidents`, and
   `save_investigation_memory` — the last one is called by
   `workflow_service.py` once a recovery workflow actually completes (see
   below), not merely when Sarvam proposes one.

Before calling Sarvam, `investigation_service.py` retrieves this merchant's
memory and folds a short summary of it into the prompt — so Sarvam reasons
with real history ("this happened before, here's how it resolved") instead
of a hardcoded string.

## n8n workflow engine

`POST /api/workflow/run` and `GET /api/workflow/status/{id}` are the
merchant-approval flow: once a merchant clicks "Approve & Run Workflow" on
the frontend, this is what actually runs.

1. `GET /api/investigation/active` tags each investigation it returns with
   an `investigation_id` and caches the full content in
   `investigation_service._INVESTIGATION_CACHE`.
2. `POST /api/workflow/run` looks that investigation up, rejects with 400
   if `merchant_approved` is false, and otherwise creates a workflow record
   and kicks off `workflow_service._run_workflow` as a background task —
   the response comes back immediately (202) with the workflow's id.
3. That background task fires the n8n webhook via `n8n_service.py` (best
   effort — a failure or missing `N8N_WEBHOOK_URL` is logged and ignored)
   and then advances the workflow through six steps over ~5-6 seconds:
   Merchant Approved → Workflow Triggered → Merchant Notified → Recovery
   Action Executed → Verification Running → Issue Verified.
4. The frontend polls `GET /api/workflow/status/{id}` roughly once a
   second to animate `components/investigation/WorkflowProgress.tsx` and
   the dashboard's Active Investigation card.
5. On successful completion, `_on_workflow_completed` calls
   `cognee_service.save_investigation_memory` and
   `investigation_service.add_completed_investigation` — this is the real,
   confirmed trigger point for both, distinct from Sarvam merely proposing
   a fix.

Everything n8n-specific (the webhook URL and payload shape) is isolated in
`n8n_service.py`; the step-by-step simulation lives in `workflow_service.py`
and doesn't depend on n8n responding at all, so an unreachable or
unconfigured n8n never breaks the merchant-facing flow.

No authentication is implemented yet — this is a pre-auth foundation.
