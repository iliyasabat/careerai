# CareerOS — Master Implementation Plan
# All agents MUST read this file in full before writing a single line of code.
# Last updated by: human engineer

---

## SECTION 0 — PROJECT CONTEXT & SETUP

### What CareerOS is
An AI-powered job search and career platform built for final-year engineering students in India.
The React frontend (Vite + Tailwind + React Router v6) is already built and deployed.
All API calls in the frontend are mocked with an 800ms fake delay via `/src/api/index.js`.
The job of these three sprints is to build the Python FastAPI backend, wire it to the frontend, and implement all AI modules.

### Frontend location
`/frontend` — already exists, do NOT modify page or component files.
You MAY modify only: `/frontend/src/api/client.js` and `/frontend/src/api/index.js` to replace mock calls with real ones.
You MAY modify `/frontend/.env` to set `VITE_API_URL=http://localhost:8000`.

### Backend location
`/backend` — created from scratch in Sprint 1.

### Repo structure (after Sprint 1 scaffold)
```
careeros/
  frontend/          ← already exists, do not touch pages/components
  backend/
    main.py
    config.py
    database.py
    requirements.txt
    docker-compose.yml
    .env.example
    alembic.ini
    alembic/
    api/routes/
      auth.py
      resume.py
      jobs.py
      ats.py
      curator.py
      skills.py
      email.py
      interview.py
      tracker.py
    models/
    schemas/           ← LOCKED after Sprint 1. No agent modifies schemas after OpenCode writes them.
    services/
    ml/
    workers/           ← Celery tasks
    utils/
  IMPLEMENTATION_PLAN.md   ← this file
  TODOS.md
```

### Environment variables required (all agents add to .env.example)
```
DATABASE_URL=postgresql://careeros:careeros@localhost:5432/careeros
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=changeme-in-production
ANTHROPIC_API_KEY=
ADZUNA_APP_ID=
ADZUNA_APP_KEY=
RAPIDAPI_KEY=
TAVILY_API_KEY=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
FRONTEND_URL=http://localhost:5173
```

### Setup commands (all agents run these after scaffold exists)
```bash
cd backend
pip install -r requirements.txt --break-system-packages
python -c "from main import app; print('Backend OK')"

cd ../frontend
npm ci
npm run build
```

### Smoke test (must pass before any agent commits sprint complete)
```bash
# Terminal 1
cd backend && uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev

# Verify these endpoints respond:
curl http://localhost:8000/health              # → {"status":"ok"}
curl http://localhost:8000/api/jobs?query=python&location=bangalore  # → job array
```

### Git hygiene (ALL agents follow this)
- Branch: all work on `feat/careeros-backend` (created in Sprint 1, all agents continue on it)
- Commit messages: 5–10 words, no body, suffix with agent name in parens: `(opencode)`, `(cursor)`, `(antigravity)`
- NEVER mention any AI tool, assistant, or agent product in commits, code, or comments
- Strip Co-Authored-By trailers
- Do NOT push to remote — human pushes after Sprint 3

---

## SECTION 1 — FRONTEND API CONTRACT (locked — backend must match exactly)

These are the exact function signatures in `/frontend/src/api/index.js`.
The backend MUST implement endpoints that match these shapes precisely.
Do not change the frontend API layer — change the backend to match it.

```javascript
// All endpoints are prefixed with /api

POST   /api/auth/login          body: {email, password}             → {token, user: {id, name, email, avatar}}
POST   /api/auth/register       body: {name, email, password}       → {token, user}

POST   /api/resume/upload       body: FormData(file)                → {resume_id, parsed: {sections, skills, experience_years, bullets}}
GET    /api/resume/:id          params: resume_id                   → ParsedResume

POST   /api/ats/score           body: {resume_id, job_description}  → ATSResult
POST   /api/curator/curate      body: {resume_id, job_description}  → CurationResult
GET    /api/curator/accept      body: {bullet_id, accepted: bool}   → {ok: true}

GET    /api/jobs                query: {query, location, mode, experience, salary_min, page}  → Job[]
GET    /api/jobs/:id            params: job_id                      → Job

POST   /api/skills/gap          body: {resume_id, target_role}      → SkillGapResult
GET    /api/skills/courses      query: {skill}                      → Course[]

POST   /api/email/generate      body: {company_name, role_title, job_description, manager_name?, tone, include_news_hook, portfolio_url?}  → EmailResult
POST   /api/email/send          body: {email_id, to_address}        → {ok: true}

GET    /api/tracker             query: {user_id}                    → Application[]
POST   /api/tracker             body: {company, role, status, date_applied, notes}  → Application
PATCH  /api/tracker/:id         body: {status?, notes?}             → Application
DELETE /api/tracker/:id                                             → {ok: true}

POST   /api/interview/questions body: {role, job_description?}      → Question[]
POST   /api/interview/evaluate  body: {question_id, question_text, answer_text, role}  → Evaluation
```

---

## SECTION 2 — PYDANTIC SCHEMAS (written by OpenCode, LOCKED for all subsequent agents)

OpenCode writes these. Cursor and Antigravity import from `schemas/` and do NOT modify.

Key schemas that all agents code against:

```python
# schemas/resume.py
class ParsedBullet(BaseModel):
    id: str
    text: str
    is_strong: bool
    action_verb: str | None
    has_metric: bool

class ParsedResume(BaseModel):
    resume_id: str
    filename: str
    sections: dict[str, str]        # {"experience": "...", "skills": "...", ...}
    skills: list[str]
    experience_years: float
    bullets: list[ParsedBullet]
    embedding: list[float]          # 384-dim from all-MiniLM-L6-v2

# schemas/ats.py
class ATSDimension(BaseModel):
    score: int
    max: int
    missing: list[str] = []
    weak_bullets: list[str] = []

class ATSResult(BaseModel):
    resume_id: str
    overall_score: int              # 0-100
    grade: str                      # A/B/C/D/F
    dimensions: dict[str, ATSDimension]
    recommendation: str
    missing_keywords: list[str]
    weak_bullets: list[str]

# schemas/jobs.py
class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    mode: str                       # Remote/Hybrid/Onsite
    salary: str
    experience: str
    match_score: int                # 0-100, computed from resume embedding
    posted: str
    skills_required: list[str]
    description: str
    apply_url: str | None

# schemas/skills.py
class Course(BaseModel):
    title: str
    platform: str
    instructor: str
    duration: str
    free: bool
    url: str
    rating: float | None

class SkillGapResult(BaseModel):
    target_role: str
    your_skills: list[str]
    required_skills: list[str]
    missing_skills: list[str]
    courses: dict[str, list[Course]]  # skill → list of courses

# schemas/email.py
class EmailVariant(BaseModel):
    subject: str
    body: str

class EmailResult(BaseModel):
    email_id: str
    subject: str
    body: str
    word_count: int
    tone_used: str
    variants: dict[str, EmailVariant]  # formal/conversational/referral
    follow_up_date: str               # ISO date string

# schemas/interview.py
class Question(BaseModel):
    id: str
    question: str
    difficulty: str                  # Easy/Medium/Hard
    category: str
    model_answer: str

class Evaluation(BaseModel):
    question_id: str
    star_score: int                  # 0-5
    feedback: str
    missing_elements: list[str]
    improved_answer: str

# schemas/tracker.py
class Application(BaseModel):
    id: str
    user_id: str
    company: str
    role: str
    status: str                      # Applied/Screening/Interview/Offer/Rejected
    date_applied: str
    days_since: int
    notes: str

# schemas/auth.py
class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: str                      # initials, e.g. "AS"

class AuthResponse(BaseModel):
    token: str
    user: User
```

---

## SECTION 3 — SPRINT 1 SCOPE (OpenCode)

Tracks: A, B, C, D, E

**Track A** — Project scaffold
- Create `/backend` with all folders and empty files per repo structure in Section 0
- `main.py`: FastAPI app, CORS (allow localhost:5173), include all routers, `/health` endpoint
- `config.py`: Pydantic Settings loading from .env
- `database.py`: SQLAlchemy async engine + session + Base
- `docker-compose.yml`: 3 services — app (FastAPI on 8000), postgres, redis
- `requirements.txt`: all dependencies (see Section 0 of this plan for full list)
- `alembic.ini` + `alembic/env.py`

**Track B** — SQLAlchemy models (in `/backend/models/`)
- `user.py`: User (id UUID, name, email, hashed_password, created_at)
- `resume.py`: Resume (id UUID, user_id FK, filename, parsed_json JSONB, embedding vector as JSON list, created_at)
- `job.py`: JobCache (id, source, external_id, raw_json JSONB, cached_at)
- `application.py`: Application (id UUID, user_id FK, company, role, status, date_applied, notes, created_at)
- `email_log.py`: EmailLog (id UUID, user_id FK, company, role, subject, body, tone, sent_at nullable, follow_up_date, created_at)
- `interview.py`: InterviewSession (id UUID, user_id FK, role, questions_json JSONB, created_at)

**Track C** — Auth routes (`/api/auth/`)
- `POST /api/auth/register`: hash password with passlib bcrypt, return JWT
- `POST /api/auth/login`: verify password, return JWT
- JWT middleware: `get_current_user` dependency that all protected routes use
- Use python-jose for JWT, SECRET_KEY from config

**Track D** — Resume parser service (`/backend/services/resume_parser.py`)
- `parse_resume(file_bytes, filename) -> ParsedResume`
- PDF: use PyMuPDF (fitz). DOCX: use python-docx
- Section detection: regex patterns for EXPERIENCE, EDUCATION, SKILLS, PROJECTS, SUMMARY, CERTIFICATIONS headings (case-insensitive)
- Bullet extraction: lines starting with `-`, `•`, `*`, or numbered lists
- Bullet strength scoring: `is_strong` = starts with action verb AND (has number/% OR >10 words)
- Action verb list: Led, Built, Designed, Developed, Implemented, Optimised, Reduced, Increased, Managed, Architected, Deployed, Automated, Improved, Created, Launched (and 20+ more common resume action verbs)
- Resume upload endpoint: `POST /api/resume/upload` — accepts multipart, parses, embeds, saves to DB, returns ParsedResume schema

**Track E** — ML layer (`/backend/ml/`)
- `embeddings.py`:
  - Load `sentence-transformers/all-MiniLM-L6-v2` on startup (singleton pattern)
  - `embed_text(text: str) -> list[float]`
  - `embed_batch(texts: list[str]) -> list[list[float]]`
  - `cosine_similarity(a: list[float], b: list[float]) -> float`
- `ner_extractor.py`:
  - Load `en_core_web_sm` spaCy model on startup (singleton)
  - `extract_skills(text: str) -> list[str]`: NER + skills keyword list matching
  - Skills keyword list: include 150+ common tech skills (Python, FastAPI, Docker, React, Node.js, PostgreSQL, Redis, Kubernetes, AWS, GCP, Azure, TensorFlow, PyTorch, Pandas, scikit-learn, Git, CI/CD, REST APIs, GraphQL, MongoDB, MySQL, Java, Go, Rust, TypeScript, etc.)
  - `extract_experience_years(text: str) -> float`: parse date ranges (Jan 2022 – Mar 2024 = 2.16 years), sum total
- `similarity.py`:
  - `job_match_score(resume_embedding, jd_embedding) -> int`: cosine similarity * 100, int
  - `rank_jobs(resume_embedding, jobs: list[Job]) -> list[Job]`: sort jobs by match score desc

---

## SECTION 4 — SPRINT 2 SCOPE (Cursor)

Tracks: F, G, H, I

**PREREQUISITE**: Read Section 7 for OpenCode's handoff log. Fix any documented failures before starting your tracks.

**Track F** — Job search service (`/backend/services/job_fetcher.py` + `/api/routes/jobs.py`)
- `fetch_adzuna(query, location, mode, experience, salary_min) -> list[Job]`:
  - Call Adzuna API: `GET https://api.adzuna.com/v1/api/jobs/in/search/1` (India endpoint)
  - Params: `app_id`, `app_key`, `what`=query, `where`=location, `results_per_page`=20
  - Map Adzuna response fields to Job schema
- `fetch_jsearch(query, location) -> list[Job]`:
  - Call JSearch via RapidAPI: `GET https://jsearch.p.rapidapi.com/search`
  - Headers: `X-RapidAPI-Key`, `X-RapidAPI-Host: jsearch.p.rapidapi.com`
  - Map response to Job schema
- Deduplication: hash (title.lower() + company.lower()), deduplicate across sources
- Redis caching: cache results with key `jobs:{query}:{location}:{mode}` for 30 minutes. Use `json.dumps/loads`. On cache hit, skip API calls.
- Match scoring: after fetching, embed each job's title+description, compute cosine similarity with user's resume embedding (fetch from DB by resume_id if provided in headers as `X-Resume-Id`). If no resume_id, match_score = 50.
- `GET /api/jobs`: accepts query params, returns sorted Job list
- `GET /api/jobs/:id`: returns single job from cache or DB

**Track G** — ATS Scorer (`/backend/services/ats_scorer.py` + `/api/routes/ats.py`)
Implement ALL 5 dimensions as deterministic Python. NO LLM calls in this service.

Dimension 1 — keyword_match (max 30):
- Embed resume text and JD text using ml/embeddings.py
- Semantic score: cosine_similarity * 20 (max 20)
- Overlap score: len(resume_skills ∩ jd_skills) / len(jd_skills) * 10 (max 10)
- missing = jd_skills - resume_skills (top 5)

Dimension 2 — section_completeness (max 20):
- Summary/Objective: 4pts, Experience: 5pts, Education: 3pts, Skills: 4pts, Projects: 2pts, Certifications: 2pts
- Check for section heading in resume sections dict

Dimension 3 — bullet_strength (max 25):
- For each bullet in parsed_resume.bullets: is_strong=True → 5pts, False → 2pts
- Score = (sum of bullet pts) / (len(bullets) * 5) * 25
- weak_bullets = [b.text for b in bullets if not b.is_strong]

Dimension 4 — format_quality (max 15):
- Resume parsed without error: 3pts
- No table artifacts (heuristic: ratio of `|` chars < 0.01): 3pts
- Has contact info (email regex + phone regex): 3pts
- Consistent date format (all dates match one pattern): 3pts
- Word count between 300-900: 3pts

Dimension 5 — experience_fit (max 10):
- Extract required years from JD using regex (`(\d+)\+?\s*years?`, `(\d+)[–-](\d+)\s*years?`)
- Compare to ParsedResume.experience_years
- Full 10pts if within range, 6pts if 0-1 yr under, 0pts if >2yr under, 8pts if over-experienced

Final: overall_score = sum of all dimension scores. Grade: A≥90, B≥75, C≥60, D≥45, F<45.
Endpoint: `POST /api/ats/score` — body {resume_id, job_description}, returns ATSResult.

**Track H** — Skill Gap Detector (`/backend/services/skill_gap.py` + `/api/routes/skills.py`)
- `detect_gap(resume_skills: list[str], target_role: str) -> SkillGapResult`:
  - Use ner_extractor to extract skills from a role-specific prompt (build a short role description using common JD patterns for that role)
  - OR: maintain a role→required_skills dictionary for 20 common roles (Backend Engineer, Frontend Engineer, Data Scientist, ML Engineer, DevOps Engineer, Full Stack Developer, Product Manager, etc.) as a fallback
  - missing_skills = required_skills - resume_skills (case-insensitive set diff)
- `get_courses(skill: str) -> list[Course]`:
  - Query a SQLite-backed course database. Pre-populate with 10 courses per skill for these skills: Python, FastAPI, Docker, Redis, Kubernetes, AWS, React, Node.js, TypeScript, PostgreSQL, MongoDB, Machine Learning, Deep Learning, System Design, Git, CI/CD
  - Course data sourced from real URLs (use actual YouTube/Coursera/Udemy titles and URLs)
  - Prioritise free courses first in the list
- Endpoints: `POST /api/skills/gap` and `GET /api/skills/courses?skill=Docker`

**Track I** — Application Tracker + Interview Questions (`/api/routes/tracker.py` + `/api/routes/interview.py`)
- Tracker: full CRUD. GET returns all applications for current user (from JWT), sorted by date_applied desc. POST creates new. PATCH updates status/notes. DELETE removes.
- Interview questions generation: `POST /api/interview/questions` — body {role, job_description?}
  - Maintain a static question bank: 10 questions per category × 5 categories = 50 questions minimum
  - Categories: System Design, Backend, Frontend, Databases, Behavioural
  - Filter by role relevance: Backend Engineer gets System Design + Backend + Databases questions
  - Return 5-8 questions per request, mixed difficulties
  - This is static/rule-based — NO LLM calls here (Antigravity adds LLM question generation in Sprint 3)

---

## SECTION 5 — SPRINT 3 SCOPE (Antigravity)

Tracks: J, K, L, M

**PREREQUISITE**: Read Section 7 for OpenCode + Cursor handoff logs. Fix ALL documented failures before starting your tracks.

**Track J** — Resume Curator with LLM (`/backend/services/resume_curator.py` + `/api/routes/curator.py`)
- `curate_resume(parsed_resume: ParsedResume, job_description: str) -> CurationResult`:
  Step 1: Score each bullet (is_strong from parser). Identify weak bullets (is_strong=False).
  Step 2: Extract JD keywords using ner_extractor.extract_skills(job_description)
  Step 3: For EACH weak bullet, call Claude API with this EXACT system prompt:
  ```
  You are an expert resume writer. Rewrite the bullet below to be stronger and ATS-optimised.
  Rules:
  1. Start with a strong past-tense action verb
  2. Incorporate 1-2 keywords naturally from the provided JD keywords list
  3. If the original implies a measurable result, make it explicit — but NEVER invent specific numbers not inferable from context
  4. Maximum 22 words
  5. Do not add skills or technologies the candidate did not demonstrate
  Return ONLY the rewritten bullet text. No explanation, no quotes.
  ```
  User message: `Original: {bullet}\nJD Keywords: {keywords}\nContext: {section_context}`
  Step 4 — Hallucination guard: after rewrite, check if any number (regex `\d+`) in the rewrite was NOT present in the original bullet OR the section context. If yes, remove the specific number and replace with a qualitative term ("significantly", "substantially").
  Step 5: Return CurationResult with list of {id, original, rewritten, status: "pending"}

- Use asyncio.gather to run all weak bullets in parallel (not sequential)
- Endpoint: `POST /api/curator/curate`

**Track K** — Cold Email Generator (`/backend/services/email_generator.py` + `/api/routes/email.py`)
- `extract_jd_emphasis(jd_text: str) -> list[str]`: use spaCy to extract top 3 emphasis points from JD (required skills + culture words)
- `fetch_news_hook(company_name: str) -> str`:
  - POST to Tavily API: `https://api.tavily.com/search` with `{query: "{company} latest news 2025", max_results: 1}`
  - Return first result as 1 sentence. Silent fail (return "") if API fails or key missing.
- `generate_email(request: EmailRequest) -> EmailResult`:
  - Get user's top 3 matching skills from resume vs JD (call cosine_similarity per skill)
  - Call extract_jd_emphasis and (if enabled) fetch_news_hook
  - Generate ALL 3 tone variants in parallel using asyncio.gather (3 concurrent Claude API calls)
  - Each call uses this system prompt:
  ```
  You are a professional cold email writer for job outreach. Rules:
  1. Max 150 words
  2. First sentence: one specific thing about the company or role. NOT generic flattery.
  3. State exactly 2 concrete skills/achievements matching the JD emphasis
  4. One clear CTA: ask for a 15-minute call or invite a reply
  5. Banned words: passionate, hardworking, synergy, leverage, excited, eager, dynamic
  6. Tone: {tone} (formal=professional distance | conversational=friendly direct | referral=mention referrer first)
  7. Return a JSON object ONLY with keys: subject (string), body (string). No markdown, no explanation.
  ```
  - Parse JSON from Claude response (strip ```json fences if present)
  - Save EmailLog to DB. Return EmailResult with all 3 variants + follow_up_date = today + 7 days

**Track L** — LLM Interview Evaluator (`/backend/services/interview_coach.py` additions)
- Upgrade `POST /api/interview/questions` to use Claude API when job_description is provided:
  - Generate 5 role-specific questions from the actual JD content (not just static bank)
  - Each question includes difficulty + category determined by Claude
- Implement `POST /api/interview/evaluate`:
  - Call Claude API with:
  ```
  You are an expert technical interviewer. Evaluate this answer to the interview question.
  Score the answer on STAR format (Situation/Task/Action/Result) from 0-5.
  Identify which STAR elements are missing or weak.
  Suggest one concrete improvement.
  Write a better version of the answer in max 100 words.
  Return ONLY a JSON object with: star_score (int 0-5), feedback (str), missing_elements (list[str]), improved_answer (str)
  ```
  - Parse response, return Evaluation schema

**Track M** — Celery follow-up scheduler + Frontend wiring
- `workers/follow_up.py`: Celery Beat task that runs daily at 9 AM IST
  - Query EmailLog where sent_at IS NOT NULL and follow_up_date = today and follow_up_sent = False
  - For each: generate a short follow-up email via Claude (50 words max, casual check-in tone)
  - Store in EmailLog as a new record with parent_email_id reference
  - Mark original as follow_up_sent = True
- `workers/celery_app.py`: Celery app configured with Redis broker (REDIS_URL from config)
- **Frontend wiring** (MOST IMPORTANT part of Sprint 3):
  - Edit `/frontend/src/api/index.js`: replace ALL mock return statements with real Axios calls to the FastAPI endpoints defined in Section 1
  - Remove the fake `await new Promise(r => setTimeout(r, 800))` delay lines
  - Add proper error handling: catch Axios errors, return `{error: true, message: err.response?.data?.detail}`
  - Edit `/frontend/src/api/client.js`: confirm baseURL reads from `import.meta.env.VITE_API_URL`
  - Edit `/frontend/.env` (create if missing): `VITE_API_URL=http://localhost:8000`
  - Test that these critical flows work end-to-end: Resume Upload → ATS Score → Job Search → Skill Gap → Cold Email Generate

---

## SECTION 6 — DEPENDENCIES (requirements.txt — written by OpenCode)

```
fastapi==0.111.0
uvicorn[standard]==0.29.0
sqlalchemy[asyncio]==2.0.30
alembic==1.13.1
asyncpg==0.29.0
psycopg2-binary==2.9.9
pydantic==2.7.1
pydantic-settings==2.2.1
redis==5.0.4
celery==5.4.0
python-multipart==0.0.9
PyMuPDF==1.24.3
python-docx==1.1.0
spacy==3.7.4
sentence-transformers==2.7.0
anthropic==0.28.0
httpx==0.27.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dotenv==1.0.1
numpy==1.26.4
scikit-learn==1.4.2
faiss-cpu==1.8.0
tavily-python==0.3.3
```

spaCy model (run once, not in requirements.txt):
`python -m spacy download en_core_web_sm`

---

## SECTION 7 — HANDOFF LOG (each agent appends their entry here)

Template:
```
### Sprint [N] — [Agent Name] — [Date]
Status: COMPLETE | COMPLETE WITH FAILURES
Tracks completed: [list]
Tracks with failures: [list with brief reason]
Files created: [list key files]
Tests passing: [smoke test results]
Notes for next agent: [anything they need to know]
```

<!-- OpenCode appends here after Sprint 1 -->

### Sprint 1 — OpenCode — 2026-04-30
Status: COMPLETE
Tracks completed: A, B, C, D, E
Tracks with failures: []
Files created: backend/main.py, backend/config.py, backend/database.py, backend/docker-compose.yml, backend/Dockerfile, backend/models/*, backend/ml/*, backend/services/resume_parser.py, backend/schemas/*
Tests passing: `cd backend && python -c "from main import app; print('Backend import OK')"` ✅, `cd frontend && npm run build` ✅, `uvicorn main:app --reload` starts ✅
Notes for next agent:
- Backend deps installed successfully using a Python 3.12 venv at `backend/.venv` (recommended for Windows). Python 3.14 hit wheel/source-build issues for pinned deps.
- `spacy` was bumped to `3.7.5` in `backend/requirements.txt` to resolve a dependency conflict with `fastapi==0.111.0`/`fastapi-cli` (`typer` pin). `python -m spacy download en_core_web_sm` completed (model `en_core_web_sm==3.7.1`).
- First import/start will download the sentence-transformers model and may emit HuggingFace cache/symlink warnings on Windows; this is expected.
<!-- Cursor appends here after Sprint 2 -->
<!-- Antigravity appends here after Sprint 3 -->
