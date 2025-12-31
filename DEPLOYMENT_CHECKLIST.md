# 🚀 DEPLOYMENT CHECKLIST - Nivesh.ai

## Pre-Deployment Verification ✅

- [x] Backend tested locally
- [x] Frontend tested locally
- [x] AI producing real responses
- [x] Integration verified
- [x] Deployment configs created
- [x] Documentation complete

---

## BACKEND DEPLOYMENT (Render)

### Setup (10-15 minutes)
- [ ] 1. Go to https://render.com and sign up
- [ ] 2. Click "New +" → "Web Service"
- [ ] 3. Connect GitHub repository
- [ ] 4. Select `Build-It` repo

### Configuration
- [ ] 5. Set Name: `nivesh-ai-backend`
- [ ] 6. Set Root Directory: `startup-rag/backend`
- [ ] 7. Set Build Command: `pip install -r requirements.txt`
- [ ] 8. Set Start Command: `python start.py`
- [ ] 9. Select Instance Type: Free (testing) or Starter ($7/mo)

### Environment Variables
- [ ] 10. Add `GEMINI_API_KEY` = `AIzaSyDIinfJEfeZpkGTDAQ8CVrPn-nQ7qhlup0`
- [ ] 11. Add `ALLOWED_ORIGINS` = `*` (update later)

### Deploy & Verify
- [ ] 12. Click "Create Web Service"
- [ ] 13. Wait for build (3-5 min)
- [ ] 14. Copy backend URL: `https://______.onrender.com`
- [ ] 15. Test: Visit `https://______.onrender.com/health`
- [ ] 16. Verify response: `{"status":"healthy","gemini_ai":"configured"}`

**Backend URL:** ___________________________

---

## FRONTEND DEPLOYMENT (Vercel)

### Setup (5-10 minutes)
- [ ] 17. Go to https://vercel.com and sign up
- [ ] 18. Click "Add New" → "Project"
- [ ] 19. Import `Build-It` repository
- [ ] 20. Vercel auto-detects Vite configuration

### Environment Variables
- [ ] 21. Go to Settings → Environment Variables
- [ ] 22. Add `VITE_API_URL` = Your backend URL from step 14
- [ ] 23. Apply to: Production, Preview, Development

### Deploy & Verify
- [ ] 24. Click "Deploy"
- [ ] 25. Wait for build (2-3 min)
- [ ] 26. Copy frontend URL: `https://______.vercel.app`
- [ ] 27. Test: Visit your frontend URL
- [ ] 28. Verify: Homepage loads without errors

**Frontend URL:** ___________________________

---

## POST-DEPLOYMENT

### Update CORS
- [ ] 29. Go back to Render → Your service → Environment
- [ ] 30. Update `ALLOWED_ORIGINS` to: `https://your-frontend.vercel.app`
- [ ] 31. Save (backend will auto-redeploy)

### Integration Test
- [ ] 32. Visit frontend URL
- [ ] 33. Click "Get Started"
- [ ] 34. Fill onboarding: MVP, Fintech, Bangalore, Seed
- [ ] 35. Submit and go to Dashboard
- [ ] 36. Ask: "What documents do I need for seed funding?"
- [ ] 37. Verify: AI response appears (should be unique)
- [ ] 38. Ask same question again
- [ ] 39. Verify: Response is DIFFERENT (dynamic AI confirmed)

### Monitor Logs
- [ ] 40. Render → Logs tab → Check for errors
- [ ] 41. Vercel → Deployments → Logs → Check for errors
- [ ] 42. Browser Console (F12) → Check for errors

### Final Verification
- [ ] 43. Test on mobile device
- [ ] 44. Test in incognito mode
- [ ] 45. Verify no CORS errors
- [ ] 46. Verify AI responses working
- [ ] 47. Verify error messages display properly
- [ ] 48. Share URL with team for testing

---

## Success Criteria ✅

### Must Pass:
- ✅ Backend health endpoint returns 200 OK
- ✅ Frontend homepage loads without errors
- ✅ User can complete onboarding flow
- ✅ AI generates funding advice
- ✅ AI responses are DIFFERENT each time (dynamic)
- ✅ No CORS errors in browser console
- ✅ No 404/500 errors in normal usage

### Optional (Future):
- ⚠️ MongoDB setup (required for RAG)
- ⚠️ User authentication
- ⚠️ Rate limiting
- ⚠️ Custom domain

---

## Troubleshooting

### Backend won't start:
- Check Render logs for errors
- Verify `GEMINI_API_KEY` is set
- Check Python version (should auto-detect 3.11)

### Frontend shows API errors:
- Verify `VITE_API_URL` is correct
- Check `ALLOWED_ORIGINS` in backend
- Look for CORS errors in console

### AI not responding:
- Check Render logs for Gemini errors
- Verify API key is correct
- Test `/ai/test` endpoint directly

### CORS errors:
- Update `ALLOWED_ORIGINS` in Render
- Include both `https://app.vercel.app` and `https://app-*.vercel.app`
- Redeploy backend after changes

---

## Contact & Support

**Documentation:**
- [FINAL_DEPLOYMENT_REPORT.md](FINAL_DEPLOYMENT_REPORT.md)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [GEMINI_FIX_REPORT.md](startup-rag/backend/GEMINI_FIX_REPORT.md)

**Render Docs:** https://render.com/docs  
**Vercel Docs:** https://vercel.com/docs  
**FastAPI Docs:** https://fastapi.tiangolo.com  
**Gemini API:** https://ai.google.dev

---

## Deployment Status

**Date:** December 31, 2025  
**Backend Status:** ⬜ Not Deployed | ✅ Deployed  
**Frontend Status:** ⬜ Not Deployed | ✅ Deployed  
**Integration Test:** ⬜ Not Tested | ✅ Passed  

**Deployed By:** _________________  
**Deployment Time:** _________________  
**Issues Found:** _________________

---

**Ready to deploy? Start with step 1 above! 🚀**
