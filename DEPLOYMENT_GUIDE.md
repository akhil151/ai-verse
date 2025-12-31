# Nivesh.ai Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- ✅ Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- ✅ Vercel account for frontend
- ✅ Render account for backend

---

## 🎯 Backend Deployment (Render)

### Step 1: Prepare Backend
```bash
cd startup-rag/backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Step 2: Deploy to Render
1. **Create New Web Service** on Render
2. **Connect your repository**
3. **Configure settings:**
   - **Name:** nivesh-ai-backend
   - **Region:** Oregon (or closest to you)
   - **Branch:** main
   - **Root Directory:** `startup-rag/backend`
   - **Runtime:** Python 3.11
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python start.py` OR `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables:**
   - `GEMINI_API_KEY`: Your Gemini API key
   - `PORT`: 10000 (automatically set by Render)
   - `ALLOWED_ORIGINS`: Your Vercel domain (e.g., `https://yourapp.vercel.app`)

5. **Deploy** and wait for build to complete

6. **Verify:** Visit `https://your-backend.onrender.com/health`
   - Should return: `{"status": "healthy", "service": "Nivesh.ai Backend"}`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API URL for Production
**Before deploying**, update [client/src/lib/api.ts](client/src/lib/api.ts):

```typescript
const API_BASE_URL = typeof window !== 'undefined' 
  ? import.meta.env.VITE_API_URL || 'http://localhost:8000'
  : 'http://localhost:8000';
```

### Step 2: Deploy to Vercel
1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy from root directory:**
   ```bash
   vercel
   ```

3. **Or use Vercel Dashboard:**
   - Import your Git repository
   - Vercel auto-detects the configuration from `vercel.json`

4. **Add Environment Variable:**
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://nivesh-ai-backend.onrender.com`)

5. **Deploy** and wait for build

6. **Verify:** Visit your Vercel URL
   - Homepage should load
   - Check browser console for any errors

---

## ✅ Post-Deployment Verification

### Backend Health Check
```bash
curl https://your-backend.onrender.com/health
```
Expected response:
```json
{
  "status": "healthy",
  "service": "Nivesh.ai Backend"
}
```

### Frontend-Backend Connection
1. Visit your frontend URL
2. Navigate to `/onboarding`
3. Fill out the form and submit
4. Check browser Network tab - API calls should succeed (200 OK)
5. Navigate to `/dashboard` and ask a funding question

### Common Issues

#### ❌ CORS Errors
**Solution:** Add your Vercel domain to `ALLOWED_ORIGINS` in Render environment variables:
```
https://yourapp.vercel.app,https://yourapp-*.vercel.app
```

#### ❌ 404 on API Calls
**Solution:** Verify `VITE_API_URL` in Vercel environment variables matches your Render backend URL

#### ❌ Backend crashes on startup
**Solution:** Check Render logs. Likely missing `GEMINI_API_KEY` environment variable

---

## 🎨 Production Optimizations (Already Applied)

✅ PORT environment variable support (Render requirement)  
✅ CORS properly configured for production  
✅ Error logging instead of print statements  
✅ Demo mode fallback when API key is missing  
✅ Health check endpoint for monitoring  
✅ Proper uvicorn configuration with standard features  

---

## 🔐 Security Notes

- ⚠️ Never commit `.env` files with real API keys
- ✅ Always use environment variables for secrets
- ✅ CORS is configured to allow specific origins in production
- ✅ Error messages don't expose internal details

---

## 📊 Monitoring

### Render Dashboard
- View logs: Real-time application logs
- Metrics: CPU, memory, request latency
- Health checks: Automatic monitoring of `/health` endpoint

### Vercel Dashboard
- Deployments: Build logs and status
- Analytics: Page views and performance
- Function logs: Serverless function execution logs

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Push to main branch** → Automatic deployment
- **Pull requests** → Preview deployments (Vercel)

---

## 🆘 Support & Debugging

### Backend Logs (Render)
```bash
# View in Render dashboard or use CLI
render logs -s your-service-name
```

### Frontend Logs (Vercel)
```bash
# View in Vercel dashboard or use CLI
vercel logs your-deployment-url
```

### Local Testing
```bash
# Backend
cd startup-rag/backend
python start.py

# Frontend (separate terminal)
npm run dev
```

---

## 🎯 Next Steps After Deployment

1. **Test all user flows** on production
2. **Monitor logs** for first 24 hours
3. **Set up domain** (optional, both platforms support custom domains)
4. **Configure alerts** in Render/Vercel dashboards
5. **Integrate RAG pipeline** (as per roadmap)

---

## 📝 Deployment Checklist

### Backend (Render)
- [ ] `.env` file created with GEMINI_API_KEY
- [ ] Service created on Render
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Health check passing
- [ ] API endpoints responding

### Frontend (Vercel)
- [ ] `VITE_API_URL` environment variable set
- [ ] Build successful
- [ ] Deployment accessible
- [ ] API calls working (check Network tab)
- [ ] No CORS errors

### Final Verification
- [ ] Complete user flow: Onboarding → Dashboard → Ask Question
- [ ] All API responses successful
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

**Status:** ✅ DEPLOYMENT-READY

You are now ready to deploy Nivesh.ai to production!
