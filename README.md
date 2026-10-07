# AI Cybersecurity Incident Investigator

"Generative AI powered security log analysis and incident investigation platform"

## Description
This is a final-year project designed as a complete cybersecurity incident investigation platform. It acts as an AI-powered assistant for security analysts. Users can upload security logs, which are automatically parsed, normalized, and analyzed using rule-based heuristics inspired by MITRE ATT&CK. Detected threats are correlated into Incidents, assigned a severity, and then passed to an AI Investigator (Generative AI) that provides summaries, recommends actions, and powers a chat interface.

## Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS, Recharts
*   **Backend:** FastAPI, Python, Pandas, SQLAlchemy
*   **Database:** SQLite
*   **AI Engine:** Deterministic Fallback Logic (default) / External LLM API ready

## Installation and Setup

### 1. Clone or Download Repository
Ensure you have the full project directory.

### 2. Backend Setup
1. Standard Python version 3.9+ is recommended.
2. Open terminal in the `backend` folder.
3. `python -m venv venv`
4. `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
5. `python -m pip install -r requirements.txt`

### 3. Frontend Setup
1. Open terminal in the `frontend` folder.
2. Ensure Node.js (v18+) is installed.
3. `npm install`

### 4. Running the Application
#### Option A: Running Separately
1. **Backend:** In the backend folder (with your venv activated), run:
   `uvicorn app.main:app --reload`
   Backend will run on `http://127.0.0.1:8000`
2. **Frontend:** In the frontend folder, run:
   `npm run dev`
   Frontend will output a localhost URL (e.g., `http://localhost:5173`) - open this in your browser.

#### Option B: How to Run the Integrated Application (Recommended)
Inside the project root directory, we have provided a unified startup script that launches both the FastAPI backend and React frontend concurrently.
Make sure you have installed requirements in `backend` and `npm install` in `frontend` first.
Run the integrated script from the root project folder:
```bash
python dev.py
```
This will start both applications simultaneously. When you are done, simply press `Ctrl+C` to terminate both processes safely.

## AI Configuration (Optional)
The system defaults to a "Fallback AI" deterministic generator so the app functions 100% locally without API key requirements for demonstration and educational purposes.
To use an external AI, set your API keys locally in the backend `.env` variables and update `backend/app/services/ai_investigator.py`.

## Demo Workflow
1. Start both servers.
2. Open the frontend and navigate to "Sample Data".
3. Click "Load & Analyze" on the Authentication Attack Demo.
4. Navigate to "Incidents" to see the newly generated incident.
5. Click "Investigate" to open the Incident Details.
6. Click "AI Investigator" to see the AI analysis and chat.
7. Click "Generate Report" from the incident details to output a final Markdown document.

## Folder Structure
- `/backend`: FastAPI Python server, logic, and SQLite DB.
- `/frontend`: React JS web application.
- `/documentation`: Academic project documentation templates.
- `/database`: SQLite database storage location.
