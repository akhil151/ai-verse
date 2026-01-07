# 🚀 Quick Deploy Command

## One-Line Deploy (From Project Root)

### Windows PowerShell
```powershell
cd startup-rag\backend ; .\deploy.ps1
```

### Bash/Linux/Mac
```bash
cd startup-rag/backend && chmod +x deploy.sh && ./deploy.sh
```

---

## Manual Push (If Script Doesn't Work)

```bash
# 1. Go to project root
cd c:\ai-verse\ai-verse\ai-verse

# 2. Add backend files
git add startup-rag/backend/

# 3. Commit
git commit -m "deploy: Backend update"

# 4. Push
git push origin main
```

---

## Status Check

```bash
git status                  # Check working tree
git log --oneline -5       # See recent commits
git remote -v              # Verify remote URL
```

---

## ✅ Current Status

- **Branch:** main
- **Remote:** origin/main (synced)
- **Latest Commit:** d8abca0 - Deployment scripts added
- **Backend Files:** All 40 files committed
- **Working Tree:** Clean
- **Ready to Deploy:** YES

---

## After Push

1. **Monitor Render:** https://dashboard.render.com
2. **Test Health:** `curl https://your-backend.onrender.com/health`
3. **Check Logs:** Render dashboard → Logs tab

---

## Emergency Rollback

```bash
git log --oneline -10           # Find commit to rollback to
git reset --hard <commit-hash>  # Rollback local
git push origin main --force    # Push rollback (use with caution!)
```

---

**Quick Help:** See [DEPLOY.md](DEPLOY.md) for full guide
