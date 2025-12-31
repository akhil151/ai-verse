from fastapi import APIRouter, HTTPException
from app.models import FounderProfile, FundingQuestion, FundingAdvice
from app.gemini_client import gemini_client
from app.prompts import get_funding_advisor_prompt

router = APIRouter()

# In-memory storage for founder profiles (stateless for hackathon)
founder_profiles = {}

@router.post("/founder/profile")
async def save_founder_profile(profile: FounderProfile):
    """Save founder profile for context in funding advice"""
    # Use a simple key for stateless storage
    profile_id = "default_founder"
    founder_profiles[profile_id] = profile.dict()
    
    return {
        "message": "Profile saved successfully",
        "profile_id": profile_id,
        "profile": profile.dict()
    }

@router.get("/founder/profile")
async def get_founder_profile():
    """Get current founder profile"""
    profile_id = "default_founder"
    if profile_id not in founder_profiles:
        raise HTTPException(status_code=404, detail="No founder profile found")
    
    return {
        "profile_id": profile_id,
        "profile": founder_profiles[profile_id]
    }

@router.post("/funding/advice", response_model=FundingAdvice)
async def get_funding_advice(question: FundingQuestion):
    """Get AI-powered funding advice based on founder context"""
    
    # Get founder context (use default if exists)
    profile_id = "default_founder"
    profile_data = founder_profiles.get(profile_id, {})
    
    if not profile_data:
        raise HTTPException(
            status_code=400, 
            detail="Please save your founder profile first using /founder/profile"
        )
    
    try:
        # Generate prompt with context
        prompt = get_funding_advisor_prompt(profile_data, question.question)
        
        # Get advice from Gemini
        advice_data = gemini_client.generate_funding_advice(prompt)
        
        # Validate and return structured response
        return FundingAdvice(**advice_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating advice: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Nivesh.ai Backend"}

@router.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Nivesh.ai - AI Funding Co-Founder for Indian Startups",
        "version": "1.0.0",
        "endpoints": {
            "save_profile": "POST /founder/profile",
            "get_profile": "GET /founder/profile", 
            "funding_advice": "POST /funding/advice",
            "health": "GET /health"
        }
    }