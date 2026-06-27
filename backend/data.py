"""Static datasets for Bharat Startup Desk MVP."""

INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Chandigarh", "Puducherry",
    "Andaman and Nicobar Islands", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep"
]

INDUSTRIES = [
    "AI / SaaS", "FinTech", "EdTech", "HealthTech", "D2C / E-commerce",
    "FoodTech / F&B", "Manufacturing", "Construction & Labour", "Logistics",
    "AgriTech", "Renewable Energy", "Real Estate", "Media & Entertainment",
    "Hospitality", "Retail", "Healthcare & Clinic", "Fashion & Apparel",
    "Beauty & Skincare", "Automotive", "Consulting / Services"
]

STARTUP_STAGES = ["Aspiring", "Idea", "MVP", "Early Revenue", "Growth", "Scaling"]

COMPANY_TYPES = [
    "Sole Proprietorship", "Partnership", "LLP", "Private Limited Company",
    "One Person Company (OPC)", "Public Limited Company", "Section 8 (Non-profit)"
]

SCHEMES = [
    {
        "id": "startup-india",
        "name": "Startup India Seed Fund Scheme (SISFS)",
        "category": "Funding",
        "issuing_body": "DPIIT, Government of India",
        "eligibility": "DPIIT recognized startups incorporated < 2 years ago. Indian promoter holding >= 51%.",
        "benefits": "Up to ₹20 Lakh as grant for proof of concept; up to ₹50 Lakh for market entry/commercialization via convertible debentures.",
        "documents": ["DPIIT Recognition Certificate", "Certificate of Incorporation", "PAN", "Bank Account Details", "Pitch Deck", "Founder KYC"],
        "process": "Apply via seedfund.startupindia.gov.in → Choose incubator → Submit application → Pitch → Disbursement",
        "states": ["All"],
        "industries": ["All"],
        "stages": ["Idea", "MVP", "Early Revenue"],
        "website": "https://seedfund.startupindia.gov.in"
    },
    {
        "id": "cgtmse",
        "name": "CGTMSE - Credit Guarantee Fund for MSMEs",
        "category": "Loan Guarantee",
        "issuing_body": "Ministry of MSME + SIDBI",
        "eligibility": "New & existing MSMEs in manufacturing/services. Collateral-free loans up to ₹5 Cr.",
        "benefits": "Credit guarantee cover of 75-85% on loans up to ₹5 Cr without collateral.",
        "documents": ["Udyam Registration", "Project Report", "GST Certificate", "Last 2 yr ITR", "Bank Statement"],
        "process": "Apply through any member lending institution (banks/NBFCs) → Loan appraisal → CGTMSE guarantee approval",
        "states": ["All"],
        "industries": ["Manufacturing", "Logistics", "Construction & Labour", "Retail", "Consulting / Services"],
        "stages": ["MVP", "Early Revenue", "Growth", "Scaling"],
        "website": "https://www.cgtmse.in"
    },
    {
        "id": "mudra",
        "name": "PM MUDRA Yojana",
        "category": "Loan",
        "issuing_body": "MUDRA, Government of India",
        "eligibility": "Non-corporate, non-farm micro/small enterprises. Indian citizen with business plan.",
        "benefits": "Shishu (≤₹50K), Kishore (≤₹5L), Tarun (≤₹10L), Tarun Plus (₹10L-₹20L) collateral-free loans.",
        "documents": ["Aadhaar", "PAN", "Business Plan", "Address Proof", "Quotations for Machinery"],
        "process": "Apply at any public/private bank, RRB, MFI or via udyamimitra.in",
        "states": ["All"],
        "industries": ["All"],
        "stages": ["Aspiring", "Idea", "MVP", "Early Revenue"],
        "website": "https://www.mudra.org.in"
    },
    {
        "id": "pmegp",
        "name": "PMEGP - Prime Minister Employment Generation Programme",
        "category": "Subsidy + Loan",
        "issuing_body": "KVIC, Ministry of MSME",
        "eligibility": "Individuals > 18 yrs. Manufacturing project up to ₹50L, services up to ₹20L. Min 8th pass for projects > ₹10L (mfg) / ₹5L (services).",
        "benefits": "Subsidy 15-35% of project cost (higher for SC/ST/Women/NER).",
        "documents": ["Aadhaar", "PAN", "Project Report", "Caste Certificate (if applicable)", "Education Proof"],
        "process": "Apply on kviconline.gov.in/pmegpeportal → DIC interview → Bank sanction → Subsidy claim",
        "states": ["All"],
        "industries": ["Manufacturing", "FoodTech / F&B", "Fashion & Apparel", "Consulting / Services"],
        "stages": ["Aspiring", "Idea", "MVP"],
        "website": "https://www.kviconline.gov.in/pmegpeportal"
    },
    {
        "id": "standup-india",
        "name": "Stand-Up India",
        "category": "Loan",
        "issuing_body": "SIDBI, Government of India",
        "eligibility": "SC/ST and/or Women entrepreneurs > 18 years setting up a greenfield enterprise.",
        "benefits": "Composite loan ₹10L - ₹1Cr for greenfield enterprises in manufacturing, services, trading or agri-allied.",
        "documents": ["Aadhaar", "PAN", "Caste Certificate", "Project Report", "Address Proof"],
        "process": "Apply at standupmitra.in or any scheduled commercial bank branch",
        "states": ["All"],
        "industries": ["All"],
        "stages": ["Aspiring", "Idea", "MVP"],
        "website": "https://www.standupmitra.in"
    },
    {
        "id": "msme-champions",
        "name": "MSME Champions Scheme",
        "category": "Capacity Building",
        "issuing_body": "Ministry of MSME",
        "eligibility": "Udyam-registered MSMEs in manufacturing.",
        "benefits": "Reimbursement for technology upgradation, quality certifications (ZED, Lean), digital MSME tools.",
        "documents": ["Udyam Certificate", "Project Cost Proof", "GST"],
        "process": "Apply on champions.gov.in → Component wise application",
        "states": ["All"],
        "industries": ["Manufacturing"],
        "stages": ["Early Revenue", "Growth", "Scaling"],
        "website": "https://champions.gov.in"
    },
    {
        "id": "sidbi-fund-of-funds",
        "name": "SIDBI Fund of Funds for Startups (FFS)",
        "category": "Venture Funding",
        "issuing_body": "SIDBI",
        "eligibility": "DPIIT recognized startups — indirect funding via SEBI-registered AIFs.",
        "benefits": "Acts as fund-of-funds; SIDBI deploys up to ₹10,000 Cr to VC funds backing Indian startups.",
        "documents": ["DPIIT Certificate", "Pitch Deck", "Financial Model"],
        "process": "Apply to AIFs supported by SIDBI FFS directly",
        "states": ["All"],
        "industries": ["AI / SaaS", "FinTech", "EdTech", "HealthTech", "D2C / E-commerce"],
        "stages": ["MVP", "Early Revenue", "Growth", "Scaling"],
        "website": "https://www.sidbi.in"
    },
    {
        "id": "karnataka-elevate",
        "name": "Karnataka ELEVATE",
        "category": "State Grant",
        "issuing_body": "Department of IT/BT, Govt of Karnataka",
        "eligibility": "Karnataka-registered startups incorporated < 7 years, turnover < ₹100Cr.",
        "benefits": "Up to ₹50 Lakh grant-in-aid for innovative ideas across sectors.",
        "documents": ["KSUM Registration", "Karnataka address proof", "Pitch", "Financials"],
        "process": "Apply on elevate.karnataka.gov.in during the annual round → Jury review",
        "states": ["Karnataka"],
        "industries": ["All"],
        "stages": ["Idea", "MVP", "Early Revenue"],
        "website": "https://elevate.karnataka.gov.in"
    },
    {
        "id": "tn-startuptn",
        "name": "StartupTN Seed Grant Fund",
        "category": "State Grant",
        "issuing_body": "StartupTN, Govt of Tamil Nadu",
        "eligibility": "Tamil Nadu-registered DPIIT startups via incubator route.",
        "benefits": "Seed grant up to ₹10 Lakh; additional matching capital for women founders.",
        "documents": ["TN address proof", "DPIIT", "Incubator Recommendation"],
        "process": "Apply via incubator on startuptn.in",
        "states": ["Tamil Nadu"],
        "industries": ["All"],
        "stages": ["Idea", "MVP"],
        "website": "https://startuptn.in"
    },
    {
        "id": "maha-startup",
        "name": "Maharashtra State Innovation Fund",
        "category": "State Grant",
        "issuing_body": "MSInS, Govt of Maharashtra",
        "eligibility": "Maharashtra-registered startups recognized by DPIIT.",
        "benefits": "Grant up to ₹15 Lakh + access to Government procurement and CoEs.",
        "documents": ["Maharashtra address proof", "DPIIT", "Pitch"],
        "process": "Apply via msins.in",
        "states": ["Maharashtra"],
        "industries": ["All"],
        "stages": ["Idea", "MVP", "Early Revenue"],
        "website": "https://www.msins.in"
    },
]

STATE_BENEFITS = {
    "Karnataka": {
        "policies": ["Karnataka Startup Policy 2022-27", "Karnataka IT Policy", "ESDM Policy"],
        "grants": ["ELEVATE Grant (₹50L)", "Idea2POC Grant"],
        "subsidies": ["Stamp duty reimbursement", "Patent filing reimbursement up to ₹2L domestic / ₹10L international"],
        "incentives": ["Reimbursement of internet expenses", "Marketing support up to ₹5L"],
        "registrations": ["KSUM Karnataka Startup Cell registration", "Professional Tax", "Karnataka Shops & Establishments"],
        "professional_tax": "Applicable (₹2,500/yr employer + slabs for employees)",
        "highlight": "Bengaluru is India's largest startup hub. ELEVATE has funded 350+ startups."
    },
    "Maharashtra": {
        "policies": ["Maharashtra State Innovation & Startup Policy 2018"],
        "grants": ["MSInS Grant up to ₹15L", "Quality Testing Reimbursement"],
        "subsidies": ["Stamp duty waiver for startups", "Patent reimbursement"],
        "incentives": ["Public procurement preference", "5% relaxation on EMD/turnover"],
        "registrations": ["MSInS Startup Registration", "Maharashtra Profession Tax", "Shop Act License"],
        "professional_tax": "Applicable (₹2,500/yr employer)",
        "highlight": "Mumbai-Pune corridor. Strong fintech and D2C ecosystem."
    },
    "Tamil Nadu": {
        "policies": ["Tamil Nadu Startup & Innovation Policy 2023"],
        "grants": ["StartupTN Seed Grant ₹10L", "Women Founder Matching Capital"],
        "subsidies": ["Patent reimbursement ₹2L", "IP filing support"],
        "incentives": ["Coworking subsidy", "Govt procurement reservation"],
        "registrations": ["StartupTN Portal Registration", "TN Profession Tax", "Shop & Establishment"],
        "professional_tax": "Applicable",
        "highlight": "Chennai is a deeptech and hardware powerhouse."
    },
    "Telangana": {
        "policies": ["TS Innovation Policy", "T-Hub framework"],
        "grants": ["T-Fund support via T-Hub", "WE-Hub women grants"],
        "subsidies": ["SGST refund for IT companies", "Power tariff subsidy"],
        "incentives": ["Rental reimbursement", "Stamp duty refund"],
        "registrations": ["TSiPASS", "TS Profession Tax", "Shops & Estb"],
        "professional_tax": "Applicable",
        "highlight": "T-Hub is Asia's largest startup incubator."
    },
    "Gujarat": {
        "policies": ["Gujarat IT/ITeS Policy 2022", "Gujarat Startup Policy"],
        "grants": ["Seed support up to ₹30L via SSIP", "Sustenance allowance ₹20K/month for 1 year"],
        "subsidies": ["EPF reimbursement", "Lease rental subsidy"],
        "incentives": ["Free office space in iHub", "Marketing assistance"],
        "registrations": ["SSIP Registration", "Gujarat Profession Tax", "Shop Act"],
        "professional_tax": "Applicable",
        "highlight": "Strong on manufacturing, chemicals, and GIFT City fintech."
    },
}

COMPLIANCES = [
    {"id": "gst-r1", "name": "GSTR-1 (Outward supplies)", "frequency": "Monthly", "due_day": 11, "applicability": "All GST-registered businesses with turnover > ₹5 Cr (or opted monthly)", "penalty": "₹50/day (₹20/day for NIL); 18% interest", "documents": ["Sales invoices", "Credit/Debit notes"], "category": "GST"},
    {"id": "gst-3b", "name": "GSTR-3B (Summary return)", "frequency": "Monthly", "due_day": 20, "applicability": "All GST-registered", "penalty": "₹50/day + 18% interest on tax due", "documents": ["Sales summary", "ITC details", "Tax payment challan"], "category": "GST"},
    {"id": "tds-q", "name": "TDS Quarterly Return (Form 24Q/26Q)", "frequency": "Quarterly", "due_day": 31, "applicability": "Entities deducting TDS", "penalty": "₹200/day under Sec 234E + ₹10K-₹1L under 271H", "documents": ["TDS challans", "PANs of deductees"], "category": "Income Tax"},
    {"id": "itr-co", "name": "Company Income Tax Return (ITR-6)", "frequency": "Yearly", "due_day": 31, "due_month": 10, "applicability": "All companies", "penalty": "₹5,000 - ₹10,000 under 234F + interest", "documents": ["Audited financials", "Form 3CD", "Form 3CA/CB"], "category": "Income Tax"},
    {"id": "mca-aoc4", "name": "MCA Form AOC-4 (Financial statements)", "frequency": "Yearly", "due_day": 30, "due_month": 10, "applicability": "All companies (within 30 days of AGM)", "penalty": "₹100/day with no upper cap", "documents": ["Audited Financials", "Board's Report", "AGM Minutes"], "category": "MCA"},
    {"id": "mca-mgt7", "name": "MCA Form MGT-7 (Annual Return)", "frequency": "Yearly", "due_day": 29, "due_month": 11, "applicability": "All companies (within 60 days of AGM)", "penalty": "₹100/day", "documents": ["Shareholding details", "Directors info"], "category": "MCA"},
    {"id": "dir-kyc", "name": "Director KYC (DIR-3 KYC)", "frequency": "Yearly", "due_day": 30, "due_month": 9, "applicability": "All directors with DIN", "penalty": "₹5,000 + DIN deactivation", "documents": ["Aadhaar OTP", "PAN", "Email/Mobile"], "category": "MCA"},
    {"id": "pf", "name": "EPF Monthly Filing (ECR)", "frequency": "Monthly", "due_day": 15, "applicability": "Establishments with 20+ employees", "penalty": "12-25% damages + 12% interest", "documents": ["Wage register", "ECR Challan"], "category": "Labour"},
    {"id": "esi", "name": "ESI Contribution", "frequency": "Monthly", "due_day": 15, "applicability": "Establishments with 10+ employees (wages ≤ ₹21K)", "penalty": "12% simple interest p.a.", "documents": ["ESI Challan", "Wage register"], "category": "Labour"},
    {"id": "pt", "name": "Professional Tax Return", "frequency": "Monthly", "due_day": 21, "applicability": "State-specific (KA, MH, TN, WB, etc.)", "penalty": "₹300-₹1000 + interest", "documents": ["Salary register", "PT Challan"], "category": "State"},
]

LICENSES = [
    {"id": "gst-reg", "name": "GST Registration", "industries": ["All"], "trigger": "Turnover > ₹40L (goods) / ₹20L (services), or interstate sales, or e-commerce", "authority": "GSTN", "timeline": "3-7 working days", "cost": "Free (govt) / ₹2-5K (CA)"},
    {"id": "udyam", "name": "Udyam Registration (MSME)", "industries": ["All"], "trigger": "Any MSME (Micro/Small/Medium)", "authority": "Ministry of MSME", "timeline": "Same day", "cost": "Free"},
    {"id": "fssai", "name": "FSSAI License", "industries": ["FoodTech / F&B"], "trigger": "Any food business", "authority": "Food Safety & Standards Authority", "timeline": "30-60 days", "cost": "₹100/yr (Basic), ₹2K-7.5K/yr (State), ₹7.5K/yr (Central)"},
    {"id": "trademark", "name": "Trademark Registration", "industries": ["All"], "trigger": "Brand name / logo protection", "authority": "IP India / CGPDTM", "timeline": "12-24 months", "cost": "₹4,500 (Individual/Startup) / ₹9,000 (Others) per class"},
    {"id": "labour-license", "name": "Contract Labour License (CLRA)", "industries": ["Construction & Labour", "Manufacturing"], "trigger": "20+ contract workers", "authority": "Labour Commissioner (State)", "timeline": "30 days", "cost": "₹100-₹500 per worker"},
    {"id": "factory-license", "name": "Factory License", "industries": ["Manufacturing"], "trigger": "Manufacturing premises with 10+ workers (with power) or 20+ (without power)", "authority": "Chief Inspector of Factories", "timeline": "30-60 days", "cost": "₹2K-₹50K based on workers"},
    {"id": "pollution-noc", "name": "Pollution Control NOC (Consent to Establish / Operate)", "industries": ["Manufacturing", "Construction & Labour"], "trigger": "Industries categorized Red/Orange/Green by CPCB", "authority": "State Pollution Control Board", "timeline": "30-90 days", "cost": "Varies by category"},
    {"id": "shop-act", "name": "Shops & Establishments License", "industries": ["All"], "trigger": "Any commercial establishment", "authority": "Labour Department (State)", "timeline": "7-30 days", "cost": "₹500-₹10,000"},
    {"id": "iec", "name": "Import Export Code (IEC)", "industries": ["All"], "trigger": "Any import/export activity", "authority": "DGFT", "timeline": "1-3 days", "cost": "₹500"},
    {"id": "clinical-est", "name": "Clinical Establishment License", "industries": ["Healthcare & Clinic"], "trigger": "Clinics, hospitals, diagnostic labs", "authority": "State Health Dept", "timeline": "30-90 days", "cost": "₹5K-₹50K"},
    {"id": "drug-license", "name": "Drug License", "industries": ["Healthcare & Clinic"], "trigger": "Pharmacy / drug trading", "authority": "State Drug Controller", "timeline": "30-45 days", "cost": "₹3K-₹10K"},
    {"id": "dpiit", "name": "DPIIT Startup Recognition", "industries": ["All"], "trigger": "Innovation-driven startup < 10 yrs old, turnover < ₹100Cr", "authority": "DPIIT", "timeline": "5-15 days", "cost": "Free"},
    {"id": "ce", "name": "BIS / ISI Certification", "industries": ["Manufacturing"], "trigger": "Products under mandatory BIS list", "authority": "Bureau of Indian Standards", "timeline": "4-6 months", "cost": "₹35K + audit charges"},
]

DEMO_STARTUPS = [
    {
        "id": "demo-ai-saas",
        "name": "NeuralForge AI",
        "stage": "Idea",
        "industry": "AI / SaaS",
        "state": "Karnataka",
        "operation_state": "Karnataka",
        "company_type": "Private Limited Company",
        "incorporated_on": "2025-08-12",
        "annual_turnover": "0-25L",
        "employee_count": 4,
        "business_model": "B2B SaaS subscription",
        "funding_requirement": "₹50 Lakh seed",
        "description": "AI agent platform that automates customer support for Indian D2C brands using fine-tuned LLMs in 12 Indian languages.",
        "cin": "U72200KA2025PTC176342",
        "gstin": "29ABCDE1234F1Z5",
        "udyam": "UDYAM-KR-03-0123456",
        "dpiit": "DIPP-198273",
    },
    {
        "id": "demo-d2c-skincare",
        "name": "AyurGlow Naturals",
        "stage": "Early Revenue",
        "industry": "Beauty & Skincare",
        "state": "Maharashtra",
        "operation_state": "Maharashtra",
        "company_type": "Private Limited Company",
        "incorporated_on": "2023-04-18",
        "annual_turnover": "1-5Cr",
        "employee_count": 18,
        "business_model": "D2C E-commerce + select retail",
        "funding_requirement": "₹3 Crore Series A",
        "description": "D2C men's skincare brand combining clinical actives with Ayurvedic heritage; selling on own site, Amazon, Nykaa and 80+ retail stores.",
        "cin": "U24290MH2023PTC405211",
        "gstin": "27FGHIJ5678K2Z9",
        "udyam": "UDYAM-MH-01-0098721",
        "dpiit": "DIPP-145667",
    },
    {
        "id": "demo-mfg",
        "name": "Karnataka Precision Forge",
        "stage": "Growth",
        "industry": "Manufacturing",
        "state": "Karnataka",
        "operation_state": "Karnataka",
        "company_type": "Private Limited Company",
        "incorporated_on": "2019-11-02",
        "annual_turnover": "10-25Cr",
        "employee_count": 64,
        "business_model": "B2B contract manufacturing for auto OEMs",
        "funding_requirement": "₹8 Crore growth capital",
        "description": "Precision-forged automotive components for two-wheeler OEMs in Karnataka; ISO 9001 certified, working towards IATF 16949.",
        "cin": "U28910KA2019PTC129801",
        "gstin": "29KLMNO9012P3Z1",
        "udyam": "UDYAM-KR-03-0045123",
        "dpiit": None,
    },
]


def list_states():
    return INDIAN_STATES


def list_industries():
    return INDUSTRIES


def get_state_benefits(state: str):
    return STATE_BENEFITS.get(state, {
        "policies": [f"{state} State Startup Policy (refer state IT/MSME department)"],
        "grants": ["State-specific seed grants via local incubators"],
        "subsidies": ["Stamp duty reimbursement (typical)", "Patent filing reimbursement (typical)"],
        "incentives": ["Power tariff benefits", "Capital subsidy on machinery"],
        "registrations": ["State Startup Cell Registration", "Profession Tax", "Shops & Establishments"],
        "professional_tax": "Check with state Profession Tax department",
        "highlight": f"Refer to {state} state government's Industries / IT department portal for full benefits."
    })


def recommend_schemes(state: str, industry: str, stage: str, company_type: str | None = None):
    out = []
    for s in SCHEMES:
        if s["states"] != ["All"] and state not in s["states"]:
            continue
        if s["industries"] != ["All"] and industry not in s["industries"]:
            continue
        if s["stages"] != ["All"] and stage not in s["stages"]:
            continue
        out.append(s)
    return out


def recommend_licenses(industry: str, state: str | None = None):
    out = []
    for lic in LICENSES:
        if "All" in lic["industries"] or industry in lic["industries"]:
            out.append(lic)
    return out


def generate_compliance_calendar(company_type: str, has_gst: bool = True, has_employees: bool = True):
    """Generate next 12 months of compliances with realistic statuses for demo."""
    from datetime import datetime, timedelta, timezone
    import random
    random.seed(42)

    today = datetime.now(timezone.utc)
    items = []

    for c in COMPLIANCES:
        if c["category"] == "GST" and not has_gst:
            continue
        if c["category"] == "Labour" and not has_employees:
            continue
        if c["category"] == "MCA" and company_type not in ["Private Limited Company", "LLP", "One Person Company (OPC)", "Public Limited Company"]:
            continue

        if c["frequency"] == "Monthly":
            for m_offset in range(-2, 4):
                month = (today.month + m_offset - 1) % 12 + 1
                year = today.year + (today.month + m_offset - 1) // 12
                try:
                    due = datetime(year, month, c["due_day"], tzinfo=timezone.utc)
                except ValueError:
                    continue
                status = "completed" if due < today - timedelta(days=10) else ("overdue" if due < today else "upcoming")
                items.append({
                    "compliance_id": c["id"],
                    "name": c["name"],
                    "due_date": due.date().isoformat(),
                    "status": status,
                    "category": c["category"],
                    "penalty": c["penalty"],
                    "documents": c["documents"],
                })
        elif c["frequency"] == "Quarterly":
            for q_month in [1, 4, 7, 10]:
                year = today.year if q_month >= today.month - 3 else today.year + 1
                try:
                    due = datetime(year, q_month, c["due_day"], tzinfo=timezone.utc)
                except ValueError:
                    continue
                status = "completed" if due < today - timedelta(days=15) else ("overdue" if due < today else "upcoming")
                items.append({
                    "compliance_id": c["id"],
                    "name": c["name"],
                    "due_date": due.date().isoformat(),
                    "status": status,
                    "category": c["category"],
                    "penalty": c["penalty"],
                    "documents": c["documents"],
                })
        else:
            month = c.get("due_month", 3)
            year = today.year if month >= today.month else today.year + 1
            try:
                due = datetime(year, month, c["due_day"], tzinfo=timezone.utc)
            except ValueError:
                continue
            status = "upcoming" if due >= today else "overdue"
            items.append({
                "compliance_id": c["id"],
                "name": c["name"],
                "due_date": due.date().isoformat(),
                "status": status,
                "category": c["category"],
                "penalty": c["penalty"],
                "documents": c["documents"],
            })

    items.sort(key=lambda x: x["due_date"])
    return items
