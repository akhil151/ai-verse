#!/bin/bash
# Simple deployment push script for backend
# Ensures clean push to main branch without secrets

echo "🚀 Backend Deployment Push Script"
echo "================================="
echo ""

# Navigate to project root
cd "$(dirname "$0")/../.."

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $current_branch"

if [ "$current_branch" != "main" ]; then
    echo "⚠️  Warning: Not on main branch. Switching to main..."
    git checkout main
    if [ $? -ne 0 ]; then
        echo "❌ Failed to switch to main branch"
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 Uncommitted changes detected:"
    git status --short
    echo ""
    
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Staging backend files..."
        git add startup-rag/backend/
        
        read -p "Enter commit message (or press Enter for default): " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="deploy: Update backend deployment configuration"
        fi
        
        git commit -m "$commit_msg"
        if [ $? -ne 0 ]; then
            echo "❌ Commit failed"
            exit 1
        fi
        echo "✅ Changes committed"
    fi
else
    echo "✅ Working tree is clean"
fi

# Pull latest changes
echo ""
echo "🔄 Pulling latest changes from origin/main..."
git pull origin main
if [ $? -ne 0 ]; then
    echo "⚠️  Pull failed or has conflicts. Please resolve manually."
    exit 1
fi

# Push to main
echo ""
echo "📤 Pushing to origin/main..."
git push origin main
if [ $? -ne 0 ]; then
    echo "❌ Push failed. Check for:"
    echo "   - Hardcoded secrets (API keys)"
    echo "   - Branch protection rules"
    echo "   - Network connectivity"
    exit 1
fi

echo ""
echo "✅ Backend successfully pushed to main branch!"
echo ""
echo "🎯 Next Steps:"
echo "   1. Check Render dashboard for auto-deployment"
echo "   2. Monitor deployment logs"
echo "   3. Verify health endpoint: https://your-backend.onrender.com/health"
echo ""
