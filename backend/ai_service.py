"""AI service using Claude Sonnet 4.5 via Emergent LLM key."""
import os
import json
import re
import logging
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"

SYSTEM_PROMPT = """You are "Bharat Startup Desk", an expert AI co-founder for Indian founders, MSMEs, and startups.
You are deeply knowledgeable about Indian business law, GST, MCA filings, MSME, Startup India, DPIIT, state-level schemes (Karnataka ELEVATE, StartupTN, MSInS, T-Hub, etc.), licenses, trademarks, and funding.
You always personalize responses based on the user's INDUSTRY, STATE, and STAGE.
You write in clear, structured, founder-friendly English. You use specific numbers (₹ in Lakhs/Crores) and refer to real Indian schemes/laws when relevant.
You ALWAYS include a short disclaimer reminding users this is educational guidance, not legal/tax advice.
When asked for structured data, return STRICT JSON ONLY with no prose, no markdown fences."""


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


async def claude_text(prompt: str, session_id: str, system: str | None = None) -> str:
    key = os.environ.get("EMERGENT_LLM_KEY") or EMERGENT_LLM_KEY
    if not key:
        raise RuntimeError("EMERGENT_LLM_KEY missing from backend .env")
    chat = LlmChat(
        api_key=key,
        session_id=session_id,
        system_message=system or SYSTEM_PROMPT,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    response = await chat.send_message(UserMessage(text=prompt))
    return response if isinstance(response, str) else str(response)


async def claude_json(prompt: str, session_id: str) -> dict:
    """Ask Claude to respond in JSON, parse it safely."""
    full = (
        prompt
        + "\n\nReturn STRICT JSON ONLY. No prose. No markdown. No backticks."
    )
    raw = await claude_text(full, session_id)
    cleaned = _strip_json_fences(raw)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # try to extract first { ... } block
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        logger.warning("Failed to parse JSON from Claude: %s", cleaned[:400])
        return {"_raw": raw}


# ---------- Specific generators ----------

async def explore_idea(idea: str, industry: str, state: str, investment: str, session_id: str) -> dict:
    prompt = f"""A founder wants to start a business in India.

IDEA: {idea}
INDUSTRY: {industry}
STATE OF OPERATION: {state}
ESTIMATED INVESTMENT: {investment}

Produce a detailed but concise analysis as JSON with these keys:
- business_structure: {{"recommended": "...", "why": "...", "alternatives": ["..."]}}
- registrations: [list of strings, India-specific]
- licenses: [list of strings, India-specific]
- gst: {{"applicable": true/false, "explanation": "..."}}
- trademark: {{"recommended": true/false, "classes": [list of trademark class numbers], "rationale": "..."}}
- schemes: [list of 3-5 specific Indian schemes (Startup India / Mudra / PMEGP / state-level) with one-line eligibility note]
- estimated_cost: {{"setup": "₹X-Y Lakhs", "monthly": "₹X-Y Lakhs", "breakdown": [{{"item": "...", "amount": "..."}}]}}
- risks: [list of 4-6 concrete risks]
- first_10_steps: [list of EXACTLY 10 actionable steps]
- roadmap_12_months: [list of 12 objects {{"month": 1, "focus": "...", "milestones": ["..."]}}]

Be specific to {state} state benefits where applicable."""
    return await claude_json(prompt, session_id)


async def generate_startup_plan(profile: dict, session_id: str) -> dict:
    prompt = f"""Profile of an Indian founder/startup:
{json.dumps(profile, indent=2)}

Generate as JSON:
- roadmap: {{"30_days": [...], "90_days": [...], "180_days": [...], "365_days": [...]}}  (each list 4-6 items)
- compliance_checklist: [list of {{"item": "...", "priority": "high/medium/low", "due": "..."}}]
- government_benefits: [list of 3-5 specific schemes they qualify for with one-line reason]
- registrations: [list of {{"name": "...", "why": "..."}}]
- msme_eligibility: {{"eligible": true/false, "category": "Micro/Small/Medium", "benefits": ["..."]}}
- startup_india_eligibility: {{"eligible": true/false, "reasons": ["..."], "next_steps": ["..."]}}
- trademark: {{"recommended": true/false, "classes": [numbers], "rationale": "..."}}
- health_score: {{"score": 0-100, "factors": {{"registrations": 0-20, "compliance": 0-20, "funding_readiness": 0-20, "documentation": 0-20, "ip": 0-20}}, "missing": ["..."], "actions": ["..."]}}"""
    return await claude_json(prompt, session_id)


async def validate_idea(idea: str, industry: str, state: str, session_id: str) -> dict:
    prompt = f"""Validate this startup idea for the Indian market.
IDEA: {idea}
INDUSTRY: {industry}
STATE: {state}

Return JSON:
- market_potential: {{"size": "...", "growth": "...", "tam_sam_som": "..."}}
- strengths: [4-6 items]
- weaknesses: [4-6 items]
- risks: [4-6 items]
- improvements: [4-6 specific improvements]
- competitors: [3-5 likely Indian competitors with one-line note]
- verdict: {{"score": 0-10, "summary": "..."}}"""
    return await claude_json(prompt, session_id)


async def trademark_advice(startup_name: str, industry: str, session_id: str) -> dict:
    prompt = f"""A founder wants to trademark their brand in India.
BRAND NAME: {startup_name}
INDUSTRY: {industry}

Return JSON:
- recommended_classes: [list of trademark class numbers under Indian Trademarks Act with reason for each: {{"class": N, "covers": "..."}}]
- suggestions: ["4-6 actionable trademark filing tips specific to India"]
- ip_checklist: ["6-8 items covering trademark, copyright, design, trade secrets, NDA"]
- patent_opportunity: {{"likely": true/false, "rationale": "..."}}
- estimated_cost: "₹X for startup-recognized entity, ₹Y otherwise (per class)"
- timeline: "12-24 months typical"
"""
    return await claude_json(prompt, session_id)


async def copilot_answer(question: str, context: dict, session_id: str) -> str:
    ctx = json.dumps(context, indent=2) if context else "No specific profile yet."
    prompt = f"""User's startup context:
{ctx}

Question: {question}

Answer in 2-5 short paragraphs. Use bullet points where helpful.
Personalize based on industry/state/stage in their context.
Always end with a brief disclaimer line."""
    return await claude_text(prompt, session_id)
