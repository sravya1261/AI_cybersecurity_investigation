from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import database, incident as models_incident, log_event as models_event

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    total_incidents = db.query(models_incident.Incident).count()
    critical_incidents = db.query(models_incident.Incident).filter(models_incident.Incident.severity == "Critical").count()
    high_incidents = db.query(models_incident.Incident).filter(models_incident.Incident.severity == "High").count()
    logs_analyzed = db.query(models_event.LogEvent).count()
    
    # Simple aggregations
    severity_distribution = [
        {"name": "Critical", "value": critical_incidents},
        {"name": "High", "value": high_incidents},
        {"name": "Medium", "value": db.query(models_incident.Incident).filter(models_incident.Incident.severity == "Medium").count()},
        {"name": "Low", "value": db.query(models_incident.Incident).filter(models_incident.Incident.severity == "Low").count()}
    ]
    
    # Source IP stats
    ip_stats = db.query(models_incident.Incident.source_ip, func.count(models_incident.Incident.id)).group_by(models_incident.Incident.source_ip).all()
    top_ips = [{"ip": ip, "count": count} for ip, count in ip_stats if ip]
    
    return {
        "Total Incidents": total_incidents,
        "Critical Incidents": critical_incidents,
        "High Risk Incidents": high_incidents,
        "Logs Analyzed": logs_analyzed,
        "severity_data": severity_distribution,
        "top_ips": sorted(top_ips, key=lambda x: x['count'], reverse=True)[:5]
    }
