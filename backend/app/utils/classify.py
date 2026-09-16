"""
Tiny shared heuristic for classifying free-text investigation content into
a short, machine-readable category. Used by cognee_service.py (a memory's
`incident_type`) and workflow_service.py (a workflow's `anomaly_type`) so
both agree on the same categories without importing from each other.
"""


def infer_incident_type(root_cause: str) -> str:
    lowered = root_cause.lower()
    if "payment" in lowered:
        return "payment_failure"
    if "refund" in lowered:
        return "refund_spike"
    if "qr" in lowered:
        return "qr_outage"
    return "anomaly"
