import subprocess
import sys
import os
import time

def start_backend():
    print("Starting FastAPI backend...")
    # Change directory to backend
    os.chdir("backend")
    # Start backend
    return subprocess.Popen([sys.executable, "-m", "uvicorn", "app.main:app", "--reload"], 
                            stdout=sys.stdout, stderr=sys.stderr)

def start_frontend():
    print("Starting React frontend...")
    # Change to frontend directory based on original path
    os.chdir("../frontend")
    # Determine the npm command based on OS
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    # Start frontend
    return subprocess.Popen([npm_cmd, "run", "dev"], 
                            stdout=sys.stdout, stderr=sys.stderr)

if __name__ == "__main__":
    original_cwd = os.getcwd()
    
    # Simple check to see if we are in the correct directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("Error: Must be run from the project root containing 'backend' and 'frontend' directories.")
        sys.exit(1)
        
    try:
        backend_process = start_backend()
        frontend_process = start_frontend()
        
        print("\n" + "="*50)
        print("Integration environment started successfully!")
        print("Backend running at: http://localhost:8000")
        print("Frontend running at: http://localhost:5173")
        print("Press Ctrl+C to stop both applications")
        print("="*50 + "\n")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\nShutting down services...")
        try:
            backend_process.terminate()
            frontend_process.terminate()
        except:
            pass
        print("Services stopped.")
        sys.exit(0)
