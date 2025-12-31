from pydantic import BaseModel
from typing import List, Optional

class FounderProfile(BaseModel):
    startup_stage: str  # "idea", "mvp", "early_traction", "growth"
    sector: str
    location: str
    funding_goal: str
    preferred_language: str  # "english", "hindi", "tamil", etc.

class FundingQuestion(BaseModel):
    question: str
    context: Optional[str] = None

class FundingAdvice(BaseModel):
    readiness_score: int
    recommended_path: str
    explanation: str
    checklist: List[str]
    language: str