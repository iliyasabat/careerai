# CareerOS — Handoff & Run Guide

A step-by-step guide to get CareerOS running on **Windows** and **macOS**, verify
the golden path, and — if you cloned this repo earlier — upgrade your local copy
without surprises.

CareerOS has two parts that run as separate processes:

- **Backend** — FastAPI API on `http://localhost:8000` (SQLite, in-process)
- **Frontend** — React/Vite app on `http://localhost:3000`

Run the backend first, then the frontend, each in its own terminal.

> **Upgrading from an older clone?** Jump to [Section 7 — Upgrading from an
> older version](#7-upgrading-from-an-older-version) first. The stack has been
> simplified (no Postgres, Redis, Celery, or docker-compose anymore) and some
> npm/Python dependencies were dropped, so a stale `.venv` / `node_modules` will
> trip you up.

---

## 1. Prerequisites

| Tool | Version | Check with |
|------|---------|-----------|
| Python | 3.11 (3.12 also works) | `python --version` |
| Node.js | 18 or newer | `node --version` |
| Git | any recent | `git --version` |

> On the **first backend start** the app downloads an ML model (~90 MB) from
> Hugging Face. An internet connection is required that first time.

---

## 2. Backend setup

Open a terminal in the project root.

### macOS / Linux

```bash
cd backend

python3.11 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm      # REQUIRED — app fails to import without it

cp .env.example .env

uvicorn main:app --reload --port 8000
```

### Windows (PowerShell)

```powershell
cd backend

py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
python -m spacy download en_core_web_sm      # REQUIRED — app fails to import without it

copy .env.example .env

uvicorn main:app --reload --port 8000
```

> **PowerShell blocks the activate script?** Run this once, then retry activation:
> `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
> On **Command Prompt (cmd.exe)** activate with `.venv\Scripts\activate.bat` instead.

### Verify the backend

Leave it running. In a browser or new terminal:

- <http://localhost:8000/health> → `{"status":"ok"}`
- <http://localhost:8000/docs> → interactive API docs

The backend uses **SQLite** — no database server is needed. Tables are created
automatically on startup; the file lives at `backend/careeros.db`.

---

## 3. Frontend setup

Open a **second terminal** in the project root.

### macOS / Linux

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Windows (PowerShell)

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Then open <http://localhost:3000>.

---

## 4. Golden path — manual test

Do this with **both servers running**. Steps 1–9 work with **no API keys**.
Steps marked 🔑 need optional keys (see section 5) and can be skipped.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open <http://localhost:3000> | Landing page loads. |
| 2 | Go to **/auth**, click **Sign Up**, enter name/email/password, tick the terms box, submit | You are redirected to **/dashboard**. (A wrong login shows an inline red error instead.) |
| 3 | Refresh the browser | You stay logged in — the dashboard still loads (the JWT is persisted). |
| 4 | Open **/dashboard** | You see your name in the greeting, real application counts (zeros initially), and a prompt to upload a resume. |
| 5 | Go to **Resume**, upload any PDF or DOCX résumé | The page navigates to ATS Score once parsed (first parse may take ~20s while ML models warm up). |
| 6 | On **ATS Score**, paste a job description, click **Score Against This JD** | An overall score (0–100), a grade, dimension breakdowns, missing keywords and weak bullets appear. |
| 7 | Go to **Skill Gap**, enter a target role (e.g. *Backend Engineer*), click **Analyse Gap** | Your skills, the role's required skills, and the missing ones appear; click a missing skill to expand course recommendations. |
| 8 | Go to **Tracker**, click **Add Application**, fill the form (company, role, status, date), click **Add Application** | The new card shows up immediately in the matching kanban column and the counts update. |
| 9 | Go to **Interview**, leave the JD blank, enter a role, click **Generate Questions** | A queue of 5–8 questions from the built-in bank appears; selecting one shows it on the right with a model-answer toggle and an answer textarea. |
| 10 | Click **Log out** | You return to **/auth**; refreshing no longer shows the app. |
| 11 🔑 | **Jobs** — type a title and location, click **Search** | Job listings appear. *Needs `ADZUNA_APP_ID`/`ADZUNA_APP_KEY` or `RAPIDAPI_KEY`; without them the page reports an inline error.* |
| 12 🔑 | **Curator** — paste a JD, click **Curate My Resume** | Side-by-side original vs AI-rewritten bullets appear. *Needs `GEMINI_API_KEY`.* |
| 13 🔑 | **Cold Email** — fill company, role and JD, click **Generate** | Three tone variants (formal / conversational / referral) appear. *Needs `GEMINI_API_KEY`.* |
| 14 🔑 | **Interview** — pick a question, type an answer, click **Evaluate** | A STAR score (0–5), feedback, suggested rewrite, and missing-element badges appear. *Needs `GEMINI_API_KEY`.* |

If steps **1–10** pass, the core application is working correctly. Steps 11–14
exercise the optional integrations.

### Optional: quick API-only check

**macOS / Linux**
```bash
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

**Windows (PowerShell)**
```powershell
Invoke-RestMethod http://localhost:8000/health
Invoke-RestMethod -Method Post http://localhost:8000/api/auth/register `
  -ContentType 'application/json' `
  -Body '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

Register should return a `token` and a `user` object.

---

## 5. Optional API keys

Core features (auth, resume parsing, ATS scoring, skill gap, tracker, static
interview bank) work without any keys. To enable the rest, edit `backend/.env`
and restart the backend:

| Variable | Enables | If left blank |
|----------|---------|---------------|
| `GEMINI_API_KEY` | Resume curator, cold email, interview answer evaluation, follow-up drafting | those endpoints return `503` |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Job search (Adzuna, India region) | search returns `502` unless JSearch is also set |
| `RAPIDAPI_KEY` | Extra job results (JSearch) | silently skipped |
| `TAVILY_API_KEY` | Company news line in cold emails | silently skipped |
| `FOLLOW_UP_POLL_INTERVAL_SECONDS` | How often the in-process scheduler checks SQLite for due follow-ups | defaults to `1800` (30 minutes) |

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OSError: Can't find model 'en_core_web_sm'` | spaCy model not downloaded | run `python -m spacy download en_core_web_sm` inside the activated venv |
| `ModuleNotFoundError: No module named 'celery' / 'redis' / 'asyncpg'` | upgrading from an older clone | see Section 7 — drop the old `.venv` and reinstall |
| PowerShell: `Activate.ps1 cannot be loaded` | script execution disabled | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then activate again |
| `uvicorn: command not found` | venv not activated | activate the venv before running `uvicorn` |
| Login bounces back to `/auth` on every click | backend not running, or wrong `VITE_API_URL` | start the backend; ensure `frontend/.env` points at `http://localhost:8000` |
| `npm ci` fails / odd frontend errors | stale `node_modules`/lockfile after the dep cleanup | `rm -rf node_modules package-lock.json && npm install` |
| First backend start hangs for a minute | downloading the sentence-transformers model (~90 MB) | wait — it is cached after the first run |
| `/api/jobs` returns 502 | Adzuna/JSearch keys missing or wrong region | set the keys; Adzuna is hard-coded to India (`/jobs/in/`) |

---

## 7. Upgrading from an older version

If you cloned this repo before the cleanup sprints, your local copy is referring
to dependencies and folders that **no longer exist** (Celery, Redis, asyncpg,
`workers/`, `docker-compose.yml`, plus a handful of npm packages). Reinstalling
cleanly takes about 5 minutes.

### 7.1 — Pull the latest code

```bash
git checkout main
git pull origin main
```

### 7.2 — Stop any old processes

If you had Docker Compose, Celery worker/beat, Redis, or Postgres running from
this project, stop them now. They are no longer used.

```bash
# If you were running docker compose
docker compose -f backend/docker-compose.yml down -v  2>/dev/null || true
# Stop any local Postgres / Redis containers you started for this project
docker ps --filter "name=careeros" -q | xargs -r docker stop
```

### 7.3 — Wipe and rebuild the backend environment

The Python dependency list lost `asyncpg`, `redis`, `celery`, `psycopg2-binary`,
`scikit-learn`, `faiss-cpu`, `tavily-python`, `alembic`, `tzlocal`. An incremental
`pip install` would *leave them in your venv* — easier to nuke and start over.

**macOS / Linux**
```bash
cd backend
deactivate 2>/dev/null || true
rm -rf .venv

python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

**Windows (PowerShell)**
```powershell
cd backend
deactivate 2>$null
Remove-Item -Recurse -Force .venv

py -3.11 -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 7.4 — Wipe and rebuild the frontend dependencies

`package.json` lost `express`, `dotenv`, `@types/express`, `tsx`, `@google/genai`.
An older `node_modules` will keep them around; an older `package-lock.json` may
make `npm ci` fail outright.

**macOS / Linux**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Windows (PowerShell)**
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### 7.5 — Refresh your `.env` files

The example files were trimmed. Compare your existing `.env` against the new
examples and remove any obsolete keys.

```bash
# Backend — remove REDIS_URL if present; the new template has FOLLOW_UP_POLL_INTERVAL_SECONDS
diff backend/.env backend/.env.example

# Frontend — the new template only references VITE_API_URL
diff frontend/.env frontend/.env.example
```

The simplest path is to back up your old `.env`, copy the new `.env.example`
over it, and re-paste any API keys you actually use.

### 7.6 — (Optional) Reset the SQLite database

The schema **hasn't changed** between versions, so your existing
`backend/careeros.db` continues to work. Only delete it if you want to start
fresh:

```bash
rm backend/careeros.db          # macOS / Linux
del backend\careeros.db         # Windows
```

The next backend start will recreate empty tables.

### 7.7 — Folders / files that should no longer exist locally

After the upgrade, these should be gone (`git pull` will delete them; if any of
them are still present in your working tree they're untracked leftovers and can
be removed):

| Path | Why |
|------|-----|
| `backend/workers/` | Celery worker — replaced by an in-process scheduler |
| `backend/docker-compose.yml` | The orchestrated services (Postgres/Redis/Celery) are gone |
| `backend/alembic/`, `backend/alembic.ini` | Alembic was never wired; schema is built at startup |
| `backend/celerybeat-schedule.*` | Celery beat artifacts |
| `frontend/src/mock/` | Mock data that no page imports |

### 7.8 — Run the golden path (Section 4) end-to-end

Confirm the upgrade by working through steps 1–10 above. If anything from
Section 6's troubleshooting table fires, that's normally the smoking gun.

---

## 8. Notes for the next person

- **Database:** SQLite, single file at `backend/careeros.db`. No migrations — the schema is built at startup, so changing a model means deleting the DB file and letting it regenerate.
- **Follow-up emails:** drafted by an in-process asyncio task that wakes every `FOLLOW_UP_POLL_INTERVAL_SECONDS`. The task is single-process — running multiple uvicorn workers would duplicate sends. For an MVP this is fine.
- **NLP / parsing layer is untouched.** All recent changes have been to the API edges and frontend wiring; `backend/services/resume_parser.py`, `backend/ml/ner_extractor.py`, and `backend/ml/embeddings.py` are unchanged.
- **Docker:** only the `Dockerfile` ships; there is no compose stack. Use it for deploy artifacts or skip Docker entirely for local dev.
