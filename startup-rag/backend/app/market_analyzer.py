"""
Simplified Market Size & Opportunity Narrator
"""

import re
from typing import Dict
from .gemini_client import gemini_client

class MarketAnalyzer:
    def __init__(self):
        self.gemini_client = gemini_client
        
    def detect_market_intent(self, query: str) -> bool:
        """Detect if query is about market sizing"""
        market_keywords = [
            'market size', 'tam', 'sam', 'som', 'market opportunity',
            'addressable market', 'market potential', 'market analysis',
            'industry size', 'market growth', 'market share'
        ]
        query_lower = query.lower()
        return any(keyword in query_lower for keyword in market_keywords)
    
    def analyze_market(self, query: str, language: str = "en") -> Dict:
        """Main market analysis pipeline"""
        
        # Build market analysis prompt
        prompt = self._build_market_prompt(query, language)
        
        # Generate response using Gemini
        try:
            response = self.gemini_client.test_generation(prompt)
            parsed_result = self._parse_market_response(response)
            parsed_result['sources'] = ['Gemini AI Analysis']
            return parsed_result
        except Exception as e:
            # Return demo data if Gemini fails
            return self._get_demo_response(query, language)
    
    def _build_market_prompt(self, query: str, language: str) -> str:
        """Build market analysis prompt"""
        
        language_map = {
            "en": "English",
            "hi": "Hindi", 
            "ta": "Tamil",
            "te": "Telugu",
            "kn": "Kannada",
            "ml": "Malayalam"
        }
        
        target_language = language_map.get(language, "English")
        
        return f"""
Analyze the market opportunity for: {query}

Provide a structured market analysis with:

1. TAM (Total Addressable Market) - Global market size with currency
2. SAM (Serviceable Available Market) - Relevant segment with currency
3. SOM (Serviceable Obtainable Market) - Realistic capture (0.1-1% of SAM) with currency
4. Market Growth Rate - Annual growth percentage
5. India vs Global comparison
6. Key assumptions made
7. Simple explanation in {target_language}

Format your response exactly as:
TAM: [value with currency]
SAM: [value with currency] 
SOM: [value with currency]
GROWTH: [percentage]
INDIA_VS_GLOBAL: [comparison text]
ASSUMPTIONS: [key assumptions]
NARRATION: [Simple explanation in {target_language} using easy vocabulary]

Provide realistic estimates based on industry knowledge.
"""

    def _parse_market_response(self, response: str) -> Dict:
        """Parse LLM response into structured format"""
        
        result = {
            "tam": "",
            "sam": "",
            "som": "",
            "growth": "",
            "india_vs_global": "",
            "assumptions": "",
            "narration": ""
        }
        
        # Extract values using regex
        patterns = {
            "tam": r"TAM:\s*(.+?)(?=\n|SAM:|$)",
            "sam": r"SAM:\s*(.+?)(?=\n|SOM:|$)", 
            "som": r"SOM:\s*(.+?)(?=\n|GROWTH:|$)",
            "growth": r"GROWTH:\s*(.+?)(?=\n|INDIA_VS_GLOBAL:|$)",
            "india_vs_global": r"INDIA_VS_GLOBAL:\s*(.+?)(?=\n|ASSUMPTIONS:|$)",
            "assumptions": r"ASSUMPTIONS:\s*(.+?)(?=\n|NARRATION:|$)",
            "narration": r"NARRATION:\s*(.+?)$"
        }
        
        for key, pattern in patterns.items():
            match = re.search(pattern, response, re.DOTALL | re.IGNORECASE)
            if match:
                result[key] = match.group(1).strip()
        
        return result
    
    def _get_demo_response(self, query: str, language: str) -> Dict:
        """Return demo response if Gemini is not available"""
        return {
            "tam": "$50 Billion USD",
            "sam": "$15 Billion USD",
            "som": "$150 Million USD",
            "growth": "12% annually",
            "india_vs_global": f"India represents 15% of the global {query} market with faster growth rates due to digital adoption.",
            "assumptions": "Based on industry reports and market trends. Actual numbers may vary.",
            "narration": f"The {query} market shows strong growth potential with significant opportunities in India's expanding digital economy.",
            "sources": ["Demo Analysis"]
        }