import pytest
from app.services.threat_detector import detect_threats

def test_detect_threats_brute_force():
    events = [
        {"timestamp": "2024-01-01T00:00:00Z", "source_ip": "10.0.0.1", "action": "login", "status": "failed"},
        {"timestamp": "2024-01-01T00:00:01Z", "source_ip": "10.0.0.1", "action": "login", "status": "failed"},
        {"timestamp": "2024-01-01T00:00:02Z", "source_ip": "10.0.0.1", "action": "login", "status": "failed"},
        {"timestamp": "2024-01-01T00:00:03Z", "source_ip": "10.0.0.1", "action": "login", "status": "failed"}
    ]
    detections = detect_threats(events)
    assert len(detections) > 0
    assert "Multiple Failed Logins" in [d['rule_name'] for d in detections]
