from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import database, incident as models_incident, report as models_report
from ..services.report_generator import generate_report_markdown

router = APIRouter()

@router.post("/{incident_id}")
def generate_report(incident_id: int, db: Session = Depends(database.get_db)):
    incident = db.query(models_incident.Incident).filter(models_incident.Incident.id == incident_id).first()
    if not incident:
         raise HTTPException(status_code=404, detail="Incident not found")
         
    inv = db.query(models_incident.Investigation).filter(models_incident.Investigation.incident_id == incident_id).first()
    inv_data = {}
    if inv:
        inv_data = {
            "summary": inv.summary,
            "ai_analysis": inv.ai_analysis,
            "recommended_actions": inv.recommended_actions
        }
        
    incident_data = {
       "id": incident.id,
       "created_at": str(incident.created_at),
       "severity": incident.severity,
       "status": incident.status,
       "incident_type": incident.incident_type,
       "source_ip": incident.source_ip,
       "affected_user": incident.affected_user,
       "confidence": incident.confidence
    }
    
    md = generate_report_markdown(incident_data, inv_data)
    
    # Save Report
    new_report = models_report.Report(
        incident_id=incident_id,
        title=f"Incident Analysis: {incident_data['incident_type']}",
        content_markdown=md
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    
    return new_report

@router.get("/")
def get_reports(db: Session = Depends(database.get_db)):
    return db.query(models_report.Report).all()
    
@router.get("/{report_id}")
def get_report(report_id: int, db: Session = Depends(database.get_db)):
    return db.query(models_report.Report).filter(models_report.Report.id == report_id).first()
