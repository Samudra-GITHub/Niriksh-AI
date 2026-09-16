"""
Activity feed service — the live investigation log shown on the dashboard.

Mocked for now. Once Cognee is wired up, each step Niriksh takes during an
investigation (collecting logs, cross-referencing signals, narrowing a
root cause) would be appended here in real time rather than returned as a
fixed list — this endpoint would back a polling or websocket feed instead.

When Maithrayi wires up Supabase, `_get_mock_events` becomes a query
against an `activity_events` table ordered by timestamp.
"""

from app.models.entities import ActivityEventRecord
from app.schemas.activity import ActivityEvent, ActivityFeed


def _get_mock_events() -> list[ActivityEventRecord]:
    return [
        ActivityEventRecord(time_label="09:42 AM", status="alert", description="Revenue anomaly detected."),
        ActivityEventRecord(time_label="09:43 AM", status="info", description="Payment logs collected."),
        ActivityEventRecord(time_label="09:44 AM", status="info", description="Refund spike investigated."),
        ActivityEventRecord(time_label="09:45 AM", status="success", description="Root cause identified."),
        ActivityEventRecord(time_label="09:46 AM", status="pending", description="Awaiting merchant approval."),
    ]


async def get_activity_feed() -> ActivityFeed:
    records = _get_mock_events()
    return ActivityFeed(
        events=[
            ActivityEvent(
                time_label=r.time_label,
                status=r.status,  # type: ignore[arg-type]
                description=r.description,
            )
            for r in records
        ]
    )
