"""Demo AI Mode — rule-based personalised responses used as fallback when LLM is unavailable."""
from typing import Dict, Any
import re


def _pick(ctx: Dict[str, Any], k: str, default=""):
    v = ctx.get(k) if ctx else None
    return v if v else default


def _structure_for(industry: str, turnover: str = "0-25L") -> dict:
    rec = "Private Limited Company"
    why = "Default recommendation for Indian startups — limited liability + investor friendly."
    alt: list[str] = ["LLP"]
    if industry in ["Manufacturing", "Construction & Labour", "Healthcare & Clinic"]:
        rec = "Private Limited Company"
        why = "Manufacturing / labour-intensive / healthcare businesses benefit from limited liability, easier access to bank loans (CGTMSE), and credibility with vendors and government tenders."
        alt = ["LLP", "One Person Company (OPC)"]
    elif industry in ["AI / SaaS", "FinTech", "EdTech", "HealthTech"]:
        rec = "Private Limited Company"
        why = "Tech startups need a Pvt Ltd to raise VC funding (ESOPs, equity rounds, DPIIT recognition, SAFE/CCD instruments require corporate structure)."
        alt = ["LLP (only if bootstrapped forever)"]
    elif industry in ["D2C / E-commerce", "Beauty & Skincare", "Fashion & Apparel", "FoodTech / F&B"]:
        rec = "Private Limited Company"
        why = "D2C brands typically raise external capital and need limited liability for product liability claims."
        alt = ["LLP", "Sole Proprietorship (only if hobby-scale)"]
    else:
        rec = "LLP"
        why = "Services businesses with 2-4 founders, no immediate VC plans — LLP gives partnership flexibility with limited liability."
        alt = ["Private Limited Company", "Partnership"]
    return {"recommended": rec, "why": why, "alternatives": alt}


def _state_schemes(state: str):
    base = ["Startup India Seed Fund Scheme — up to ₹50 Lakh", "PM Mudra Yojana — up to ₹20 Lakh collateral-free", "CGTMSE — collateral-free loans up to ₹5 Cr"]
    state_map = {
        "Karnataka": ["Karnataka ELEVATE — up to ₹50 Lakh grant", "K-Tech Innovation Hub support"],
        "Maharashtra": ["Maharashtra MSInS — up to ₹15 Lakh grant", "Mumbai Angels / Pune incubators access"],
        "Tamil Nadu": ["StartupTN Seed Grant — up to ₹10 Lakh", "TIDCO sector support"],
        "Telangana": ["T-Hub incubation + T-Fund access", "WE-Hub for women founders"],
        "Gujarat": ["SSIP up to ₹30 Lakh + ₹20K/month sustenance allowance"],
    }
    return state_map.get(state, []) + base


def explore_idea_demo(idea: str, industry: str, state: str, investment: str) -> dict:
    needs_gst = industry in ["D2C / E-commerce", "Beauty & Skincare", "Fashion & Apparel", "FoodTech / F&B", "Manufacturing", "Retail"]
    needs_tm = True
    structure = _structure_for(industry)
    registrations = ["PAN & TAN", "Certificate of Incorporation (MCA)", "Bank account opening", "GST registration" if needs_gst else "GST (only when turnover >₹40L/20L)", "Udyam (MSME) registration", "DPIIT Startup India recognition", "Shops & Establishments License"]
    licenses = []
    if industry == "FoodTech / F&B": licenses += ["FSSAI License (mandatory)"]
    if industry == "Manufacturing": licenses += ["Factory License", "Pollution Control NOC", "BIS / ISI (if applicable)"]
    if industry == "Construction & Labour": licenses += ["Contract Labour License (CLRA)", "BOCW Welfare registration", "PF/ESI registration"]
    if industry == "Healthcare & Clinic": licenses += ["Clinical Establishment License", "Bio-Medical Waste authorization", "Drug License (if pharmacy)"]
    if not licenses: licenses = ["Trade License (Municipal)", "Shops & Establishments"]

    cls = {"Beauty & Skincare": [3, 5], "FoodTech / F&B": [29, 30, 35], "AI / SaaS": [9, 42], "Manufacturing": [7, 35], "Construction & Labour": [37, 35]}.get(industry, [35, 42])

    inv_num = re.findall(r"\d+", investment or "5")
    base_low = int(inv_num[0]) if inv_num else 5

    return {
        "business_structure": structure,
        "registrations": registrations,
        "licenses": licenses,
        "gst": {"applicable": needs_gst or "e-commerce" in (idea or "").lower(),
                "explanation": f"For {industry} businesses, GST registration is mandatory if turnover crosses ₹40L (goods) / ₹20L (services), OR for any interstate sale, OR for selling on marketplaces (Amazon, Flipkart, Nykaa)."},
        "trademark": {"recommended": needs_tm, "classes": cls, "rationale": f"Protect your brand in {industry} early — first-to-file wins in India. As DPIIT-recognised startup the fee is ₹4,500/class instead of ₹9,000."},
        "schemes": _state_schemes(state)[:5],
        "estimated_cost": {
            "setup": f"₹{base_low}-{base_low * 2} Lakh",
            "monthly": f"₹{max(1, base_low // 4)}-{base_low // 2} Lakh",
            "breakdown": [
                {"item": "Company incorporation + legal", "amount": "₹15,000 - ₹25,000"},
                {"item": "GST + Udyam + Shop Act", "amount": "₹5,000 - ₹10,000"},
                {"item": "Trademark filing (per class)", "amount": "₹4,500 (startup) / ₹9,000"},
                {"item": "Website + branding", "amount": "₹50,000 - ₹2,00,000"},
                {"item": "Initial inventory / dev cost", "amount": f"₹{base_low // 2}-{base_low} Lakh"},
                {"item": "Working capital (3 months)", "amount": f"₹{base_low // 2}-{base_low} Lakh"},
            ],
        },
        "risks": [
            "Compliance load — GST returns are monthly; MCA filings annual. Missed deadlines attract ₹100-₹200/day penalties.",
            f"State-specific regulations in {state} — professional tax, labour laws, and pollution norms.",
            "Cash flow gap in months 3-9 before revenue stabilizes.",
            "Customer acquisition cost may exceed initial projections.",
            "Trademark conflict — search before filing to avoid opposition fees.",
            "Dependence on key founders; build SOPs early.",
        ],
        "first_10_steps": [
            "Validate idea with 20+ customer interviews in your target segment",
            "Choose company structure (Pvt Ltd recommended for most)",
            "Reserve company name on MCA SPICe+ Part A",
            "File SPICe+ Part B for incorporation (15-day timeline)",
            "Apply for PAN, TAN, and bank account",
            "Register on Udyam Portal (MSME) — free, 1 day",
            "Apply for GST registration if applicable",
            "File DPIIT Startup India recognition (free, 5-15 days)",
            "Trademark filing under recommended classes",
            f"Open Shop & Establishment in {state} + Profession Tax registration",
        ],
        "roadmap_12_months": [
            {"month": i, "focus": f, "milestones": m} for i, (f, m) in enumerate([
                ("Foundation", ["Incorporate Pvt Ltd", "Open bank account", "GST + Udyam"]),
                ("Setup", ["DPIIT recognition", "Trademark filed", "Hire 1-2 key roles"]),
                ("Build MVP", ["Product v0.1 ready", "5 beta customers", "Pricing finalised"]),
                ("Launch", ["Public launch", "Marketing site live", "First ₹1L revenue"]),
                ("Growth", ["Apply for Mudra/CGTMSE if needed", "Scheme application", "Compliance calendar live"]),
                ("Optimize", ["Achieve ₹3-5L MRR", "Hire ops + sales", "Vendor agreements"]),
                ("Scale prep", ["Pitch deck v2", "Investor outreach", "Series Seed conversations"]),
                ("Fundraise", ["Close seed round", "Board governance", "Cap table cleanup"]),
                ("Expand", ["New geography / SKU", "PR push", "Strategic partnerships"]),
                ("Stabilize", ["Process SOPs", "Compliance audit", "Tax planning"]),
                ("Build moats", ["IP portfolio expansion", "Customer retention focus", "Team training"]),
                ("Plan Year 2", ["12-month strategy", "Series A prep", "Board offsite"]),
            ], 1)
        ],
    }


def generate_plan_demo(profile: dict) -> dict:
    stage = profile.get("stage", "Idea")
    industry = profile.get("industry", "AI / SaaS")
    state = profile.get("state", "Karnataka")
    emp = profile.get("employee_count") or 1
    has_gst = bool(profile.get("gstin"))
    has_udyam = bool(profile.get("udyam"))
    has_dpiit = bool(profile.get("dpiit"))

    # health score factors
    reg = (5 if profile.get("cin") else 0) + (5 if has_gst else 0) + (5 if has_udyam else 0) + (5 if has_dpiit else 0)
    compl = 15 if stage in ["Growth", "Scaling"] else (10 if stage == "Early Revenue" else 5)
    fund = 15 if profile.get("funding_requirement") and "Cr" in str(profile.get("funding_requirement")) else 8
    docs = 14 if has_gst and has_udyam else 8
    ip = 12 if has_dpiit else 6
    score = reg + compl + fund + docs + ip

    missing = []
    if not has_udyam: missing.append("Udyam (MSME) registration")
    if not has_dpiit: missing.append("DPIIT Startup India recognition")
    if not has_gst: missing.append("GST registration (if applicable)")
    if score < 70: missing.append("Trademark filing")

    return {
        "roadmap": {
            "30_days": [
                f"Complete missing registrations: {', '.join(missing[:3]) if missing else 'maintain existing'}",
                "Set up compliance calendar — GSTR-1 (11th), GSTR-3B (20th), PF/ESI (15th)",
                f"Apply to {_state_schemes(state)[0]}",
                "Open / verify business bank account with current account features",
            ],
            "90_days": [
                "File trademark in primary class + defensive class",
                f"Hire {max(2, emp)} core team members with employment contracts",
                "Set up accounting (Zoho/Tally) + monthly book-keeping",
                "Apply for Udyam + DPIIT if not done",
            ],
            "180_days": [
                "Establish vendor / supplier contracts with clear payment terms",
                "Build investor pipeline — 30 warm intros, 10 meetings",
                "Implement quarterly compliance review with CA",
                "Customer cohort analysis + retention metrics dashboard",
            ],
            "365_days": [
                "Close seed funding round (target close in month 9-12)",
                "Achieve consistent monthly profitability or clear path to it",
                "Board governance — quarterly board meetings, audit committee",
                "Year-1 financial audit and ITR-6 filing",
                f"Expand to second state from {state}",
            ],
        },
        "compliance_checklist": [
            {"item": "GSTR-1 monthly filing by 11th", "priority": "high", "due": "Monthly"},
            {"item": "GSTR-3B monthly filing by 20th", "priority": "high", "due": "Monthly"},
            {"item": "TDS quarterly return (Form 24Q/26Q)", "priority": "high", "due": "Quarterly"},
            {"item": "MCA AOC-4 + MGT-7 (annual)", "priority": "high", "due": "Yearly"},
            {"item": "Director KYC (DIR-3 KYC) by 30 Sep", "priority": "medium", "due": "Yearly"},
            {"item": "Income Tax Return (ITR-6) by 31 Oct", "priority": "high", "due": "Yearly"},
        ],
        "government_benefits": _state_schemes(state)[:5],
        "registrations": [
            {"name": "Udyam (MSME)", "why": "Unlocks CGTMSE, PMEGP and 50%+ MSME schemes"},
            {"name": "DPIIT Startup India", "why": "3-year tax holiday u/s 80-IAC, ₹4,500 trademark fee, scheme access"},
            {"name": "GST", "why": "Mandatory for goods >₹40L turnover or interstate / marketplace sales"},
            {"name": f"{state} state startup portal", "why": "Required for state-specific grants"},
        ],
        "msme_eligibility": {
            "eligible": True,
            "category": "Micro" if emp < 10 else ("Small" if emp < 50 else "Medium"),
            "benefits": ["50%+ subsidy on patent fees", "Priority sector lending", "Public procurement preference (25% reservation)", "Delayed payment protection under MSMED Act"],
        },
        "startup_india_eligibility": {
            "eligible": True,
            "reasons": ["Indian entity < 10 years old", "Turnover < ₹100 Cr", f"{industry} is recognised innovation domain"],
            "next_steps": ["Apply at startupindia.gov.in", "Upload incorporation + brief on innovation", "Get DPIIT certificate (5-15 days)"],
        },
        "trademark": {
            "recommended": True,
            "classes": {"Beauty & Skincare": [3, 5], "FoodTech / F&B": [29, 30], "AI / SaaS": [9, 42]}.get(industry, [35]),
            "rationale": f"India follows first-to-file. Filing your brand under {industry} primary class + class 35 (business services) covers 90% of use cases at ₹4,500/class for DPIIT startups.",
        },
        "health_score": {
            "score": score,
            "factors": {"registrations": reg, "compliance": compl, "funding_readiness": fund, "documentation": docs, "ip": ip},
            "missing": missing,
            "actions": [
                "Apply for Udyam (free, same day)" if not has_udyam else "Maintain Udyam annual update",
                "DPIIT Startup India recognition" if not has_dpiit else "Apply for 80-IAC tax exemption",
                "File trademark in priority class",
                "Set up compliance calendar with alerts",
            ],
        },
    }


def validate_idea_demo(idea: str, industry: str, state: str) -> dict:
    return {
        "market_potential": {
            "size": f"₹50,000+ Cr Indian {industry} market (FY25 est.)",
            "growth": "18-25% CAGR over the next 5 years",
            "tam_sam_som": "TAM: ₹50,000 Cr | SAM: ₹5,000 Cr | SOM (yr-3): ₹50-150 Cr",
        },
        "strengths": [
            "Underserved segment with growing demand",
            f"Favourable regulatory environment in {state}",
            "Founder familiarity with target customer pain",
            "Asset-light model with quick iteration cycles",
            "Multiple monetization paths (subscription, marketplace, services)",
        ],
        "weaknesses": [
            "High customer acquisition cost in early stage",
            "Long sales cycle if B2B",
            "Brand trust takes 12-18 months to build",
            "Capital requirement scales with geographic expansion",
        ],
        "risks": [
            "Larger incumbents may copy quickly",
            "Regulatory shifts in tax / e-commerce policy",
            "Talent retention as you scale to 50+ employees",
            "Dependence on a few key channels (Amazon, Google Ads, etc.)",
        ],
        "improvements": [
            "Narrow ICP to one niche before broadening",
            "Build a moat through proprietary data / community",
            "Set up referral programme from day 1",
            "Lock in 2-3 strategic distribution partners early",
            "Document IP and file trademark in week 1",
        ],
        "competitors": [
            f"3-5 well-funded Indian {industry} startups currently raising Series A-B",
            "International players entering India via partnerships",
            "Legacy offline players digitising rapidly",
        ],
        "verdict": {"score": 7, "summary": f"Strong fundamentals for an Indian {industry} play. Execution and timing matter more than the idea itself — focus on first 100 paying customers."},
    }


def trademark_demo(name: str, industry: str) -> dict:
    cls_map = {
        "Beauty & Skincare": [(3, "Cosmetics, non-medicated skincare"), (5, "Medicated / Ayurvedic preparations")],
        "FoodTech / F&B": [(29, "Processed food"), (30, "Coffee, tea, snacks"), (43, "Restaurant services")],
        "AI / SaaS": [(9, "Software, downloadable apps"), (42, "SaaS, cloud computing services")],
        "Manufacturing": [(7, "Machinery"), (35, "Business services")],
        "Healthcare & Clinic": [(5, "Pharmaceuticals"), (44, "Medical / healthcare services")],
        "Construction & Labour": [(37, "Construction services"), (35, "Business consultancy")],
        "EdTech": [(41, "Education services"), (9, "Educational software")],
        "FinTech": [(36, "Financial services"), (9, "Financial software")],
    }
    cls = cls_map.get(industry, [(35, "Business services"), (42, "Tech & design")])
    return {
        "recommended_classes": [{"class": c, "covers": cov} for c, cov in cls],
        "suggestions": [
            f"File '{name}' first in your primary class — within 7 days of incorporation",
            "Do a free TM search on ipindia.gov.in before filing",
            "File via TM-A form (online); use DPIIT startup discount (₹4,500 vs ₹9,000)",
            "Also register a defensive .in domain and social handles",
            "Use ™ from day 1; ® only after registration (12-24 months)",
            "Keep evidence of first use (invoices, ads) for opposition defence",
        ],
        "ip_checklist": [
            "Trademark filing under primary class",
            "Copyright on creative content (auto-protected; file for stronger evidence)",
            "Design registration for unique product packaging / UI",
            "NDA + IP assignment in every employment & contractor contract",
            "Source code escrow / private repository policy",
            "Domain & handle registration across IN, COM, social platforms",
            "Trade secret policy — server access, data classification",
            "Patent feasibility evaluation (if novel technical method exists)",
        ],
        "patent_opportunity": {
            "likely": industry in ["AI / SaaS", "HealthTech", "Manufacturing", "Renewable Energy"],
            "rationale": "Process / device / system patents are filed in India under the Patents Act 1970. Provisional filing locks in priority date for 12 months.",
        },
        "estimated_cost": "₹4,500/class for DPIIT-recognised startups (Individual rate); ₹9,000/class otherwise. Add ~₹3,000 attorney fee per class.",
        "timeline": "Examination in 6-8 months; registration in 12-24 months if no opposition.",
    }


# ---------- Copilot topic handlers (one per topic; keeps copilot_demo simple) ----------

def _topic_gst_penalty(_q: str, _ctx: dict) -> str:
    return "If you miss GST filing:\n• GSTR-1 / GSTR-3B late fee is ₹50/day (₹20/day for NIL returns), capped at ₹10,000.\n• Interest at 18% p.a. on unpaid tax.\n• 3 consecutive missed returns → GSTIN may be suspended.\n• Input Tax Credit (ITC) blocked till you file.\n\nSet calendar reminders for the 11th and 20th of every month."

def _topic_gst(q: str, ctx: dict) -> str:
    industry = _pick(ctx, "industry", "")
    needs_gst = industry in ["D2C / E-commerce", "Beauty & Skincare", "Fashion & Apparel", "FoodTech / F&B", "Manufacturing", "Retail"] or "e-commerce" in q
    verdict = "GST registration is **recommended** now" if needs_gst else "GST is **not yet mandatory**"
    return f"{verdict}.\n\n• Goods threshold: ₹40 Lakh turnover\n• Services threshold: ₹20 Lakh\n• Mandatory from Day 1 if: interstate sales, e-commerce (Amazon/Flipkart/Nykaa), reverse-charge applicability.\n\nAlso consider **Udyam registration** (free) for MSME benefits and **Trademark** filing to protect your brand."

def _topic_structure(_q: str, _ctx: dict) -> str:
    return "For your context, **Private Limited Company** is typically the right choice because:\n\n• Limited liability for founders\n• Required by VCs for equity rounds, ESOPs, SAFE/CCD instruments\n• DPIIT Startup India recognition possible → 3-year tax holiday u/s 80-IAC\n• Easier to add co-founders and investors via share transfer\n\nLLP is good if you have 2-4 partners, no VC plans, and prefer partnership flexibility."

def _topic_udyam(_q: str, _ctx: dict) -> str:
    return "**Udyam Registration** is the official MSME registration:\n\n• Free, online, takes <1 day on udyamregistration.gov.in\n• Required to access CGTMSE, PMEGP, Mudra, and 50+ MSME schemes\n• 50% subsidy on patent and trademark fees\n• Priority sector lending from banks\n• Protection under MSMED Act for delayed payments (45-day rule)\n\nApply within the first 30 days of incorporation."

def _topic_startup_india(_q: str, _ctx: dict) -> str:
    return "**DPIIT Startup India Recognition**:\n\n• Apply free at startupindia.gov.in\n• Eligibility: Indian Pvt Ltd / LLP / Partnership < 10 years, turnover < ₹100 Cr, working on innovation/improvement\n• Benefits: 3-year income tax holiday (80-IAC), self-certification on labour & environment laws, ₹4,500 trademark fee (vs ₹9,000), faster patent examination, access to ₹50L Seed Fund\n• Timeline: 5-15 days after submitting incorporation cert + 1-2 page description of innovation"

def _topic_compliance_overview(_q: str, ctx: dict) -> str:
    emp = _pick(ctx, "employee_count", 0)
    state = _pick(ctx, "state", "your state")
    labour = "**Labour**: PF & ESI monthly by 15th, PT state-specific\n" if emp and int(emp or 0) >= 10 else ""
    return "Your core compliance stack:\n\n**GST**: GSTR-1 (11th monthly), GSTR-3B (20th monthly), GSTR-9 (annual)\n**Income Tax**: ITR-6 (31 Oct), Form 3CD audit, Advance Tax (quarterly)\n**TDS**: Form 24Q/26Q (quarterly), Form 16/16A\n**MCA**: AOC-4 (financials), MGT-7 (annual return), DIR-3 KYC, board meetings\n" + labour + f"**State**: Profession Tax, Shops & Establishments renewal, {state} specific filings"

def _topic_mca(_q: str, _ctx: dict) -> str:
    return "**MCA annual filings** for a Pvt Ltd company:\n\n• **AOC-4** — financial statements within 30 days of AGM (~30 Oct)\n• **MGT-7** — annual return within 60 days of AGM (~29 Nov)\n• **DIR-3 KYC** — director KYC by 30 Sep every year\n• **DPT-3** — return of deposits (if applicable)\n• **MSME-1** — half-yearly report on dues to MSMEs\n\nPenalty: ₹100/day with no upper cap. Don't skip these."

def _topic_tax_filing(_q: str, _ctx: dict) -> str:
    return "**Tax filing timeline**:\n\n• **Advance Tax**: 15 Jun (15%), 15 Sep (45%), 15 Dec (75%), 15 Mar (100%)\n• **ITR-6** for companies: 31 Oct of assessment year\n• **TDS** quarterly returns: 31 Jul / 31 Oct / 31 Jan / 31 May\n• **GST annual** GSTR-9: 31 Dec following financial year\n\nIf turnover > ₹1 Cr (or ₹10 Cr if 95% digital), **tax audit u/s 44AB** is mandatory."

def _topic_funding(_q: str, ctx: dict) -> str:
    state = _pick(ctx, "state", "your state")
    stage = _pick(ctx, "stage", "your stage")
    return f"**Funding ladder for {stage} stage**:\n\n1. **Bootstrap / FFF** — friends, family, founder savings\n2. **Government grants** — {_state_schemes(state)[0]}, Startup India Seed Fund (₹20L grant + ₹50L convertible)\n3. **Loans** — Mudra (up to ₹20L), CGTMSE (up to ₹5 Cr, no collateral)\n4. **Angels** — Indian Angel Network, LetsVenture, AngelList India — typical cheque ₹25L-₹2 Cr\n5. **Pre-seed/Seed VCs** — Better Capital, AntlerIndia, SmileGroup, Blume — ₹1-5 Cr\n\nPrepare a 12-slide deck, 3-year financial model, and unit economics before reaching out."

def _topic_mudra(_q: str, _ctx: dict) -> str:
    return "**PM Mudra Yojana**:\n\n• Collateral-free loan for non-corporate, non-farm small enterprises\n• Categories: Shishu (≤₹50K), Kishore (≤₹5L), Tarun (≤₹10L), Tarun Plus (₹10-20L)\n• Apply at any bank, RRB, or via udyamimitra.in\n• Documents: Aadhaar, PAN, business plan, quotations\n• Eligible: Indian citizen, viable business plan, no defaulter history\n\nProcessing: 7-30 days."

def _topic_schemes(_q: str, ctx: dict) -> str:
    state = _pick(ctx, "state", "your state")
    return "**Top schemes you should evaluate**:\n\n" + "\n".join([f"• {s}" for s in _state_schemes(state)[:6]]) + "\n\nFor most, you'll need: Udyam registration, DPIIT recognition, GST, and a 2-3 page concept note."

def _topic_license(_q: str, ctx: dict) -> str:
    industry = _pick(ctx, "industry", "")
    licenses_for = {
        "FoodTech / F&B": "FSSAI License (mandatory) — Basic / State / Central based on turnover",
        "Manufacturing": "Factory License + Pollution Control NOC + BIS (if applicable)",
        "Construction & Labour": "Contract Labour License (CLRA) + BOCW + PF/ESI",
        "Healthcare & Clinic": "Clinical Establishment License + Bio-medical Waste authorization",
    }
    specific = licenses_for.get(industry, "Trade License (Municipal) + Shops & Establishments")
    return f"**Industry-specific licenses**:\n\n• {specific}\n• GST Registration (turnover/interstate trigger)\n• Udyam (MSME) — free\n• Trademark — protect brand\n• Import-Export Code (IEC) if you ever import/export\n\nGet these before starting operations to avoid back-dated penalties."

def _topic_fssai(_q: str, _ctx: dict) -> str:
    return "**FSSAI License** is mandatory for any food business:\n\n• **Basic** (turnover < ₹12L): ₹100/year — registration\n• **State** (₹12L-₹20Cr): ₹2,000-₹7,500/year\n• **Central** (>₹20Cr or import/export): ₹7,500/year\n\nApply on foscos.fssai.gov.in. Timeline: 30-60 days. Display the 14-digit FSSAI number on every product label."

def _topic_labour(_q: str, _ctx: dict) -> str:
    return "**Labour licenses & registrations**:\n\n• **Contract Labour License (CLRA)** — if you engage 20+ contract workers\n• **EPF** — mandatory once you have 20+ employees (contribution: 12% employer + 12% employee on wages up to ₹15K)\n• **ESI** — mandatory once you have 10+ employees with wages ≤ ₹21K (contribution: 3.25% employer + 0.75% employee)\n• **BOCW** — for construction workers\n• **Shop & Establishments** — state-level, mandatory for all commercial premises"

def _topic_tm_class(_q: str, _ctx: dict) -> str:
    return "**Trademark classes** are based on the Nice Classification (45 classes):\n\nFor a typical Indian startup, file in:\n• Your **product/service primary class** (e.g., Class 3 for cosmetics, Class 9 for software, Class 30 for food)\n• **Class 35** (advertising, business services) — covers e-commerce sale of any goods\n• Optionally **Class 42** (design & tech) if you have a tech component\n\nFee: ₹4,500/class for DPIIT startup, ₹9,000 otherwise. Multi-class filing is one form."

def _topic_trademark(_q: str, _ctx: dict) -> str:
    return "**Yes, you should register your trademark.** India follows first-to-file:\n\n• File within 7 days of incorporation\n• Use TM-A form on ipindia.gov.in\n• ₹4,500/class (DPIIT startup) — typically file 1-2 classes\n• Use ™ from day 1; ® after registration (12-24 months)\n• Search the existing TM database before filing\n\nAlso consider domain (.in & .com), social handles, and copyright on creative material."

def _topic_patent(_q: str, _ctx: dict) -> str:
    return "**Patent in India**:\n\n• Filed under the Patents Act 1970 at the Indian Patent Office\n• Eligibility: novelty + inventive step + industrial applicability\n• **Provisional patent**: ₹1,600 (startup) — locks priority date for 12 months\n• Complete specification within 12 months\n• Examination: request within 48 months; grants in 3-5 years on average\n• DPIIT startups get 80% rebate and expedited examination\n\nDo a prior art search on patents.google.com first."

def _topic_year1(_q: str, _ctx: dict) -> str:
    return "**Year-1 priorities (in order)**:\n\n1. **Customers > everything else** — get 50-100 paying users; ignore vanity metrics\n2. **Compliance from day 1** — GST + Udyam + DPIIT + accounting hygiene\n3. **Cash discipline** — 12-month runway minimum; track burn weekly\n4. **Team of 3-5 A-players** — equity-share early, document via ESOP pool\n5. **One channel, mastered** — don't spread thin across Instagram + Google + offline\n6. **Trademark + IP** — file within first month\n7. **Investor narrative** — start building it from month 6, even if not raising\n\nMost startups die from poor cash management, not bad ideas."

def _topic_hire(_q: str, ctx: dict) -> str:
    state = _pick(ctx, "state", "your state")
    return f"**Hiring legally in India**:\n\n• **Offer letter + employment contract** with IP assignment + NDA\n• **PAN, Aadhaar, bank details** collected for payroll\n• **EPF** (mandatory once 20+ employees) — register on epfindia.gov.in\n• **ESI** (mandatory once 10+ employees with wages ≤ ₹21K)\n• **Professional Tax** ({state} specific deduction)\n• **TDS** deduction u/s 192 + Form 16 issuance\n• **Gratuity** payable after 5 years of service\n\nUse a payroll tool (RazorpayX Payroll, Zoho Payroll) from day 1."

def _topic_scale(_q: str, _ctx: dict) -> str:
    return "**Scaling playbook**:\n\n1. **Validate unit economics first** — LTV / CAC ≥ 3:1, gross margin > 50%\n2. **Document SOPs** — onboarding, sales, ops — before adding people\n3. **One new city / state at a time** — measure 90 days before next\n4. **Hire ahead of pain** — finance, ops, customer success roles\n5. **Compliance scales with team** — PF/ESI kick in at 10-20 employees\n6. **Capital plan** — raise 18 months of runway, not 6\n7. **Board governance** — quarterly board meetings, monthly investor updates"

def _topic_default(_q: str, ctx: dict) -> str:
    state = _pick(ctx, "state", "your state")
    industry = _pick(ctx, "industry", "your industry")
    stage = _pick(ctx, "stage", "your stage")
    return f"That's a great question for a {stage}-stage {industry} startup in {state}.\n\nWhile I'd love to give a deep custom answer, here are general principles:\n\n• Most Indian founder questions trace back to 4 themes: **structure, compliance, IP, funding**\n• Always start with **Udyam + DPIIT + GST** — these unlock 80% of benefits\n• {_state_schemes(state)[0]} is likely the highest-leverage scheme for you\n• Set up monthly compliance calendar; missing dates costs more than doing them\n\nAsk a specific follow-up (GST? company structure? funding? compliance? trademark?) and I'll go deeper."


def _has_any(q: str, words: tuple) -> bool:
    return any(w in q for w in words)


# (predicate, handler) — first match wins
_COPILOT_TOPICS = [
    (lambda q: "gst" in q and _has_any(q, ("miss", "penalty", "deadline")), _topic_gst_penalty),
    (lambda q: "gst" in q, _topic_gst),
    (lambda q: _has_any(q, ("structure", "llp", "pvt", "private limited")), _topic_structure),
    (lambda q: _has_any(q, ("udyam", "msme")), _topic_udyam),
    (lambda q: _has_any(q, ("startup india", "dpiit", "recognition")), _topic_startup_india),
    (lambda q: "compliance" in q and _has_any(q, ("what", "which", "apply")), _topic_compliance_overview),
    (lambda q: "mca" in q, _topic_mca),
    (lambda q: "tax" in q and _has_any(q, ("file", "when")), _topic_tax_filing),
    (lambda q: _has_any(q, ("fund", "raise", "investor")), _topic_funding),
    (lambda q: "mudra" in q, _topic_mudra),
    (lambda q: _has_any(q, ("scheme", "grant", "benefit", "eligibl")), _topic_schemes),
    (lambda q: "fssai" in q, _topic_fssai),
    (lambda q: "license" in q, _topic_license),
    (lambda q: "labour" in q, _topic_labour),
    (lambda q: "trademark" in q and "class" in q, _topic_tm_class),
    (lambda q: _has_any(q, ("trademark", "brand")), _topic_trademark),
    (lambda q: "patent" in q, _topic_patent),
    (lambda q: _has_any(q, ("first year", "year 1", "focus")), _topic_year1),
    (lambda q: _has_any(q, ("hire", "employee")), _topic_hire),
    (lambda q: _has_any(q, ("expand", "scale", "grow")), _topic_scale),
]


def _prelude(ctx: dict) -> str:
    industry = _pick(ctx, "industry", "your industry")
    state = _pick(ctx, "state", "your state")
    stage = _pick(ctx, "stage", "your stage")
    turnover = _pick(ctx, "annual_turnover", "")
    turn_part = f" with expected turnover {turnover}" if turnover else ""
    return f"Based on your {industry} startup at {stage} stage in {state}{turn_part}:\n\n"


_TAIL = "\n\n*Educational guidance only. Consult a qualified CA/CS before binding decisions.*"


def copilot_demo(question: str, ctx: dict) -> str:
    q = (question or "").lower()
    body = next((h(q, ctx) for pred, h in _COPILOT_TOPICS if pred(q)), _topic_default(q, ctx))
    return _prelude(ctx) + body + _TAIL
