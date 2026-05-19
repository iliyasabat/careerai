# CareerOS

AI-powered job-search and career platform for students and early-career professionals.

- **Backend** — Python / FastAPI, SQLAlchemy (async), Celery, spaCy + sentence-transformers ML layer, Google Gemini for LLM features.
- **Frontend** — React 19 + Vite, React Router, Tailwind CSS, Axios.

---

## Architecture

```
frontend/  React + Vite SPA           → talks to the backend over HTTP (Axios)
backend/   FastAPI app                 → REST API under /api/*
           ├─ api/routes/              route handlers
           ├─ services/                business logic (ATS, jobs, curator, email…)
           ├─ ml/                      embeddings (sentence-transformers) + NER (spaCy)
           ├─ models/                  SQLAlchemy ORM models
           ├─ workers/                 Celery worker + beat (follow-up emails)
           └─ data/                    static course DB + interview question bank
```

External services (all optional — features degrade gracefully when unset): Gemini,
Adzuna, JSearch/RapidAPI, Tavily, Redis, Postgres.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.11 | 3.12 also works; the Docker image pins 3.11 |
| Node.js | 18+ | for the frontend |
| Postgres | 16 | optional — SQLite is the default for local dev |
| Redis | 7 | optional — the backend falls back to an in-memory cache |
| Docker + Compose | recent | optional — only for the containerised path |

An internet connection is needed on the first backend start: `sentence-transformers`
downloads the `all-MiniLM-L6-v2` model (~90 MB) from Hugging Face automatically.

---

## Backend — local run (SQLite, no Docker)

The backend defaults to SQLite, so this needs no database server.

```bash
cd backend

# 1. Virtual environment
python3.11 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate

# 2. Dependencies
pip install -r requirements.txt

# 3. Download the spaCy model (REQUIRED — the app fails to import without it)
python -m spacy download en_core_web_sm

# 4. Environment file (the defaults work as-is for local dev)
cp .env.example .env

# 5. Start the API
uvicorn main:app --reload --port 8000
```

- API root: <http://localhost:8000>
- Health check: <http://localhost:8000/health> → `{"status":"ok"}`
- Interactive docs: <http://localhost:8000/docs>

Tables are created automatically at startup (`Base.metadata.create_all`) — no migration
step is needed. The SQLite file is written to `backend/careeros.db`.

### Optional API keys

Set these in `backend/.env` to enable the corresponding features:

| Variable | Enables | If unset |
|----------|---------|----------|
| `GEMINI_API_KEY` | Resume curator, cold email, interview evaluator | those endpoints return `503` |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Job search (Adzuna) | `/api/jobs` returns `500 "Job API key not configured"` |
| `RAPIDAPI_KEY` | Job search (JSearch) | JSearch is silently skipped |
| `TAVILY_API_KEY` | Company news hook in cold emails | the hook is silently skipped |

---

## Backend — Postgres

To use Postgres instead of SQLite, start a database and point `.env` at it (the
`.env.example` file already contains this URL as a commented-out alternative):

```bash
docker run -d --name careeros-pg -p 5432:5432 \
  -e POSTGRES_USER=careeros -e POSTGRES_PASSWORD=careeros -e POSTGRES_DB=careeros \
  postgres:16
```

```dotenv
DATABASE_URL=postgresql+asyncpg://careeros:careeros@localhost:5432/careeros
```

---

## Backend — Docker Compose

`backend/docker-compose.yml` defines five services: `app`, `postgres`, `redis`,
`celery-worker`, `celery-beat`.

```bash
cd backend
cp .env.example .env
# For the bundled Postgres service, switch DATABASE_URL in .env to the postgresql:// URL.
docker compose up --build
```

The whole backend directory is bind-mounted into each container for live reload.

---

## Celery (optional — follow-up email scheduler)

Only needed for the daily follow-up reminder task. Requires Redis.

```bash
cd backend && source .venv/bin/activate
celery -A workers.celery_app worker --loglevel=info     # worker
celery -A workers.celery_app beat   --loglevel=info     # scheduler
```

---

## Frontend

```bash
cd frontend
npm install

# Point the SPA at the backend (optional — defaults to http://localhost:8000)
cp .env.example .env

npm run dev      # dev server at http://localhost:3000
npm run build    # production build into dist/
```

Register or log in from `/auth`; the JWT returned by the backend is stored in
`localStorage` and attached to every API request.

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
  are no migrations, so changing a model means recreating the database.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OSError: Can't find model 'en_core_web_sm'` | spaCy model missing | `python -m spacy download en_core_web_sm` |
| API returns 500 on every DB call | `DATABASE_URL` points at a Postgres that is not running | start Postgres or use the SQLite default |
| `/api/jobs` → 500 "Job API key not configured" | no Adzuna keys | set `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` |
| AI endpoints return 503 | no `GEMINI_API_KEY` | set it in `backend/.env` |
