from typing import List, Dict, Any
import json
from datetime import timedelta
import pandas as pd

def detect_threats(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Simple rule-based threat detection."""
    detections = []
    
    # Sort events by timestamp
    try:
        sorted_events = sorted(events, key=lambda x: x.get('timestamp') or pd.Timestamp.min)
    except:
        sorted_events = events
        
    # Track failed logins
    failed_logins = {}
    
    for event in sorted_events:
        ip = event.get('source_ip')
        action = event.get('action') or ""
        status = event.get('status') or ""
        msg = event.get('message') or ""
        
        # Rule 1: Failed Login Attempt
        if "login" in action.lower() or "auth" in action.lower() or "login" in msg.lower():
            if status == "failed":
                if ip not in failed_logins:
                    failed_logins[ip] = []
                failed_logins[ip].append(event)
                
                # Check for brute force (e.g. > 3 failures)
                if len(failed_logins[ip]) == 4: # Trigger once at 4
                    detections.append({
                        "rule_name": "Multiple Failed Logins",
                        "category": "Credential Access",
                        "severity": "Medium",
                        "explanation": "Multiple authentication failures detected from a single source IP.",
                        "evidence": json.dumps({"source_ip": ip, "count": len(failed_logins[ip])}),
                        "events": failed_logins[ip][-4:]
                    })
                    
            elif status == "success":
                # Rule 2: Success after multiple failures
                if ip in failed_logins and len(failed_logins[ip]) >= 3:
                     detections.append({
                        "rule_name": "Successful Login After Brute Force",
                        "category": "Defense Evasion / Initial Access",
                        "severity": "High",
                        "explanation": "A successful authentication occurred after multiple failed attempts from the same source.",
                        "evidence": json.dumps({"source_ip": ip, "failed_attempts": len(failed_logins[ip])}),
                        "events": failed_logins[ip][-3:] + [event]
                    })
                # reset for IP on success
                failed_logins[ip] = []
                
        # Rule 3: Suspicious network ports
        port = event.get('port')
        if port in [4444, 31337, 1337]:
            detections.append({
                "rule_name": "Suspicious Known Bad Port",
                "category": "Command and Control",
                "severity": "High",
                "explanation": f"Connection on suspicious port {port} detected.",
                "evidence": json.dumps({"port": port, "ip": ip}),
                "events": [event]
            })
            
        # Rule 4: Privileged Access
        if "sudo" in action.lower() or "admin" in action.lower() or "root" in msg.lower():
            if status == "success":
                detections.append({
                    "rule_name": "Privileged Account Activity",
                    "category": "Privilege Escalation",
                    "severity": "Low",
                    "explanation": "Successful privileged resource access or escalation detected.",
                    "evidence": json.dumps({"action": action}),
                    "events": [event]
                })

    return detections
