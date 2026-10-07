from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import database, incident as models_incident, log_event as models_event
from ..services.timeline_generator import generate_timeline

router = APIRouter()

@router.get("/")
def get_incidents(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    incidents = db.query(models_incident.Incident).offset(skip).limit(limit).all()
    # Let's convert to dict for easy frontend consumption
    res = []
    for inc in incidents:
        res.append({
            "id": inc.id,
            "severity": inc.severity,
            "status": inc.status,
            "incident_type": inc.incident_type,
            "source_ip": inc.source_ip,
            "created_at": inc.created_at
        })
    return res

@router.get("/{incident_id}")
def get_incident(incident_id: int, db: Session = Depends(database.get_db)):
    incident = db.query(models_incident.Incident).filter(models_incident.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    events = db.query(models_event.LogEvent).filter(models_event.LogEvent.incident_id == incident_id).all()
    
    # Just a mock representation of detections for now
    detections = []
    
    data = {
        "id": incident.id,
        "severity": incident.severity,
        "status": incident.status,
        "incident_type": incident.incident_type,
        "source_ip": incident.source_ip,
        "affected_user": incident.affected_user,
        "start_time": incident.start_time,
        "end_time": incident.end_time,
        "created_at": incident.created_at,
        "events": [
            {
                "timestamp": e.timestamp,
                "action": e.action,
                "status": e.status,
                "message": e.message,
                "source_ip": e.source_ip,
                "username": e.username
            } for e in events
        ],
        "timeline": generate_timeline([e.__dict__ for e in events]),
        "detections": detections # In a real implementation this would come from a relation
    }
    
    return data
