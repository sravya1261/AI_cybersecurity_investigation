from typing import Dict, Any

def calculate_severity(incident: Dict[str, Any]) -> str:
    """Calculate the severity of an incident based on its detections and events."""
    
    risk_score = 0
    
    detections = incident.get('detections', [])
    
    for det in detections:
        sev = det.get('severity', 'Low').lower()
        if sev == 'critical':
            risk_score += 10
        elif sev == 'high':
            risk_score += 5
        elif sev == 'medium':
            risk_score += 3
        else:
            risk_score += 1
            
    events = incident.get('events', [])
    if len(events) > 50:
        risk_score += 2 # High volume
        
    # Check for specific combos
    rule_names = [d.get("rule_name") for d in detections]
    if "Multiple Failed Logins" in rule_names and "Successful Login After Brute Force" in rule_names:
        risk_score += 4 # This is very bad
        
    if "Privileged Account Activity" in rule_names and "Successful Login After Brute Force" in rule_names:
        risk_score += 5
        
    # Map back to string
    if risk_score >= 10:
        return "Critical"
    elif risk_score >= 6:
        return "High"
    elif risk_score >= 3:
        return "Medium"
    else:
        return "Low"
        
def get_confidence(incident: Dict[str, Any]) -> float:
    """Calculate a confidence score (0-1) for the incident."""
    # Based on number of events and clear severity mappings
    count = len(incident.get('events', []))
    if count > 10: return 0.95
    if count > 5: return 0.85
    if count > 2: return 0.70
    return 0.50
