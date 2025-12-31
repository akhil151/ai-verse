# ⚡ QUICK DEPLOY REFERENCE - NIVESH.AI

**Use this for copy-paste during deployment!**

---

## 🔑 CREDENTIALS & URLS

### API Key:
```
AIzaSyDIinfJEfeZpkGTDAQ8CVrPn-nQ7qhlup0
```

### Repository:
```
https://github.com/akhil151/ai-verse
```

---

## 🖥️ BACKEND DEPLOYMENT (RENDER)

### New Web Service Settings:
```
Name: nivesh-ai-backend
Region: Singapore
Branch: main
Root Directory: startup-rag/backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: python start.py
```

### Environment Variables:
```
GEMINI_API_KEY=AIzaSyDIinfJEfeZpkGTDAQ8CVrPn-nQ7qhlup0
GEMINI_MODEL=gemini-2.5-flash
PYTHON_VERSION=3.11.0
ALLOWED_ORIGINS=[LEAVE BLANK - UPDATE AFTER FRONTEND DEPLOYED]
```

### Test Endpoints:
```bash
# Health check
https://nivesh-ai-backend.onrender.com/health

# AI test
https://nivesh-ai-backend.onrender.com/ai/test
```

**✅ Backend URL to copy:** `_________________________________`

---

## 🌐 FRONTEND DEPLOYMENT (VERCEL)

### Import Project Settings:
```
Repository: akhil151/ai-verse
Framework: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Environment Variable:
```
VITE_API_URL=[YOUR_BACKEND_URL_FROM_RENDER]
```

**Example:**
```
VITE_API_URL=https://nivesh-ai-backend.onrender.com
```

**✅ Frontend URL:** `_________________________________`

---

## 🔄 UPDATE BACKEND CORS

**After frontend deployed:**

1. Go to Render → nivesh-ai-backend → Environment
2. Update `ALLOWED_ORIGINS` to:
```
ALLOWED_ORIGINS=https://[YOUR_VERCEL_URL]
```

**Example:**
```
ALLOWED_ORIGINS=https://nivesh-ai.vercel.app
```

3. Save → Wait 30 seconds for redeploy

---

## ✅ TESTING CHECKLIST

### Backend Tests:
- [ ] `/health` returns 200 OK
- [ ] `/` shows API info
- [ ] `/ai/test` generates dynamic response

### Frontend Tests:
- [ ] Onboarding form works
- [ ] Type "Hi" → instant response (no API call)
- [ ] Type "What investors?" → AI generates advice
- [ ] Readiness score appears in right panel
- [ ] Ask same question twice → different responses

---

## 🚨 COMMON ISSUES

### CORS Error:
```
Update ALLOWED_ORIGINS in Render with exact Vercel URL (no trailing slash)
```

### 503 Error:
```
Backend is sleeping. Visit /health endpoint to wake it up.
```

### No AI Response:
```
Check GEMINI_API_KEY in Render environment variables
```

---

## 🎯 DEMO COMMANDS

### Wake Backend Before Demo:
```bash
curl https://nivesh-ai-backend.onrender.com/health
```

### Test Full Flow:
```bash
# 1. Health check
curl https://nivesh-ai-backend.onrender.com/health

# 2. AI test
curl -X POST https://nivesh-ai-backend.onrender.com/ai/test \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'
```

---

## 📋 LOCAL DEVELOPMENT

### Backend:
```powershell
cd C:\Build-It\startup-rag\backend
$env:PYTHONPATH="C:\Build-It\startup-rag\backend"
& "C:\Program Files\Python313\python.exe" -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend:
```powershell
cd C:\Build-It
npm run dev:client
```

### Both (Single Command):
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Build-It\startup-rag\backend; `$env:PYTHONPATH='C:\Build-It\startup-rag\backend'; & 'C:\Program Files\Python313\python.exe' -m uvicorn app.main:app --host 0.0.0.0 --port 8000"; Start-Sleep -Seconds 3; cd C:\Build-It; npm run dev:client
```

---

## 🎬 2-MINUTE DEMO SCRIPT

1. **Introduction (15s):** "AI-powered funding advisor for Indian startups"
2. **Onboarding (30s):** Fill form → Click Start Journey
3. **AI Demo (45s):** Ask "What investors?" → Show readiness score
4. **Dynamic Test (30s):** Ask again → Show different response

**Total:** 2 minutes perfect demo

---

**⏱️ Deployment Time:** 15-20 minutes total  
**💰 Cost:** $0 (free tiers)  
**📚 Full Guide:** See STEP_BY_STEP_DEPLOYMENT.md
