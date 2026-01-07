import os
from dotenv import load_dotenv

load_dotenv()

# Groq API Configuration (Primary AI Provider)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"  # Latest supported model via Groq

# Gemini API Configuration (Optional Secondary Provider for Market Analysis)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")