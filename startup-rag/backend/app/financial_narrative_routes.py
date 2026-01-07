"""
Financial Narrative API Routes - ISOLATED MODULE
Endpoint: POST /financial/narrative

This router is completely independent from existing features.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import logging

from app.financial_narrative import financial_narrative_generator

logger = logging.getLogger(__name__)

# Create isolated router with /financial prefix
financial_router = APIRouter(prefix="/financial", tags=["financial-narrative"])


class FinancialInput(BaseModel):
    """Financial metrics input model"""
    monthly_burn_rate: float = Field(..., ge=0, description="Monthly burn rate in rupees")
    runway_months: float = Field(..., ge=0, description="Runway in months")
    monthly_revenue: Optional[float] = Field(0, ge=0, description="Monthly revenue in rupees")
    customer_acquisition_cost: Optional[float] = Field(0, ge=0, description="CAC in rupees")
    lifetime_value: Optional[float] = Field(0, ge=0, description="LTV in rupees")


class FinancialNarrative(BaseModel):
    """Financial narrative response model"""
    burn_rate_explanation: str
    runway_interpretation: str
    unit_economics_insight: Optional[str] = None
    summary: str
    disclaimer: str
    success: bool = True


@financial_router.post("/narrative", response_model=FinancialNarrative)
async def generate_financial_narrative(financial_input: FinancialInput):
    """
    Generate explanatory narrative for financial metrics.
    
    **IMPORTANT**: This is NOT financial advice. This endpoint provides
    explanatory narratives to help understand financial metrics.
    
    **Isolation**: This feature does not affect or use:
    - Funding Advisor responses
    - RAG retrieval
    - Readiness scoring
    - Market analysis
    
    Args:
        financial_input: Financial metrics
        
    Returns:
        FinancialNarrative with explanations and mandatory disclaimer
        
    Raises:
        HTTPException: If generation fails
    """
    try:
        logger.info(f"📊 Financial narrative request: burn_rate={financial_input.monthly_burn_rate}, runway={financial_input.runway_months}")
        
        # Validate data
        if not financial_narrative_generator.validate_financial_data(financial_input.dict()):
            raise HTTPException(
                status_code=400,
                detail="Invalid financial data. burn_rate and runway are required."
            )
        
        # Generate narrative using isolated generator
        narrative = financial_narrative_generator.generate_narrative(
            financial_input.dict()
        )
        
        logger.info("✅ Financial narrative generated successfully")
        
        return FinancialNarrative(
            burn_rate_explanation=narrative.get("burn_rate_explanation", ""),
            runway_interpretation=narrative.get("runway_interpretation", ""),
            unit_economics_insight=narrative.get("unit_economics_insight"),
            summary=narrative.get("summary", ""),
            disclaimer=narrative["disclaimer"],
            success=True
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to generate narrative: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate financial narrative: {str(e)}"
        )


@financial_router.get("/health")
async def financial_health():
    """Health check for financial narrative feature"""
    return {
        "status": "healthy",
        "feature": "Financial Narrative Generator",
        "isolated": True,
        "ai_provider": "Groq" if financial_narrative_generator.client.is_configured else "not_configured"
    }
