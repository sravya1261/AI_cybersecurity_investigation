from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogEventBase(BaseModel):
    timestamp: datetime
    source_ip: str
    destination_ip: Optional[str] = None
    username: Optional[str] = None
    action: Optional[str] = None
    status: Optional[str] = None
    event_type: Optional[str] = None
    port: Optional[int] = None
    protocol: Optional[str] = None
    message: Optional[str] = None

class LogEventCreate(LogEventBase):
    pass

class LogEventResponse(LogEventBase):
    id: int
    log_file_id: Optional[int]
    incident_id: Optional[int]

    class Config:
        from_attributes = True
