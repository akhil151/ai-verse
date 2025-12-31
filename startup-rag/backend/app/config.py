import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# Updated to supported model (SDK v0.8.3)
GEMINI_MODEL = "gemini-2.5-flash"  # Fast and cost-effective for production