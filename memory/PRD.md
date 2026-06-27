# Bharat Startup Desk — PRD

## Original Problem Statement
Build a production-ready AI SaaS web app for Indian founders/MSMEs — AI co-founder helping with registrations, compliance, government schemes, funding, licenses, trademark, and growth. Three onboarding flows (Explore / Idea-MVP / Registered), full dashboard, demo mode for judges.

## Tech Stack (Adapted)
- Frontend: React 19 + React Router 7 + Tailwind + Shadcn UI + Lucide
- Backend: FastAPI + Motor (MongoDB)
- AI: Claude Sonnet 4.5 (claude-sonnet-4-5-20250929) via Emergent LLM key
- Fallback: Demo AI Mode (rule-based, context-aware) when key/budget unavailable

## User Personas
- Aspiring founder (no incorporation yet)
- Idea / MVP stage founder
- Registered MSME / Pvt Ltd looking for compliance + scheme guidance

## Core Requirements (Static)
- Three onboarding flows: Explore (no signup), Onboarding (Idea/MVP), RegisterBusiness (already registered, simulated public data)
- Compliance Dashboard (color-coded Green/Yellow/Red)
- Government Benefits Engine (10 schemes incl. state-specific)
- State Intelligence (KA, MH, TN, TG, GJ deep + 36 states/UTs base)
- License Recommender (13 licenses)
- Trademark/IP Advisor (class recommendations)
- Startup Health Score (/100)
- Idea Validator
- Personalized Roadmap (30/90/180/365)
- AI Copilot chat
- Dark/Light mode
- Disclaimer banner across pages

## Implemented (Feb 2026)
- Backend (`server.py`, `data.py`, `ai_service.py`, `demo_ai.py`):
  - 20+ API endpoints, all `/api` prefixed
  - 10 schemes, 13 licenses, 5 deep-state benefits, 10 compliance rules, 3 demo startups
  - Claude Sonnet 4.5 via emergentintegrations (`LlmChat`)
  - Demo AI Mode fallback with personalised rule-based responses on every AI call
- Frontend:
  - Landing page (hero, problem, features, how-it-works, demo mode, testimonials, pricing, FAQ, footer)
  - 3 onboarding flows (Explore, Onboarding, RegisterBusiness)
  - Full Dashboard: Overview (health gauge), Compliance (calendar+list), Schemes, State Intel, Licenses, Trademark, Roadmap, Idea Validator, Copilot
  - Admin (dataset overview)
  - Dark/Light theme toggle, Disclaimer banners
  - "Demo AI Mode" badge on AI responses when LLM unavailable
  - "Explore Demo (1-click)" loads NeuralForge AI demo startup straight into dashboard

## Backlog (P1)
- Real DPIIT / MCA / GSTN API integration (deferred per spec)
- Full CRUD admin UI (currently read-only)
- Document upload + parsing for filings
- Multi-entity / team seats
- Email reminders for upcoming compliance
- Razorpay / Stripe pricing checkout
