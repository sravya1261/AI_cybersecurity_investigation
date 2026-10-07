from typing import Dict, Any, List

def generate_fallback_summary(incident_metadata: Dict[str, Any], detections: List[Dict[str, Any]]) -> str:
    """Generate a deterministic fallback summary if no AI is configured."""
    incident_type = incident_metadata.get('incident_type', 'Unknown Activity')
    sev = incident_metadata.get('severity', 'Unknown')
    
    summary = f"Summary: The system detected {incident_type} activity with a severity of {sev}.\n\n"
    
    summary += "Detected Patterns:\n"
    for d in detections:
        summary += f"- {d.get('rule_name')}: {d.get('explanation')}\n"
        
    summary += "\nThis is a locally generated summary because no external AI provider is configured."
    return summary

def generate_fallback_recommended_actions(detections: List[Dict[str, Any]]) -> str:
    """Generate deterministic recommendations."""
    actions = []
    
    rule_names = [d.get("rule_name") for d in detections]
    
    if "Multiple Failed Logins" in rule_names:
        actions.append("- Reset user credentials.")
        actions.append("- Investigate whether the source IP is known to the organization.")
    if "Successful Login After Brute Force" in rule_names:
         actions.append("- CRITICAL: Ensure the account is isolated, as it appears compromised.")
         actions.append("- Revoke any active sessions for the involved account.")
    if "Suspicious Known Bad Port" in rule_names:
        actions.append("- Block the suspicious port at the firewall.")
        actions.append("- Scan the affected host for malware or C2 frameworks.")
    if "Privileged Account Activity" in rule_names:
        actions.append("- Audit the actions performed during the privileged session.")
    
    if not actions:
        actions.append("- Review the associated network logs for further context.")
        
    return "\n".join(actions)

def fallback_chat(query: str, incident_metadata: Dict[str, Any]) -> str:
    query = query.lower()
    
    if "what happened" in query:
        return f"This incident involved {incident_metadata.get('incident_type')} from IP {incident_metadata.get('source_ip')}."
    elif "why" in query and ("severity" in query or "high" in query):
        return f"The severity was ranked as {incident_metadata.get('severity')} based on the combination of detected rules and the volume of events."
    elif "evidence" in query:
        return "You can view the specific matched logs in the Evidence and Detections tabs."
    elif "summarize" in query:
         return f"Incident Summary: A threat categorized as {incident_metadata.get('incident_type')} was detected on the network."
    else:
        return "I am operating in fallback mode and can only answer predetermined queries about this incident. Try asking 'What happened?' or 'What is the evidence?'"
