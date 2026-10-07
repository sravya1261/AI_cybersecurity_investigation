import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_or_docs():
    response = client.get("/docs") # Testing docs route since root might not exist
    assert response.status_code == 200
