"""
Financial Narrative Prompts - ISOLATED MODULE
DO NOT SHARE WITH OTHER FEATURES
"""

def get_financial_narrative_prompt(financial_data: dict) -> str:
    """
    Generate explanatory narrative for financial metrics.
    
    CRITICAL: This is NOT financial advice.
    This is an explanatory narrative only.
    """
    
    burn_rate = financial_data.get('monthly_burn_rate', 0)
    runway = financial_data.get('runway_months', 0)
    revenue = financial_data.get('monthly_revenue', 0)
    cac = financial_data.get('customer_acquisition_cost', 0)
    ltv = financial_data.get('lifetime_value', 0)
    
    prompt = f"""You are a financial explainer that converts numbers into clear, understandable narratives.

CRITICAL INSTRUCTIONS:
- This is NOT financial advice
- Do NOT make recommendations
- Do NOT say "you should" or "you must"
- Do NOT provide strategic guidance
- ONLY explain what the numbers mean in simple terms

FINANCIAL DATA PROVIDED:
- Monthly Burn Rate: ₹{burn_rate:,.0f}
- Runway: {runway} months
- Monthly Revenue: ₹{revenue:,.0f}
{f"- Customer Acquisition Cost (CAC): ₹{cac:,.0f}" if cac > 0 else ""}
{f"- Lifetime Value (LTV): ₹{ltv:,.0f}" if ltv > 0 else ""}

TASK:
Write a clear, explanatory narrative that helps someone understand what these numbers mean.

OUTPUT FORMAT (JSON):
{{
  "burn_rate_explanation": "Clear explanation of what burn rate means for this business",
  "runway_interpretation": "What the runway tells us about time and resources",
  "unit_economics_insight": "Explanation of CAC/LTV relationship (only if data exists)",
  "summary": "Brief overall financial picture",
  "disclaimer": "This is not financial advice. This is an explanatory narrative based on provided inputs."
}}

TONE:
- Educational and clear
- Neutral and factual
- No prescriptive language
- Use simple analogies where helpful

Generate the JSON response now."""
    
    return prompt
