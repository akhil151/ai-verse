import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Working directory safety check
current_dir = os.getcwd()
expected_dir_name = "backend"
if not current_dir.endswith(expected_dir_name):
    print("\n" + "="*70)
    print("⚠️  ERROR: Backend must be run from the 'backend' directory!")
    print("="*70)
    print(f"Current directory: {current_dir}")
    print(f"\n✅ Correct way to start:")
    print("   1. cd startup-rag/backend")
    print("   2. python -m uvicorn app.main:app --reload")
    print("\n   OR use: npm run dev:backend (from project root)")
    print("="*70 + "\n")
    sys.exit(1)

from app.routes import router
from app.rag_routes import rag_router
from app.market_routes import market_router
from app.financial_narrative_routes import financial_router
from app.multilingual_rag import ChatRequest, chat_multilingual

app = FastAPI(
    title="Nivesh.ai Backend",
    description="AI Funding Co-Founder for Indian Startups",
    version="1.0.0"
)

# Production-ready CORS configuration
# Note: FastAPI requires exact origin matches - wildcards like *.vercel.app don't work
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5000,http://localhost:5173,http://localhost:5001,https://verse-rho.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if os.getenv("ALLOWED_ORIGINS") else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(rag_router)
app.include_router(market_router)
app.include_router(financial_router)  # Financial Narrative Generator (isolated feature)

@app.post("/chat-multilingual")
async def chat_multilingual_endpoint(request: ChatRequest):
    return await chat_multilingual(request)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)