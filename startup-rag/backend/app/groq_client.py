"""
Groq LLM Client for Funding Advice Generation
Uses Groq API with LLaMA models for fast, cost-effective AI responses
"""

import os
import json
import logging
import requests
from app.config import GROQ_API_KEY, GROQ_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GroqClient:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.model = GROQ_MODEL
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.is_configured = False
        
        if self.api_key and self.api_key != "your_groq_api_key_here":
            try:
                # Test the API key with a simple request
                self.is_configured = True
                logger.info(f"Groq client initialized with model: {self.model}")
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {str(e)}")
                self.is_configured = False
        else:
            logger.warning("Groq API key not configured. Using demo mode.")
    
    def generate_funding_advice(self, prompt: str) -> dict:
        """Generate funding advice using Groq API"""
        if not self.is_configured:
            logger.error("❌ Groq not configured - CANNOT generate advice")
            raise ValueError("Groq AI is not configured. Set GROQ_API_KEY environment variable.")
            
        try:
            logger.info("🤖 Calling Groq API...")
            
            # Format prompt for chat completion
            messages = [
                {
                    "role": "system",
                    "content": "You are an expert Indian startup funding advisor. Always respond with valid JSON only, no markdown formatting."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
            
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 2000,
                },
                timeout=30,
            )
            
            if response.status_code != 200:
                error_msg = response.text
                logger.error(f"❌ Groq API error: {response.status_code} - {error_msg}")
                raise ValueError(f"Groq API error: {response.status_code} - {error_msg}")
            
            data = response.json()
            response_text = data["choices"][0]["message"]["content"].strip()
            logger.info(f"✅ Groq responded with {len(response_text)} chars")
            logger.debug(f"Raw response preview: {response_text[:200]}...")
            
            # Find JSON in response (handle markdown code blocks)
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                # Handle generic code blocks
                json_start = response_text.find("```") + 3
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "{" in response_text and "}" in response_text:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                json_text = response_text[json_start:json_end]
            else:
                logger.error("❌ No JSON found in Groq response")
                json_text = response_text
            
            parsed_response = json.loads(json_text)
            logger.info("✅ Successfully parsed JSON response")
            return parsed_response
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse Groq JSON response: {str(e)}")
            logger.error(f"Response text: {response_text[:500]}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            logger.error(f"❌ Groq API error: {type(e).__name__}: {str(e)}")
            raise ValueError(f"AI generation failed: {type(e).__name__}: {str(e)}")
    
    def test_generation(self, prompt: str) -> str:
        """Simple test method for LLM verification"""
        if not self.is_configured:
            raise ValueError("Groq API not configured. Check GROQ_API_KEY environment variable.")
        
        try:
            messages = [
                {
                    "role": "system",
                    "content": "You are a helpful assistant."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
            
            response = requests.post(
                self.base_url,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1000,
                },
                timeout=30,
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            else:
                raise ValueError(f"Groq API error: {response.status_code} - {response.text}")
        except Exception as e:
            logger.error(f"Test generation failed: {type(e).__name__}: {str(e)}")
            raise

groq_client = GroqClient()





