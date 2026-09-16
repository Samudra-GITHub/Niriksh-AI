"""
n8n workflow trigger.

Niriksh doesn't run the recovery workflow itself — n8n does, once a
merchant approves it. This module only speaks to n8n; the step-by-step
progress a merchant actually watches is simulated locally by
workflow_service.py until a real n8n workflow exists to poll for status.

Isolated exactly like sarvam_service.py / cognee_service.py: only this
file knows n8n's URL and payload shape. Swapping in a real, pollable
workflow later means rewriting `trigger_workflow` and
`check_workflow_status` — nothing else in the codebase changes.
"""

import logging
from typing import Any

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT_SECONDS = 8.0
MAX_ATTEMPTS = 2  # one real attempt + one retry

# The last status n8n itself reported for a workflow, if its webhook
# responded with one. workflow_service.py's own simulated progress is
# authoritative regardless of what's in here — this is best-effort only.
_last_reported_status: dict[str, str] = {}


async def trigger_workflow(payload: dict[str, Any]) -> bool:
    """POST the recovery workflow payload to N8N_WEBHOOK_URL.

    Returns True if n8n acknowledged the webhook, False otherwise (missing
    URL, timeout, or an error after one retry). Never raises — a merchant
    approving a workflow must never fail because n8n happens to be down;
    the workflow still runs its simulated progression either way.
    """
    settings = get_settings()
    if not settings.n8n_webhook_url:
        logger.info("N8N_WEBHOOK_URL not configured — running in simulated-only mode.")
        return False

    last_error: Exception | None = None

    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                response = await client.post(settings.n8n_webhook_url, json=payload)
                response.raise_for_status()

                try:
                    body = response.json()
                    if isinstance(body, dict) and "status" in body:
                        workflow_id = str(payload.get("workflow_id", ""))
                        _last_reported_status[workflow_id] = str(body["status"])
                except ValueError:
                    pass  # Most n8n webhooks just ack with 200 and no JSON body.

                return True
            except httpx.HTTPError as exc:
                last_error = exc
                logger.warning("n8n webhook failed (attempt %d/%d): %s", attempt, MAX_ATTEMPTS, exc)

    logger.warning("n8n webhook unreachable after %d attempt(s): %s", MAX_ATTEMPTS, last_error)
    return False


async def check_workflow_status(workflow_id: str) -> str | None:
    """The last status n8n itself reported for this workflow, if any.

    Today only a webhook URL is configured (no n8n instance API key), so
    there's no execution-status endpoint to poll — this returns whatever
    `trigger_workflow`'s response last recorded, or None. The status a
    merchant actually sees comes from workflow_service.py's own simulated
    state machine, which doesn't depend on this.
    """
    return _last_reported_status.get(workflow_id)
