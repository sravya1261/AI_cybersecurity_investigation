from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..models import database
from .logs import upload_logs
from fastapi import UploadFile
import io
import csv

router = APIRouter()

DATASETS = {
    "auth_attack": {
        "name": "Authentication Attack Demo",
        "description": "Simulates a brute-force attack followed by a successful login."
    },
    "network_anomaly": {
        "name": "Network Anomaly Demo",
        "description": "Simulates connection attempts to suspicious ports."
    }
}

@router.get("/")
def get_sample_datasets():
    return [{"id": k, **v} for k, v in DATASETS.items()]

@router.post("/{dataset_id}/load")
async def load_sample_dataset(dataset_id: str, db: Session = Depends(database.get_db)):
    if dataset_id not in DATASETS:
        return {"error": "Dataset not found"}
        
    csv_data = []
    
    if dataset_id == "auth_attack":
        csv_data = [
            ["timestamp", "source_ip", "username", "action", "status"],
            ["2024-01-01T10:01:00Z", "192.168.1.50", "admin", "login", "failed"],
            ["2024-01-01T10:01:05Z", "192.168.1.50", "admin", "login", "failed"],
            ["2024-01-01T10:01:10Z", "192.168.1.50", "admin", "login", "failed"],
            ["2024-01-01T10:01:15Z", "192.168.1.50", "admin", "login", "failed"],
            ["2024-01-01T10:02:00Z", "192.168.1.50", "admin", "login", "success"],
            ["2024-01-01T10:02:15Z", "192.168.1.50", "admin", "sudo", "success"]
        ]
    elif dataset_id == "network_anomaly":
        csv_data = [
            ["timestamp", "source_ip", "destination_ip", "port", "action", "status"],
            ["2024-01-01T11:00:00Z", "10.0.0.5", "192.168.1.100", "80", "connect", "success"],
            ["2024-01-01T11:05:00Z", "10.0.0.5", "192.168.1.100", "4444", "connect", "success"],
        ]
        
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(csv_data)
    
    # Create an UploadFile mock
    file_bytes = output.getvalue().encode('utf-8')
    upload_file = UploadFile(filename=f"{dataset_id}.csv", file=io.BytesIO(file_bytes))
    
    # Run through the upload logic
    await upload_logs(upload_file, db)
    
    return {"message": f"Successfully loaded {DATASETS[dataset_id]['name']}"}
