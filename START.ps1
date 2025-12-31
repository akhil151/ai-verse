# ========================================
# START NIVESH.AI - COMPLETE SYSTEM
# ========================================

Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host "  NIVESH.AI - AI FUNDING CO-FOUNDER" -ForegroundColor Green
Write-Host "  Starting Backend and Frontend..." -ForegroundColor Yellow
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host ""

# Start Backend in new window
Write-Host "[1/2] Starting Backend (Python 3.10 - Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '========================================' -ForegroundColor Green
Write-Host '  NIVESH.AI BACKEND SERVER' -ForegroundColor Green
Write-Host '  Port: 8000' -ForegroundColor Yellow
Write-Host '  Python: 3.10' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
Set-Location 'c:\ai-verse\startup-rag\backend'
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"@

Write-Host "   Backend starting in new window..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host ""
Write-Host "[2/2] Starting Frontend (React + Vite - Port 5001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '========================================' -ForegroundColor Blue
Write-Host '  NIVESH.AI FRONTEND' -ForegroundColor Blue
Write-Host '  Port: 5001' -ForegroundColor Yellow
Write-Host '  Framework: React 19 + Vite 7' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Blue
Write-Host ''
Set-Location 'c:\ai-verse'
npm run dev:client
"@

Write-Host "   Frontend starting in new window..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Summary
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host "  SERVERS STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  " -ForegroundColor White -NoNewline; Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host "  Frontend: " -ForegroundColor White -NoNewline; Write-Host "http://localhost:5001" -ForegroundColor Cyan
Write-Host "  Health:   " -ForegroundColor White -NoNewline; Write-Host "http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Check the new windows for server logs." -ForegroundColor Gray
Write-Host "  Press Ctrl+C in each window to stop servers." -ForegroundColor Gray
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
