"""Quick server test script"""
import uvicorn
import os
import sys

# Set working directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)
sys.path.insert(0, backend_dir)

print(f"Working directory: {os.getcwd()}")
print(f"Python path includes: {backend_dir}")

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
