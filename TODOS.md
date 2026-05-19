# CareerOS — TODOS & Track Ownership

| Track | Owner      | Description                              | Status  |
|-------|------------|------------------------------------------|---------|
| A     | OpenCode   | Project scaffold, main.py, docker-compose | ⬜ TODO |
| B     | OpenCode   | SQLAlchemy DB models (all tables)        | ⬜ TODO |
| C     | OpenCode   | Auth routes (register, login, JWT)       | ⬜ TODO |
| D     | OpenCode   | Resume parser service (PDF/DOCX + NER)   | ⬜ TODO |
| E     | OpenCode   | ML layer (embeddings, NER, similarity)   | ⬜ TODO |
| F     | Cursor     | Job search service (Adzuna + JSearch + Redis cache) | ⬜ TODO |
| G     | Cursor     | ATS Scorer — 5-dimension deterministic  | ⬜ TODO |
| H     | Cursor     | Skill gap detector + course DB           | ⬜ TODO |
| I     | Cursor     | Application tracker CRUD + interview Q bank | ⬜ TODO |
| J     | Antigravity| Resume curator with LLM + hallucination guard | ✅ DONE |
| K     | Antigravity| Cold email generator (Gemini, 3 tones, news hook) | ✅ DONE |
| L     | Antigravity| LLM interview evaluator + dynamic Q gen  | ✅ DONE |
| M     | Antigravity| Celery scheduler + frontend API wiring   | ✅ DONE |

## Key constraints
- Schemas in Section 2 of IMPLEMENTATION_PLAN.md are LOCKED after OpenCode writes them
- No agent modifies frontend page/component files — only /frontend/src/api/
- No agent writes Alembic migrations — SQLAlchemy models only (DB recreated from scratch)
- LLM calls (Gemini API via google-generativeai SDK) only in Tracks J, K, L — not in G, H, I
- All endpoints must match Section 1 API contract exactly

## Smoke test checklist (all must pass by end of Sprint 3)
- [ ] `GET /health` → 200
- [ ] `POST /api/auth/register` → token + user
- [ ] `POST /api/resume/upload` → parsed resume JSON
- [ ] `POST /api/ats/score` → ATSResult with overall_score int
- [ ] `GET /api/jobs?query=python&location=bangalore` → array of Jobs
- [ ] `POST /api/skills/gap` → SkillGapResult
- [ ] `POST /api/email/generate` → EmailResult with 3 variants
- [ ] `POST /api/interview/questions` → Question array
- [ ] `POST /api/interview/evaluate` → Evaluation with star_score
- [ ] `GET /api/tracker` → Application array
- [ ] Frontend `npm run build` exits clean
- [ ] Frontend API calls hit real backend (no mock data in responses)
