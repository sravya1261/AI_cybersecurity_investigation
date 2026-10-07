from typing import List, Dict, Any

def generate_timeline(events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Format events into a chronological timeline format."""
    
    # Sort by timestamp
    try:
        sorted_events = sorted(events, key=lambda x: x.get('timestamp'))
    except:
        sorted_events = events
        
    timeline = []
    
    for event in sorted_events:
        item = {
            "time": str(event.get('timestamp', 'Unknown Time')),
            "content": f"{event.get('action', 'Activity').capitalize()} - {event.get('status', 'Unknown').capitalize()}",
            "description": event.get('message', ''),
            "source_ip": event.get('source_ip', 'Unknown IP')
        }
        
        status = event.get('status', '').lower()
        if status in ['failed', 'denied']:
            item['type'] = 'danger'
        elif status in ['success', 'allow']:
            item['type'] = 'success'
        else:
            item['type'] = 'info'
            
        timeline.append(item)
        
    return timeline
