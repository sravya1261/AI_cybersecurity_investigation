from pydantic import BaseModel
from datetime import datetime

class ReportBase(BaseModel):
    title: str
    content_markdown: str

class ReportCreate(ReportBase):
    incident_id: int

class ReportResponse(ReportBase):
    id: int
    incident_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
