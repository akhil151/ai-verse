# Backend Deployment Guide

## Quick Deploy to Main Branch

### Option 1: Automated Script (Recommended)

#### Windows (PowerShell)
```powershell
cd startup-rag/backend
.\deploy.ps1
```

#### Linux/Mac (Bash)
```bash
cd startup-rag/backend
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Git Commands

```bash
# 1. Navigate to project root
cd path/to/ai-verse

# 2. Ensure you're on main branch
git checkout main

# 3. Check status
git status

# 4. Stage backend changes (if any)
git add startup-rag/backend/

# 5. Commit changes
git commit -m "deploy: Update backend deployment configuration"

# 6. Pull latest
git pull origin main

# 7. Push to main
git push origin main
```

## Current Status

✅ **All backend files are already committed and pushed to main**

- 37 backend files tracked in git
- Latest commit: `786d59d` - CORS fix applied
- Remote: `origin/main` is up to date
- Working tree: Clean

## Deployment Architecture

```
Local (main) ──push──> GitHub (main) ──auto-deploy──> Render
```

### Automatic Deployment
- Render is connected to your GitHub repository
- Any push to `main` branch triggers automatic deployment
- Monitor: https://dashboard.render.com

## Troubleshooting

### Push Blocked by Secret Scanning
If GitHub blocks push due to hardcoded secrets:

1. **Never commit API keys directly**
2. Use environment variables in code:
   ```python
   GROQ_API_KEY = os.getenv("GROQ_API_KEY")
   ```
3. Set secrets in Render dashboard (not in code)
4. If secrets exist in old commits:
   ```bash
   # Remove from history (dangerous - use with caution)
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/file' \
     --prune-empty --tag-name-filter cat -- --all
   ```

### Branch Divergence
If local and remote have diverged:

```bash
# Option A: Reset to remote (lose local changes)
git fetch origin
git reset --hard origin/main

# Option B: Rebase (preserve local changes)
git pull --rebase origin main
```

### Merge Conflicts
If pull creates conflicts:

```bash
git status              # See conflicted files
# Edit files manually to resolve
git add <resolved-files>
git commit -m "resolve: Merge conflicts"
git push origin main
```

## Pre-Push Checklist

- [ ] No hardcoded API keys in code
- [ ] `.env.example` updated (no real values)
- [ ] `requirements.txt` up to date
- [ ] All tests pass
- [ ] No syntax errors
- [ ] `start.py` configured correctly
- [ ] `app/main.py` CORS configured
- [ ] Environment variables documented

## Post-Push Verification

### 1. Check Render Deployment
```
https://dashboard.render.com/web/YOUR_SERVICE_ID
```

### 2. Test Health Endpoint
```bash
curl https://your-backend.onrender.com/health
```

Expected Response:
```json
{
  "status": "healthy",
  "service": "Nivesh.ai Backend"
}
```

### 3. Check Logs
```bash
# In Render dashboard: Logs tab
# Look for:
✅ "Starting Nivesh.ai Backend on port 8000..."
✅ "Application startup complete"
❌ Any Python errors or import failures
```

### 4. Test CORS
```bash
curl -X OPTIONS https://your-backend.onrender.com/funding/advice \
  -H "Origin: https://verse-rho.vercel.app" \
  -v
```

Expected: `200 OK` with CORS headers

## Environment Variables (Render)

Set these in Render Dashboard:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here
PORT=8000  # Auto-set by Render

# Optional
GEMINI_API_KEY=your_gemini_key_here
ALLOWED_ORIGINS=https://verse-rho.vercel.app,https://your-frontend.vercel.app
```

## Backend File Structure

```
startup-rag/backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app + CORS
│   ├── routes.py                  # Main endpoints
│   ├── rag_routes.py             # RAG features
│   ├── market_routes.py          # Market analysis
│   ├── financial_narrative_routes.py
│   ├── config.py                 # Environment config
│   ├── groq_client.py            # Groq AI client
│   ├── gemini_client.py          # Gemini client
│   ├── models.py                 # Pydantic models
│   └── ...
├── start.py                      # Production entry point
├── requirements.txt              # Python dependencies
├── Procfile                      # Render config
├── .python-version              # Python 3.11.0
├── deploy.ps1                   # This deployment script
├── deploy.sh                    # Linux/Mac version
└── DEPLOY.md                    # This file
```

## Support

If deployment fails:
1. Check Render logs for error details
2. Verify environment variables are set
3. Ensure `start.py` is configured as entry point in Render
4. Check GitHub Actions (if enabled)

## One-Liner Deploy

```bash
# From project root
git add startup-rag/backend/ && git commit -m "deploy: Backend update" && git push origin main
```

---

**Last Updated:** January 7, 2026  
**Backend Version:** 1.0.0  
**Status:** ✅ Production Ready
