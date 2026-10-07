from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime, timezone

class LogFile(Base):
    __tablename__ = "log_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_type = Column(String)
    file_size = Column(Integer)
    event_count = Column(Integer, default=0)
    status = Column(String)
    uploaded_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    events = relationship("LogEvent", back_populates="log_file")

class LogEvent(Base):
    __tablename__ = "log_events"

    id = Column(Integer, primary_key=True, index=True)
    log_file_id = Column(Integer, ForeignKey("log_files.id"))
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    
    timestamp = Column(DateTime, index=True)
    source_ip = Column(String, index=True)
    destination_ip = Column(String)
    username = Column(String, index=True)
    action = Column(String)
    status = Column(String)
    event_type = Column(String)
    port = Column(Integer)
    protocol = Column(String)
    message = Column(String)
    
    original_raw = Column(String) # Raw log string if needed
    
    log_file = relationship("LogFile", back_populates="events")
    incident = relationship("Incident", back_populates="events")
