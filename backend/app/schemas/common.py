from datetime import datetime

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall service status.", examples=["healthy"])
    service: str = Field(..., description="Human-readable service name.")
    version: str = Field(..., description="Deployed backend version.")
    timestamp: datetime = Field(..., description="Server time the check was answered, UTC.")
