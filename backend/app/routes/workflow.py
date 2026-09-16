from fastapi import APIRouter, HTTPException

from app.schemas.workflow import Workflow, WorkflowRunRequest, WorkflowStatusResponse
from app.services.workflow_service import (
    WorkflowNotFoundError,
    get_workflow_status,
    start_workflow,
)

router = APIRouter()


@router.post(
    "/workflow/run",
    response_model=Workflow,
    status_code=202,
    summary="Approve and run a recovery workflow",
    description=(
        "A merchant approves an investigation's recommended actions and Niriksh "
        "triggers the n8n recovery workflow. Rejects with 400 if "
        "merchant_approved is false. Progress is simulated locally (n8n being "
        "unreachable never blocks it) and polled via "
        "GET /api/workflow/status/{workflow_id}."
    ),
)
async def run_workflow(payload: WorkflowRunRequest) -> Workflow:
    if not payload.merchant_approved:
        raise HTTPException(status_code=400, detail="Workflow requires merchant approval.")

    return await start_workflow(payload.merchant_id, payload.investigation_id)


@router.get(
    "/workflow/status/{workflow_id}",
    response_model=WorkflowStatusResponse,
    summary="Workflow progress",
    description="Current step, progress percentage, and verification status for a running workflow.",
)
async def read_workflow_status(workflow_id: str) -> WorkflowStatusResponse:
    try:
        return await get_workflow_status(workflow_id)
    except WorkflowNotFoundError:
        raise HTTPException(status_code=404, detail="Workflow not found.")
