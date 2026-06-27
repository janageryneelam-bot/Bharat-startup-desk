"""Bharat Startup Desk - FastAPI backend."""
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone

import data as static_data
import ai_service

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="Bharat Startup Desk API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# ---------- Models ----------
class ExploreReq(BaseModel):
    idea: str
    industry: str
    state: str
    investment: str


class StartupProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    stage: str
    industry: str
    state: str
    operation_state: Optional[str] = None
    company_type: Optional[str] = None
    annual_turnover: Optional[str] = None
    employee_count: Optional[int] = None
    business_model: Optional[str] = None
    funding_requirement: Optional[str] = None
    description: Optional[str] = None
    cin: Optional[str] = None
    gstin: Optional[str] = None
    llpin: Optional[str] = None
    udyam: Optional[str] = None
    dpiit: Optional[str] = None
    incorporated_on: Optional[str] = None
    is_demo: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class RegisteredBusinessReq(BaseModel):
    name: str
    company_type: str
    incorporated_on: str
    state: str
    cin: Optional[str] = None
    gstin: Optional[str] = None
    llpin: Optional[str] = None
    udyam: Optional[str] = None
    dpiit: Optional[str] = None


class CopilotReq(BaseModel):
    question: str
    context: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None


class IdeaValidateReq(BaseModel):
    idea: str
    industry: str
    state: str


class TrademarkReq(BaseModel):
    startup_name: str
    industry: str


# ---------- Meta endpoints ----------
@api.get("/")
async def root():
    return {"app": "Bharat Startup Desk", "status": "ok"}


@api.get("/meta/states")
async def get_states():
    return {"states": static_data.list_states()}


@api.get("/meta/industries")
async def get_industries():
    return {"industries": static_data.list_industries()}


@api.get("/meta/stages")
async def get_stages():
    return {"stages": static_data.STARTUP_STAGES}


@api.get("/meta/company-types")
async def get_company_types():
    return {"company_types": static_data.COMPANY_TYPES}


@api.get("/meta/all")
async def get_meta_all():
    return {
        "states": static_data.list_states(),
        "industries": static_data.list_industries(),
        "stages": static_data.STARTUP_STAGES,
        "company_types": static_data.COMPANY_TYPES,
    }


# ---------- Demo Startups ----------
@api.get("/demo/startups")
async def list_demo_startups():
    return {"startups": static_data.DEMO_STARTUPS}


@api.get("/demo/startups/{startup_id}")
async def get_demo_startup(startup_id: str):
    for s in static_data.DEMO_STARTUPS:
        if s["id"] == startup_id:
            return s
    raise HTTPException(404, "Demo startup not found")


# ---------- Flow 1: Explore Idea ----------
@api.post("/explore/idea")
async def explore_idea_endpoint(body: ExploreReq):
    session_id = f"explore-{uuid.uuid4()}"
    try:
        result = await ai_service.explore_idea(body.idea, body.industry, body.state, body.investment, session_id)
    except Exception as e:
        logger.exception("explore_idea failed")
        raise HTTPException(500, f"AI generation failed: {e}")

    # also include static recommendations
    schemes = static_data.recommend_schemes(body.state, body.industry, "Idea")
    licenses = static_data.recommend_licenses(body.industry, body.state)
    state_benefits = static_data.get_state_benefits(body.state)

    return {
        "ai": result,
        "schemes": schemes,
        "licenses": licenses,
        "state_benefits": state_benefits,
    }


# ---------- Flow 2 & 3: Startup Profiles ----------
@api.post("/profiles")
async def create_profile(profile: StartupProfile):
    doc = profile.model_dump()
    await db.profiles.insert_one(doc)
    return profile


@api.get("/profiles/{profile_id}")
async def get_profile(profile_id: str):
    doc = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not doc:
        # check demo startups
        for s in static_data.DEMO_STARTUPS:
            if s["id"] == profile_id:
                return s
        raise HTTPException(404, "Profile not found")
    return doc


@api.post("/profiles/{profile_id}/plan")
async def generate_plan(profile_id: str):
    """Generate AI plan from profile."""
    doc = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not doc:
        for s in static_data.DEMO_STARTUPS:
            if s["id"] == profile_id:
                doc = s
                break
    if not doc:
        raise HTTPException(404, "Profile not found")

    # cache plan
    cached = await db.plans.find_one({"profile_id": profile_id}, {"_id": 0})
    if cached:
        return cached["plan"]

    session_id = f"plan-{profile_id}"
    try:
        plan = await ai_service.generate_startup_plan(doc, session_id)
    except Exception as e:
        logger.exception("generate_plan failed")
        raise HTTPException(500, f"AI generation failed: {e}")

    await db.plans.insert_one({"profile_id": profile_id, "plan": plan, "created_at": datetime.now(timezone.utc).isoformat()})
    return plan


# ---------- Flow 3: Registered Business (simulate public lookup) ----------
@api.post("/registered/lookup")
async def registered_lookup(body: RegisteredBusinessReq):
    """Simulate fetching public business information. Returns a Demo Public Data Preview."""
    profile = StartupProfile(
        name=body.name,
        stage="Growth",
        industry="Manufacturing" if "forge" in body.name.lower() or "mfg" in body.name.lower() else "AI / SaaS",
        state=body.state,
        operation_state=body.state,
        company_type=body.company_type,
        incorporated_on=body.incorporated_on,
        cin=body.cin or f"U72200{body.state[:2].upper()}{body.incorporated_on[:4]}PTC{uuid.uuid4().hex[:6].upper()}",
        gstin=body.gstin or f"29ABCDE{uuid.uuid4().hex[:4].upper()}1Z5",
        udyam=body.udyam or f"UDYAM-{body.state[:2].upper()}-03-{uuid.uuid4().hex[:7].upper()}",
        dpiit=body.dpiit,
        llpin=body.llpin,
        annual_turnover="1-5Cr",
        employee_count=24,
        business_model="B2B services",
        funding_requirement="₹2 Crore",
        description="Demo company profile generated from public-style data sources for preview.",
    )
    doc = profile.model_dump()
    await db.profiles.insert_one(doc)
    return {"profile": profile, "preview_badge": "Demo Public Data Preview"}


# ---------- Compliance ----------
@api.get("/compliance/{profile_id}")
async def get_compliance(profile_id: str):
    doc = await db.profiles.find_one({"id": profile_id}, {"_id": 0})
    if not doc:
        for s in static_data.DEMO_STARTUPS:
            if s["id"] == profile_id:
                doc = s
                break
    if not doc:
        raise HTTPException(404, "Profile not found")

    items = static_data.generate_compliance_calendar(
        company_type=doc.get("company_type") or "Private Limited Company",
        has_gst=bool(doc.get("gstin")),
        has_employees=(doc.get("employee_count") or 0) >= 10,
    )

    counts = {"completed": 0, "upcoming": 0, "overdue": 0}
    for it in items:
        counts[it["status"]] += 1

    return {"items": items, "summary": counts}


# ---------- Schemes (Government Benefits) ----------
@api.get("/schemes")
async def list_schemes(state: Optional[str] = None, industry: Optional[str] = None, stage: Optional[str] = None):
    if state and industry and stage:
        return {"schemes": static_data.recommend_schemes(state, industry, stage)}
    return {"schemes": static_data.SCHEMES}


@api.get("/schemes/{scheme_id}")
async def get_scheme(scheme_id: str):
    for s in static_data.SCHEMES:
        if s["id"] == scheme_id:
            return s
    raise HTTPException(404, "Scheme not found")


# ---------- State Intelligence ----------
@api.get("/state/{state}")
async def get_state(state: str):
    return static_data.get_state_benefits(state)


# ---------- Licenses ----------
@api.get("/licenses")
async def licenses(industry: Optional[str] = None, state: Optional[str] = None):
    if industry:
        return {"licenses": static_data.recommend_licenses(industry, state)}
    return {"licenses": static_data.LICENSES}


# ---------- Trademark & IP ----------
@api.post("/trademark/advice")
async def trademark_endpoint(body: TrademarkReq):
    session_id = f"tm-{uuid.uuid4()}"
    try:
        return await ai_service.trademark_advice(body.startup_name, body.industry, session_id)
    except Exception as e:
        logger.exception("trademark failed")
        raise HTTPException(500, f"AI generation failed: {e}")


# ---------- Idea Validator ----------
@api.post("/validate/idea")
async def validate_idea_endpoint(body: IdeaValidateReq):
    session_id = f"validate-{uuid.uuid4()}"
    try:
        return await ai_service.validate_idea(body.idea, body.industry, body.state, session_id)
    except Exception as e:
        logger.exception("validate failed")
        raise HTTPException(500, f"AI generation failed: {e}")


# ---------- AI Copilot Chat ----------
@api.post("/copilot/chat")
async def copilot_chat(body: CopilotReq):
    session_id = body.session_id or f"copilot-{uuid.uuid4()}"
    try:
        answer = await ai_service.copilot_answer(body.question, body.context or {}, session_id)
    except Exception as e:
        logger.exception("copilot failed")
        raise HTTPException(500, f"AI generation failed: {e}")

    # store message
    await db.chat_messages.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session_id,
        "question": body.question,
        "answer": answer,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"answer": answer, "session_id": session_id}


@api.get("/copilot/history/{session_id}")
async def copilot_history(session_id: str):
    msgs = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(200)
    return {"messages": msgs}


# ---------- Admin (minimal) ----------
@api.get("/admin/datasets")
async def admin_datasets():
    return {
        "schemes": len(static_data.SCHEMES),
        "licenses": len(static_data.LICENSES),
        "states_with_benefits": len(static_data.STATE_BENEFITS),
        "compliances": len(static_data.COMPLIANCES),
        "demo_startups": len(static_data.DEMO_STARTUPS),
    }


@api.post("/admin/schemes")
async def admin_add_scheme(scheme: Dict[str, Any]):
    await db.custom_schemes.insert_one(scheme)
    return {"status": "ok"}


@api.get("/admin/schemes")
async def admin_list_schemes():
    custom = await db.custom_schemes.find({}, {"_id": 0}).to_list(500)
    return {"static": static_data.SCHEMES, "custom": custom}


# ---------- Wire up ----------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
