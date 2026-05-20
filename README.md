# CareerOS

AI-powered job-search and career platform for students and early-career professionals.

- **Backend** — Python / FastAPI, SQLAlchemy async over **SQLite**, spaCy + sentence-transformers ML layer, Google Gemini for LLM features.
- **Frontend** — React 19 + Vite, React Router, Tailwind CSS, Axios.

The stack is intentionally minimal — one Python process, one Node dev server, one
SQLite file. No Postgres, no Redis, no Celery. The follow-up email scheduler runs
inside the FastAPI process as a periodic asyncio task.

---

## Architecture

```
frontend/  React + Vite SPA           → talks to the backend over HTTP (Axios)
backend/   FastAPI app                 → REST API under /api/*
           ├─ api/routes/              route handlers
           ├─ services/                business logic (ATS, jobs, curator, email…)
           │   └─ follow_up_scheduler  in-process periodic poller
           ├─ ml/                      embeddings (sentence-transformers) + NER (spaCy)
           ├─ models/                  SQLAlchemy ORM models (single SQLite file)
           └─ data/                    static course DB + interview question bank
```

External services (all optional — features degrade gracefully when unset): Gemini,
Adzuna, JSearch/RapidAPI, Tavily.

---

## Prerequisites

| Tool | Version | Check with |
|------|---------|-----------|
| Python | 3.11 (3.12 also works) | `python --version` |
| Node.js | 18 or newer | `node --version` |
| Git | any recent | `git --version` |

On the **first backend start** the app downloads an ML model (~90 MB) from
Hugging Face. An internet connection is required that first time.

---

## Backend — run locally

```bash
cd backend

python3.11 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\Activate.ps1

pip install -r requirements.txt
python -m spacy download en_core_web_sm      # REQUIRED — app fails to import without it

cp .env.example .env                  # Windows: copy .env.example .env

uvicorn main:app --reload --port 8000
```

- API root: <http://localhost:8000>
- Health check: <http://localhost:8000/health> → `{"status":"ok"}`
- Interactive docs: <http://localhost:8000/docs>

Tables are created automatically at startup (`Base.metadata.create_all`). The SQLite
file lives at `backend/careeros.db`.

### Optional API keys

Set these in `backend/.env` to enable the corresponding features:

| Variable | Enables | If unset |
|----------|---------|----------|
| `GEMINI_API_KEY` | Resume curator, cold email, interview evaluation, follow-up drafting | those endpoints return `503` |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Job search (Adzuna) | search returns a `502` listing the failure unless JSearch is set |
| `RAPIDAPI_KEY` | Job search (JSearch) | JSearch is silently skipped |
| `TAVILY_API_KEY` | Company news hook in cold emails | the hook is silently skipped |
| `FOLLOW_UP_POLL_INTERVAL_SECONDS` | How often the in-process scheduler checks for due follow-ups | defaults to `1800` (30 min) |

> Cold email now requires `GEMINI_API_KEY` — the silent placeholder fallback was
> removed so failures surface honestly.

---

## Frontend

```bash
cd frontend
npm install

cp .env.example .env                  # Windows: copy .env.example .env

npm run dev      # dev server at http://localhost:3000
npm run build    # production build into dist/
```

Register or log in from `/auth`; the JWT returned by the backend is stored in
`localStorage` and attached to every API request.

### Routes

| Path | What it is |
|------|------------|
| `/auth` | Sign in / sign up |
| `/dashboard` | Live, wired dashboard — counts from the tracker, real greeting, resume-upload prompt |
| `/dashboard-demo` | Frozen design reference — all data hardcoded; kept for visual documentation |
| `/resume`, `/ats`, `/curator`, `/jobs`, `/skills`, `/email`, `/interview`, `/tracker` | Feature pages |

---

## Docker

The repo ships a `Dockerfile` for the backend (handy for future deploys). There is no
`docker-compose.yml` — running the backend locally as described above is the supported
path.

```bash
cd backend
docker build -t careeros-backend .
docker run --rm -p 8000:8000 --env-file .env -v "$PWD/careeros.db:/app/careeros.db" careeros-backend
```

---

## Smoke test

With the backend running:

```bash
curl http://localhost:8000/health
# {"status":"ok"}

curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
# {"token":"...","user":{...}}
```

---

## Remaining gotchas

- **spaCy model** — `python -m spacy download en_core_web_sm` is a required manual step
  for local runs (the Dockerfile already does it). Without it the backend fails to
  import.
- **No migration tooling** — the schema is created at startup via `create_all`; there
  are no migrations, so changing a model means deleting `backend/careeros.db` and
  letting it regenerate.
- **Follow-up poller is single-process** — it runs inside the FastAPI process. If you
  ever run multiple uvicorn workers, you'll get duplicate follow-up sends. For the MVP
  this is fine; for production we'd move to an external scheduler or a row-level lock.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OSError: Can't find model 'en_core_web_sm'` | spaCy model missing | `python -m spacy download en_core_web_sm` |
| API returns 500 on every DB call | venv not activated or `.env` missing | activate venv; `cp .env.example .env` |
| `/api/jobs` → 502 "No job providers configured" | no Adzuna or JSearch keys | set `ADZUNA_APP_ID`/`ADZUNA_APP_KEY` or `RAPIDAPI_KEY` |
| `/api/jobs` → 502 with upstream error message | Adzuna/JSearch returned an error (often bad key or wrong region) | check your keys; the Adzuna endpoint is India-region (`/jobs/in/`) |
| Cold email → 503 "AI service not configured" | no `GEMINI_API_KEY` | set it in `backend/.env` |
| Logged in but bounced to `/auth` on every action | backend not running, or wrong `VITE_API_URL` | start the backend; ensure `frontend/.env` points at the right URL |
