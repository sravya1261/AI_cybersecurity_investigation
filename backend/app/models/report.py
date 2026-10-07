from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    title = Column(String)
    content_markdown = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    incident = relationship("Incident")
