"""
Financial Narrative Generator - ISOLATED MODULE
This feature is completely independent from:
- Funding Advisor
- RAG system
- Readiness scoring
- Market analysis
"""

import json
import logging
from typing import Dict, Any
from app.groq_client import groq_client
from app.financial_narrative_prompts import get_financial_narrative_prompt

logger = logging.getLogger(__name__)


class FinancialNarrativeGenerator:
    """
    Generates explanatory narratives for financial metrics.
    
    ISOLATION RULES:
    - Does NOT use funding advisor prompts
    - Does NOT use RAG retrieval
    - Does NOT use scoring logic
    - Uses dedicated Groq client call
    """
    
    def __init__(self):
        self.client = groq_client
        logger.info("Financial Narrative Generator initialized (isolated)")
    
    def generate_narrative(self, financial_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate financial narrative from provided data.
        
        Args:
            financial_data: Dictionary containing financial metrics
            
        Returns:
            Dictionary with narrative components and mandatory disclaimer
            
        Raises:
            ValueError: If AI generation fails
        """
        if not self.client.is_configured:
            raise ValueError("AI provider not configured")
        
        # Validate inputs
        if not financial_data:
            raise ValueError("Financial data is required")
        
        # Generate prompt using dedicated prompt function
        prompt = get_financial_narrative_prompt(financial_data)
        
        try:
            logger.info("🔮 Generating financial narrative...")
            
            # Use Groq for generation (isolated call)
            response_text = self.client.test_generation(prompt)
            
            # Parse JSON response
            # Handle markdown code blocks
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "{" in response_text and "}" in response_text:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                json_text = response_text[json_start:json_end]
            else:
                raise ValueError("No JSON found in response")
            
            narrative = json.loads(json_text)
            
            # Ensure disclaimer is always present
            if "disclaimer" not in narrative:
                narrative["disclaimer"] = "This is not financial advice. This is an explanatory narrative based on provided inputs."
            
            logger.info("✅ Financial narrative generated successfully")
            return narrative
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse narrative JSON: {str(e)}")
            raise ValueError(f"Failed to parse AI response: {str(e)}")
        except Exception as e:
            logger.error(f"Narrative generation failed: {type(e).__name__}: {str(e)}")
            raise ValueError(f"Narrative generation failed: {str(e)}")
    
    def validate_financial_data(self, data: Dict[str, Any]) -> bool:
        """
        Validate that financial data contains required fields.
        
        Args:
            data: Financial data dictionary
            
        Returns:
            True if valid, False otherwise
        """
        required = ['monthly_burn_rate', 'runway_months']
        return all(key in data for key in required)


# Singleton instance
financial_narrative_generator = FinancialNarrativeGenerator()
