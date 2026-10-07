from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..models import database, incident as models_incident
from ..services.ai_investigator import ai_investigator

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/{incident_id}/investigate")
def run_investigation(incident_id: int, db: Session = Depends(database.get_db)):
    incident = db.query(models_incident.Incident).filter(models_incident.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    # Check if investigation already exists
    inv = db.query(models_incident.Investigation).filter(models_incident.Investigation.incident_id == incident_id).first()
    if inv:
        return {"summary": inv.summary, "ai_analysis": inv.ai_analysis, "recommended_actions": inv.recommended_actions}
        
    # Gather metadata
    metadata = {
        "incident_type": incident.incident_type,
        "source_ip": incident.source_ip,
        "severity": incident.severity
    }
    
    # Mock detections fetch (ideally this comes from DB)
    detections = [] 
    
    results = ai_investigator.investigate(metadata, detections)
    
    # Save
    new_inv = models_incident.Investigation(
        incident_id=incident_id,
        summary=results['summary'],
        ai_analysis=results['ai_analysis'],
        recommended_actions=results['recommended_actions']
    )
    db.add(new_inv)
    db.commit()
    
    return results

@router.post("/{incident_id}/chat")
def chat_with_ai(incident_id: int, request: ChatRequest, db: Session = Depends(database.get_db)):
    incident = db.query(models_incident.Incident).filter(models_incident.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    metadata = {
        "incident_type": incident.incident_type,
        "source_ip": incident.source_ip,
        "severity": incident.severity
    }
    
    answer = ai_investigator.ask_question(request.query, metadata, "")
    
    return {"reply": answer}
