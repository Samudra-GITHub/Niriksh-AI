"""
Workflow orchestration — turns a merchant-approved investigation into a
running recovery workflow.

Until a real n8n workflow exists to poll, progress is simulated locally:
`start_workflow` fires the n8n webhook (best effort, via n8n_service.py,
which never raises) and spawns a background task that advances an
in-memory workflow record through six steps over roughly 5-6 seconds.
GET /api/workflow/status/{id} reads that record — this is the async
polling the frontend does; n8n being unreachable never stops it.

When the workflow completes, `_on_workflow_completed` is the real trigger
for `cognee_service.save_investigation_memory` and for appending to
investigation history — this replaces the placeholder that used to be
noted in investigation_service.py before this workflow engine existed.
"""

import asyncio
import logging
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.schemas.investigation import ActiveInvestigation
from app.schemas.workflow import Workflow, WorkflowStatus, WorkflowStatusResponse
from app.services import cognee_service, investigation_service, n8n_service
from app.utils.classify import infer_incident_type

logger = logging.getLogger(__name__)

STEP_LABELS = [
    "Merchant Approved",
    "Workflow Triggered",
    "Merchant Notified",
    "Recovery Action Executed",
    "Verification Running",
    "Issue Verified",
]


class WorkflowNotFoundError(RuntimeError):
    pass


@dataclass
class _WorkflowState:
    workflow_id: str
    merchant_id: str
    investigation: ActiveInvestigation
    status: WorkflowStatus = "pending_approval"
    step_index: int = 0
    verification_status: str = "pending"
    started_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: datetime | None = None
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


# In-process only, like every other mock store in this codebase — a
# server restart clears in-flight workflows.
_WORKFLOWS: dict[str, _WorkflowState] = {}


def reset_demo_state() -> None:
    """Demo Mode: forget every in-flight or completed workflow record."""
    _WORKFLOWS.clear()


def _touch(state: _WorkflowState) -> None:
    state.updated_at = datetime.now(timezone.utc)


def _to_workflow_schema(state: _WorkflowState) -> Workflow:
    return Workflow(
        workflow_id=state.workflow_id,
        merchant_id=state.merchant_id,
        anomaly_type=infer_incident_type(state.investigation.root_cause),
        root_cause=state.investigation.root_cause,
        recommended_actions=state.investigation.recommended_actions,
        merchant_approved=True,
        status=state.status,
        started_at=state.started_at,
        completed_at=state.completed_at,
        verification_status=state.verification_status,
    )


async def start_workflow(merchant_id: str, investigation_id: str) -> Workflow:
    investigation = investigation_service.get_cached_investigation(investigation_id)
    if investigation is None:
        # Unknown or stale id (e.g. the server restarted) — fall back to a
        # fresh active investigation so approval still works rather than
        # rejecting the request outright.
        logger.warning(
            "No cached investigation for id=%s; using the current active investigation instead.",
            investigation_id,
        )
        investigation = await investigation_service.get_active_investigation()

    workflow_id = f"wf_{uuid.uuid4().hex[:10]}"
    state = _WorkflowState(workflow_id=workflow_id, merchant_id=merchant_id, investigation=investigation)
    _WORKFLOWS[workflow_id] = state

    asyncio.create_task(_run_workflow(workflow_id))

    return _to_workflow_schema(state)


async def get_workflow_status(workflow_id: str) -> WorkflowStatusResponse:
    state = _WORKFLOWS.get(workflow_id)
    if state is None:
        raise WorkflowNotFoundError(workflow_id)

    progress = round((state.step_index + 1) / len(STEP_LABELS) * 100)
    return WorkflowStatusResponse(
        workflow_id=state.workflow_id,
        status=state.status,
        progress=progress,
        current_step=STEP_LABELS[state.step_index],
        verification_status=state.verification_status,
        updated_at=state.updated_at,
    )


async def _run_workflow(workflow_id: str) -> None:
    state = _WORKFLOWS[workflow_id]
    try:
        state.status = "running"
        state.step_index = 1  # Workflow Triggered
        _touch(state)
        await n8n_service.trigger_workflow(
            {
                "workflow_id": workflow_id,
                "merchant_id": state.merchant_id,
                "anomaly_type": infer_incident_type(state.investigation.root_cause),
                "root_cause": state.investigation.root_cause,
                "recommended_actions": state.investigation.recommended_actions,
            }
        )

        await asyncio.sleep(1.0)
        state.step_index = 2  # Merchant Notified
        _touch(state)

        await asyncio.sleep(1.5)
        state.step_index = 3  # Recovery Action Executed
        _touch(state)

        await asyncio.sleep(1.5)
        state.status = "verifying"
        state.step_index = 4  # Verification Running
        _touch(state)

        await asyncio.sleep(1.0)
        state.step_index = 5  # Issue Verified
        state.verification_status = "verified"
        state.completed_at = datetime.now(timezone.utc)
        _touch(state)

        # Run side effects (memory save, history append) *before* flipping
        # status to "completed", so a poller that observes "completed"
        # never races ahead of them having actually happened.
        await _on_workflow_completed(state)

        state.status = "completed"
        _touch(state)

    except Exception:
        logger.exception("Workflow %s failed during execution", workflow_id)
        state.status = "failed"
        state.verification_status = "failed"
        _touch(state)


async def _on_workflow_completed(state: _WorkflowState) -> None:
    """Workflow completion — confirmed here, not merely proposed by Sarvam —
    is what actually updates merchant memory and investigation history."""
    await cognee_service.save_investigation_memory(state.merchant_id, state.investigation)

    incident_label = infer_incident_type(state.investigation.root_cause).replace("_", " ").title()
    investigation_service.add_completed_investigation(incident=incident_label, time_label="Just now")
