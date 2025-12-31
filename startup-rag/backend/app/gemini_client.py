import google.generativeai as genai
import json
from app.config import GEMINI_API_KEY, GEMINI_MODEL

class GeminiClient:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            genai.configure(api_key=GEMINI_API_KEY)
            self.model = genai.GenerativeModel(GEMINI_MODEL)
        else:
            self.model = None
    
    def generate_funding_advice(self, prompt: str) -> dict:
        # If no valid API key, return demo response
        if not self.model:
            return self._get_demo_response()
            
        try:
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response
            response_text = response.text.strip()
            
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
            
        except json.JSONDecodeError:
            return self._get_demo_response()
        except Exception as e:
            print(f"Gemini API error: {str(e)}")
            return self._get_demo_response()
    
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