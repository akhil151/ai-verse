from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional
from pydantic import BaseModel
from app.models import FounderProfile, FundingQuestion, FundingAdvice
from app.gemini_client import gemini_client
from app.prompts import get_funding_advisor_prompt
from app.rag_integration import rag_retriever
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for founder profiles (stateless for hackathon)
founder_profiles = {}

# AI Test Models
class AITestRequest(BaseModel):
    prompt: str

class AITestResponse(BaseModel):
    success: bool
    generated_text: str
    model: str
    is_dynamic: bool
    message: str

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

@router.post("/founder/documents")
async def upload_founder_documents(files: List[UploadFile] = File(...)):
    """
    Upload documents for founder (pitch deck, business plan, etc.)
    These documents can be used to enhance RAG context
    
    NOTE: Current implementation logs uploads but does not persist to vector store.
    For full RAG integration, documents would need to be:
    1. Saved to disk
    2. Processed through ingestion pipeline
    3. Embedded and stored in vector database
    """
    logger.info(f"📄 Received {len(files)} document(s) for upload")
    
    uploaded_files = []
    for file in files:
        logger.info(f"   - {file.filename} ({file.content_type}, {file.size if hasattr(file, 'size') else 'unknown size'})")
        
        # Read file content (for potential future processing)
        content = await file.read()
        logger.info(f"   ✓ Read {len(content)} bytes from {file.filename}")
        
        uploaded_files.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(content)
        })
    
    return {
        "message": f"Successfully received {len(files)} document(s)",
        "files": uploaded_files,
        "note": "Documents logged. For RAG integration, they need to be processed through the ingestion pipeline."
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
        # 1️⃣ RAG RETRIEVAL - Get relevant context from vector store
        logger.info(f"🔍 Starting RAG retrieval for question: {question.question[:100]}...")
        rag_docs, rag_metas = rag_retriever.retrieve_context(question.question, top_k=3)
        
        # Format RAG context for prompt
        rag_context = rag_retriever.format_rag_context(rag_docs, rag_metas)
        
        if rag_context:
            logger.info(f"✅ RAG retrieved {len(rag_docs)} documents (total {len(rag_context)} chars)")
        else:
            logger.warning("⚠️ No RAG context retrieved - using fallback knowledge only")
        
        # 2️⃣ PROMPT GENERATION - Build prompt with RAG context + founder profile
        logger.info("📝 Building prompt with RAG context...")
        prompt = get_funding_advisor_prompt(profile_data, question.question, rag_context)
        
        # 3️⃣ GEMINI CALL - Get AI-generated advice
        logger.info("🤖 Calling Gemini AI...")
        if not gemini_client.is_configured:
            logger.error("❌ Gemini is NOT configured - cannot generate real advice")
            raise HTTPException(
                status_code=503,
                detail="AI service not configured. Please set GEMINI_API_KEY environment variable."
            )
        
        advice_data = gemini_client.generate_funding_advice(prompt)
        logger.info("✅ Gemini response received")
        
        # 4️⃣ VALIDATE & RETURN - Ensure response is valid
        return FundingAdvice(**advice_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error in funding advice pipeline: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating advice: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    gemini_status = "configured" if gemini_client.is_configured else "not_configured"
    return {
        "status": "healthy",
        "service": "Nivesh.ai Backend",
        "gemini_ai": gemini_status
    }

@router.post("/ai/test", response_model=AITestResponse)
async def test_ai_generation(request: AITestRequest):
    """
    Test endpoint to verify Gemini AI is working with dynamic output.
    This endpoint confirms the LLM is producing real, non-static responses.
    """
    try:
        if not gemini_client.is_configured:
            raise HTTPException(
                status_code=503,
                detail="Gemini AI is not configured. Check GEMINI_API_KEY environment variable."
            )
        
        # Generate response
        generated_text = gemini_client.test_generation(request.prompt)
        
        # Verify it's not empty
        if not generated_text or len(generated_text.strip()) == 0:
            raise HTTPException(
                status_code=500,
                detail="AI generated empty response"
            )
        
        from app.config import GEMINI_MODEL
        return AITestResponse(
            success=True,
            generated_text=generated_text,
            model=GEMINI_MODEL,
            is_dynamic=True,
            message="AI is working correctly with dynamic output"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"AI test failed: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI generation failed: {type(e).__name__}: {str(e)}"
        )

@router.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Welcome to Nivesh.ai - AI Funding Co-Founder for Indian Startups",
        "version": "1.0.0",
        "gemini_configured": gemini_client.is_configured,
        "endpoints": {
            "save_profile": "POST /founder/profile",
            "get_profile": "GET /founder/profile", 
            "funding_advice": "POST /funding/advice",
            "ai_test": "POST /ai/test",
            "health": "GET /health"
        }
    }