"""
Market Size API Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .market_analyzer import MarketAnalyzer

market_router = APIRouter(prefix="/api", tags=["market"])

# Initialize market analyzer
market_analyzer = MarketAnalyzer()

class MarketRequest(BaseModel):
    query: str
    language: Optional[str] = "en"

class MarketResponse(BaseModel):
    tam: str
    sam: str
    som: str
    growth: str
    india_vs_global: str
    assumptions: str
    narration: str
    sources: list

@market_router.post("/market-size", response_model=MarketResponse)
async def analyze_market_size(request: MarketRequest):
    """
    Analyze market size and opportunity for startup ideas
    """
    try:
        # Validate input
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        # Check if query is market-related
        if not market_analyzer.detect_market_intent(request.query):
            # Add market context to query
            enhanced_query = f"Market size and opportunity analysis for: {request.query}"
        else:
            enhanced_query = request.query
        
        # Analyze market
        result = market_analyzer.analyze_market(enhanced_query, request.language)
        
        return MarketResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@market_router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Market Analyzer"}