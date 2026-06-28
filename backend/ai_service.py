"""AI service using Claude Sonnet 4.5 with automatic Demo AI Mode fallback."""
import os
import json
import re
import asyncio
import logging
from emergentintegrations.llm.chat import LlmChat, UserMessage
import demo_ai

logger = logging.getLogger(__name__)

MODEL_PROVIDER = "anthropic"
MODEL_NAME = "claude-sonnet-4-5-20250929"
# Wall-clock cap so we always return BEFORE the 60s ingress timeout.
LLM_TIMEOUT_SECS = 45

SYSTEM_PROMPT = """You are "Bharat Startup Desk", an expert AI co-founder for Indian founders, MSMEs, and startups.
Deeply knowledgeable about Indian business law, GST, MCA filings, MSME, Startup India, DPIIT, state-level schemes, licenses, trademarks, and funding.
Always personalize responses based on the user's INDUSTRY, STATE, and STAGE.
Use specific numbers (₹ in Lakhs/Crores) and refer to real Indian schemes/laws.
Always include a short disclaimer reminding users this is educational guidance.
When asked for structured data, return STRICT JSON ONLY with no prose, no markdown fences."""


def _strip_json_fences(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    return text.strip()


async def _claude_text(prompt: str, session_id: str, system: str | None = None) -> str:
    key = os.environ.get("EMERGENT_LLM_KEY")
    if not key:
        raise RuntimeError("EMERGENT_LLM_KEY missing")
    chat = LlmChat(
        api_key=key,
        session_id=session_id,
        system_message=system or SYSTEM_PROMPT,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)
    response = await asyncio.wait_for(
        chat.send_message(UserMessage(text=prompt)),
        timeout=LLM_TIMEOUT_SECS,
    )
    return response if isinstance(response, str) else str(response)


async def _claude_json(prompt: str, session_id: str) -> dict:
    full = prompt + "\n\nReturn STRICT JSON ONLY. No prose. No markdown. No backticks."
    raw = await _claude_text(full, session_id)
    cleaned = _strip_json_fences(raw)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


# ---------- Public API with automatic Demo AI fallback ----------

async def explore_idea(idea: str, industry: str, state: str, investment: str, session_id: str) -> dict:
    prompt = f"""Indian founder. IDEA: {idea} | INDUSTRY: {industry} | STATE: {state} | INVESTMENT: {investment}

Return concise JSON. Be specific to {state}. Keep prose minimal.
{{
 "business_structure":{{"recommended":"","why":"","alternatives":[]}},
 "registrations":[],
 "licenses":[],
 "gst":{{"applicable":true,"explanation":""}},
 "trademark":{{"recommended":true,"classes":[],"rationale":""}},
 "schemes":["5 India-specific schemes, one line each"],
 "estimated_cost":{{"setup":"","monthly":"","breakdown":[{{"item":"","amount":""}}]}},
 "risks":["4-6 concrete risks"],
 "first_10_steps":["exactly 10 actionable steps"],
 "roadmap_12_months":[{{"month":1,"focus":"","milestones":["1-2 short items"]}}]
}}
roadmap_12_months MUST have 12 entries, each with 1-2 short milestones only."""
    try:
        result = await _claude_json(prompt, session_id)
        result["_demo_ai"] = False
        return result
    except Exception as e:
        logger.warning("LLM failed, using Demo AI for explore_idea: %s", e)
        result = demo_ai.explore_idea_demo(idea, industry, state, investment)
        result["_demo_ai"] = True
        return result


async def generate_startup_plan(profile: dict, session_id: str) -> dict:
    prompt = f"""Profile:
{json.dumps(profile, indent=2)}

JSON with: roadmap{{30_days,90_days,180_days,365_days each 4-6 items}}, compliance_checklist[{{item,priority,due}}], government_benefits[5 strings], registrations[{{name,why}}], msme_eligibility{{eligible,category,benefits}}, startup_india_eligibility{{eligible,reasons,next_steps}}, trademark{{recommended,classes,rationale}}, health_score{{score 0-100, factors{{registrations,compliance,funding_readiness,documentation,ip}} each 0-20, missing[], actions[]}}"""
    try:
        result = await _claude_json(prompt, session_id)
        result["_demo_ai"] = False
        return result
    except Exception as e:
        logger.warning("LLM failed, using Demo AI for plan: %s", e)
        result = demo_ai.generate_plan_demo(profile)
        result["_demo_ai"] = True
        return result


async def validate_idea(idea: str, industry: str, state: str, session_id: str) -> dict:
    prompt = f"""Validate startup idea for Indian market.
IDEA: {idea}
INDUSTRY: {industry}
STATE: {state}

JSON: market_potential{{size,growth,tam_sam_som}}, strengths[], weaknesses[], risks[], improvements[], competitors[], verdict{{score 0-10,summary}}"""
    try:
        result = await _claude_json(prompt, session_id)
        result["_demo_ai"] = False
        return result
    except Exception as e:
        logger.warning("LLM failed, using Demo AI for validate: %s", e)
        result = demo_ai.validate_idea_demo(idea, industry, state)
        result["_demo_ai"] = True
        return result


async def trademark_advice(startup_name: str, industry: str, session_id: str) -> dict:
    prompt = f"""Brand: {startup_name}
Industry: {industry}

JSON: recommended_classes[{{class,covers}}], suggestions[], ip_checklist[], patent_opportunity{{likely,rationale}}, estimated_cost, timeline"""
    try:
        result = await _claude_json(prompt, session_id)
        result["_demo_ai"] = False
        return result
    except Exception as e:
        logger.warning("LLM failed, using Demo AI for trademark: %s", e)
        result = demo_ai.trademark_demo(startup_name, industry)
        result["_demo_ai"] = True
        return result


async def copilot_answer(question: str, context: dict, session_id: str) -> tuple[str, bool]:
    """Returns (answer, is_demo_ai)."""
    ctx = json.dumps(context, indent=2) if context else "No specific profile yet."
    prompt = f"""User's startup context:
{ctx}

Question: {question}

Answer in 2-5 short paragraphs. Use bullet points where helpful. Personalize. End with brief disclaimer."""
    try:
        text = await _claude_text(prompt, session_id)
        return text, False
    except Exception as e:
        logger.warning("LLM failed, using Demo AI for copilot: %s", e)
        return demo_ai.copilot_demo(question, context or {}), True
