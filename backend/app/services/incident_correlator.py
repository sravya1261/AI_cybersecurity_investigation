from typing import List, Dict, Any
import json
from datetime import timedelta

def correlate_incidents(detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Group related detections into incidents."""
    incidents = []
    
    # Simple correlation by source_ip
    grouped = {}
    
    for det in detections:
        ev = json.loads(det['evidence'])
        ip = ev.get('source_ip') or ev.get('ip') or 'unknown'
        
        if ip not in grouped:
            grouped[ip] = []
        grouped[ip].append(det)
        
    for ip, dets in grouped.items():
        if not dets:
            continue
            
        # Determine overall category and name based on highest severity detection
        # Simple for now: just combine
        
        all_events = []
        for d in dets:
            if 'events' in d:
                all_events.extend(d['events'])
                
        # Deduplicate events
        unique_events = []
        seen = set()
        for e in all_events:
            # We don't have IDs yet, so hash representation
            repr_str = f"{e.get('timestamp')}_{e.get('source_ip')}_{e.get('action')}"
            if repr_str not in seen:
                seen.add(repr_str)
                unique_events.append(e)
                
        # Get times
        try:
            times = [e.get('timestamp') for e in unique_events if e.get('timestamp')]
            if times:
                start_time = min(times)
                end_time = max(times)
            else:
                start_time = None
                end_time = None
        except:
            start_time = None
            end_time = None
            
        incident_type = dets[-1]['rule_name'] # Just take last one as type
        
        incidents.append({
            "incident_type": incident_type,
            "source_ip": ip if ip != 'unknown' else None,
            "affected_user": next((e.get('username') for e in unique_events if e.get('username')), None),
            "start_time": start_time,
            "end_time": end_time,
            "detections": dets,
            "events": unique_events
        })
        
    return incidents
