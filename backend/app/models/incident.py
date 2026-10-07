from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String, index=True)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    incident_type = Column(String, index=True)
    source_ip = Column(String)
    affected_user = Column(String)
    confidence = Column(Float)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    
    events = relationship("LogEvent", back_populates="incident")
    investigations = relationship("Investigation", back_populates="incident")


class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String)
    category = Column(String)
    severity = Column(String)
    explanation = Column(String)
    evidence = Column(String) # Stored as JSON string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Investigation(Base):
    __tablename__ = "investigations"
    
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    summary = Column(String)
    ai_analysis = Column(String) # JSON or text
    recommended_actions = Column(String) # JSON string
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    incident = relationship("Incident", back_populates="investigations")
