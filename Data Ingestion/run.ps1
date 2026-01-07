# PowerShell startup script for Startup Funding Intelligence System
# This script sets the GROQ_API_KEY and runs the application

# Check if GROQ_API_KEY is set
if (-not $env:GROQ_API_KEY) {
    Write-Host "ERROR: GROQ_API_KEY environment variable not set" -ForegroundColor Red
    Write-Host "Please set it with: `$env:GROQ_API_KEY = 'your_key_here'" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Startup Funding Intelligence System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

python app.py


