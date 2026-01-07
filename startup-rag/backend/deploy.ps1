#!/usr/bin/env pwsh
# Simple deployment push script for backend
# Ensures clean push to main branch without secrets

Write-Host "🚀 Backend Deployment Push Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project root
$projectRoot = Split-Path -Parent $PSScriptRoot
$projectRoot = Split-Path -Parent $projectRoot
Set-Location $projectRoot

# Check current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "📍 Current branch: $currentBranch" -ForegroundColor Yellow

if ($currentBranch -ne "main") {
    Write-Host "⚠️  Warning: Not on main branch. Switching to main..." -ForegroundColor Yellow
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to switch to main branch" -ForegroundColor Red
        exit 1
    }
}

# Check for uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "📝 Uncommitted changes detected:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    
    $response = Read-Host "Do you want to commit these changes? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "📦 Staging backend files..." -ForegroundColor Cyan
        git add startup-rag/backend/
        
        $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "deploy: Update backend deployment configuration"
        }
        
        git commit -m "$commitMsg"
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Commit failed" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Changes committed" -ForegroundColor Green
    }
} else {
    Write-Host "✅ Working tree is clean" -ForegroundColor Green
}

# Pull latest changes
Write-Host ""
Write-Host "🔄 Pulling latest changes from origin/main..." -ForegroundColor Cyan
git pull origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Pull failed or has conflicts. Please resolve manually." -ForegroundColor Yellow
    exit 1
}

# Push to main
Write-Host ""
Write-Host "📤 Pushing to origin/main..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed. Check for:" -ForegroundColor Red
    Write-Host "   - Hardcoded secrets (API keys)" -ForegroundColor Red
    Write-Host "   - Branch protection rules" -ForegroundColor Red
    Write-Host "   - Network connectivity" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Backend successfully pushed to main branch!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Check Render dashboard for auto-deployment" -ForegroundColor White
Write-Host "   2. Monitor deployment logs" -ForegroundColor White
Write-Host "   3. Verify health endpoint: https://your-backend.onrender.com/health" -ForegroundColor White
Write-Host ""
