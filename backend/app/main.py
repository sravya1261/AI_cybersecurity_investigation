import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from .models.database import engine, Base
from .api import logs, incidents, investigation, reports, dashboard, sample_data

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Cybersecurity Incident Investigator API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router, prefix="/api/logs", tags=["Logs"])
app.include_router(incidents.router, prefix="/api/incidents", tags=["Incidents"])
app.include_router(investigation.router, prefix="/api/investigation", tags=["Investigation"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(sample_data.router, prefix="/api/sample-data", tags=["Sample Data"])

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Cybersecurity Backend is running."}

# Mount frontend build
frontend_path = os.path.join(os.path.dirname(__file__), "../../frontend/dist")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="API route not found")
        
    requested_file = os.path.join(frontend_path, full_path)
    if os.path.isfile(requested_file):
        return FileResponse(requested_file)
        
    index_file = os.path.join(frontend_path, "index.html")
    if os.path.isfile(index_file):
        return FileResponse(index_file)
        
    return {"detail": "Frontend build not found. Please run 'npm run build' in the frontend directory."}
