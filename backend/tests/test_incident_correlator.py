import pytest
from app.services.incident_correlator import correlate_incidents

def test_incident_correlator():
    detections = [
        {"rule_name": "Brute Force", "description": "Multiple fails", "severity": "High", "evidence": '{"source_ip": "10.0.0.1"}', "events": [{"timestamp": "2024-01-01T00:00:00Z", "source_ip": "10.0.0.1", "action": "login", "status": "failed"}]},
    ]
    incidents = correlate_incidents(detections)
    assert len(incidents) == 1
    assert incidents[0]["source_ip"] == '10.0.0.1'
