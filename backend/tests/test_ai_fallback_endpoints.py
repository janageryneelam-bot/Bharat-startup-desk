"""
Tests for the AI-powered endpoints to verify they always return 200
with a shaped response (real AI or demo fallback). After the production
bug fix, these endpoints must NEVER return 500 even when the LLM fails.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://startup-desk-india.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Explore Idea endpoint ---
class TestExploreIdea:
    def test_explore_idea_returns_200(self, client):
        payload = {
            "idea": "I want to start manufacturing rivets and springs in Karnataka",
            "industry": "Manufacturing",
            "state": "Karnataka",
            "investment": "₹5-10 Lakh",
        }
        r = client.post(f"{API}/explore/idea", json=payload, timeout=120)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:500]}"
        data = r.json()
        assert "ai" in data, f"Missing 'ai' key. keys={list(data.keys())}"
        ai = data["ai"]
        # Whether real or demo, shape should include these top-level keys
        for k in ["business_structure", "registrations", "licenses", "gst",
                  "trademark", "schemes", "estimated_cost", "risks",
                  "first_10_steps", "roadmap_12_months"]:
            assert k in ai, f"Missing key '{k}' in ai response"
        # Roadmap should be a 12-month list (or at least an iterable)
        assert isinstance(ai["roadmap_12_months"], list)
        assert len(ai["roadmap_12_months"]) >= 1

    def test_explore_idea_minimal_invalid_still_200_or_422(self, client):
        # missing required field - should NOT 500
        r = client.post(f"{API}/explore/idea", json={"idea": "test"}, timeout=60)
        assert r.status_code in (200, 400, 422), f"Got {r.status_code}: {r.text[:300]}"


# --- Validate Idea endpoint ---
class TestValidateIdea:
    def test_validate_idea_returns_200(self, client):
        payload = {
            "idea": "AI-driven QA tool for SaaS teams",
            "industry": "AI / SaaS",
            "state": "Karnataka",
        }
        r = client.post(f"{API}/validate/idea", json=payload, timeout=120)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:500]}"
        data = r.json()
        # Verdict structure required for frontend score render
        assert "verdict" in data, f"Missing 'verdict'. keys={list(data.keys())}"
        assert "score" in data["verdict"], f"Missing verdict.score. verdict={data['verdict']}"
        # Lists used by frontend
        for k in ["strengths", "weaknesses", "risks", "improvements", "competitors"]:
            assert k in data, f"Missing key '{k}'"


# --- Trademark Advice endpoint ---
class TestTrademarkAdvice:
    def test_trademark_advice_returns_200(self, client):
        payload = {"startup_name": "RivetPro", "industry": "Manufacturing"}
        r = client.post(f"{API}/trademark/advice", json=payload, timeout=120)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text[:500]}"
        data = r.json()
        for k in ["recommended_classes", "suggestions", "ip_checklist",
                  "estimated_cost", "timeline"]:
            assert k in data, f"Missing key '{k}'. keys={list(data.keys())}"


# --- Sanity: meta endpoint ---
class TestMeta:
    def test_meta_all(self, client):
        r = client.get(f"{API}/meta/all", timeout=30)
        assert r.status_code == 200
        d = r.json()
        assert "states" in d and "industries" in d
        assert len(d["states"]) > 0 and len(d["industries"]) > 0
