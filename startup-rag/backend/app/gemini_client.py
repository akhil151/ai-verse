import google.generativeai as genai
import json
import logging
from app.config import GEMINI_API_KEY, GEMINI_MODEL

# Configure logging
logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model = None
        self.is_configured = False
        
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                self.model = genai.GenerativeModel(GEMINI_MODEL)
                self.is_configured = True
                logger.info(f"Gemini client initialized with model: {GEMINI_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {str(e)}")
                self.model = None
        else:
            logger.warning("Gemini API key not configured. Using demo mode.")
    
    def generate_funding_advice(self, prompt: str) -> dict:
        """Generate funding advice using Gemini AI"""
        if not self.is_configured:
            logger.warning("Gemini not configured, returning demo response")
            return self._get_demo_response()
            
        try:
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response
            response_text = response.text.strip()
            logger.debug(f"Gemini raw response length: {len(response_text)} chars")
            
            # Find JSON in response (handle markdown code blocks)
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "{" in response_text and "}" in response_text:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                json_text = response_text[json_start:json_end]
            else:
                json_text = response_text
            
            return json.loads(json_text)
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse Gemini JSON response: {str(e)}")
            return self._get_demo_response()
        except Exception as e:
            logger.error(f"Gemini API error: {type(e).__name__}: {str(e)}")
            return self._get_demo_response()
    
    def test_generation(self, prompt: str) -> str:
        """Simple test method for LLM verification"""
        if not self.is_configured:
            raise ValueError("Gemini API not configured. Check GEMINI_API_KEY environment variable.")
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Test generation failed: {type(e).__name__}: {str(e)}")
            raise
    
    def _get_demo_response(self) -> dict:
        """Demo response for hackathon when Gemini API is not available"""
        return {
            "readiness_score": 75,
            "recommended_path": "Seed Funding",
            "explanation": "Based on your MVP stage and sector, you're ready for seed funding. Focus on demonstrating product-market fit and early traction metrics. Indian fintech startups at MVP stage typically raise ₹50L-₹2Cr in seed rounds.",
            "checklist": [
                "Complete regulatory compliance (RBI guidelines for fintech)",
                "Prepare 18-month financial projections with unit economics",
                "Build compelling pitch deck with market size and competition analysis", 
                "Identify and approach 10-15 relevant seed investors (Blume, Prime VP, etc.)",
                "Demonstrate user traction: 1000+ active users or ₹5L+ monthly transactions"
            ],
            "language": "english"
        }

gemini_client = GeminiClient()