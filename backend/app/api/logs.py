from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
import json
from ..models import database, incident as models_incident, log_event as models_event
from ..services import log_parser, log_normalizer, threat_detector, incident_correlator, severity_engine

router = APIRouter()

@router.post("/upload")
async def upload_logs(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    """Upload, parse, normalize logs, and run detection pipeline."""
    contents = await file.read()
    text = contents.decode("utf-8")
    
    # 1. Parse
    try:
        raw_events = log_parser.parse_log_content(text, file.filename)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    # 2. Normalize
    norm_events = log_normalizer.normalize_logs(raw_events)
    
    if not norm_events:
        raise HTTPException(status_code=400, detail="No events could be parsed.")
        
    # 3. Save Log File entry
    db_file = models_event.LogFile(
        filename=file.filename,
        file_type=file.content_type or file.filename.split('.')[-1],
        file_size=len(contents),
        event_count=len(norm_events),
        status="PROCESSED"
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    
    # 4. Threat Detection
    detections = threat_detector.detect_threats(norm_events)
    
    # 5. Incident Correlation
    incidents_data = incident_correlator.correlate_incidents(detections)
    
    # 6. Save data
    for inc_data in incidents_data:
        # Severity
        sev = severity_engine.calculate_severity(inc_data)
        conf = severity_engine.get_confidence(inc_data)
        
        db_incident = models_incident.Incident(
            severity=sev,
            incident_type=inc_data['incident_type'],
            source_ip=inc_data.get('source_ip'),
            affected_user=inc_data.get('affected_user'),
            confidence=conf,
            start_time=inc_data.get('start_time'),
            end_time=inc_data.get('end_time')
        )
        db.add(db_incident)
        db.commit()
        db.refresh(db_incident)
        
        # Save detections
        for det in inc_data['detections']:
            db_det = models_incident.Detection(
                rule_name=det['rule_name'],
                category=det['category'],
                severity=det['severity'],
                explanation=det['explanation'],
                evidence=det['evidence']
            )
            # Link det to incident if we add relationship. (Omitted in basic schema, could store JSON linked to incident).
            db.add(db_det)
            
        # Save related events
        for ev in inc_data['events']:
            db_event = models_event.LogEvent(
                log_file_id=db_file.id,
                incident_id=db_incident.id,
                timestamp=ev.get('timestamp'),
                source_ip=ev.get('source_ip'),
                destination_ip=ev.get('destination_ip'),
                username=ev.get('username'),
                action=ev.get('action'),
                status=ev.get('status'),
                event_type=ev.get('event_type'),
                port=ev.get('port'),
                protocol=ev.get('protocol'),
                message=ev.get('message')
            )
            db.add(db_event)
            
    db.commit()
    return {"message": "Logs processed successfully.", "file_id": db_file.id, "incidents_created": len(incidents_data)}

@router.get("/")
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    events = db.query(models_event.LogEvent).offset(skip).limit(limit).all()
    # Simple list returning dicts
    return events
