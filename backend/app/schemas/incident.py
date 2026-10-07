from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from .log_event import LogEventResponse

class IncidentBase(BaseModel):
    incident_type: str
    severity: str
    source_ip: Optional[str] = None
    affected_user: Optional[str] = None
    confidence: float
    start_time: datetime
    end_time: datetime

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: int
    status: str
    created_at: datetime
    
    events: List[LogEventResponse] = []

    class Config:
        from_attributes = True

class DetectionResponse(BaseModel):
    id: int
    rule_name: str
    category: str
    severity: str
    explanation: str
    evidence: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class InvestigationResponse(BaseModel):
    id: int
    incident_id: int
    summary: str
    ai_analysis: str
    recommended_actions: str
    created_at: datetime
    
    class Config:
        from_attributes = True
