# CareerOS — Handoff & Run Guide

A step-by-step guide to get CareerOS running on **Windows** and **macOS**, and to
verify it works by walking the golden path manually.

CareerOS has two parts that run as separate processes:

- **Backend** — FastAPI API on `http://localhost:8000`
- **Frontend** — React/Vite app on `http://localhost:3000`

Run the backend first, then the frontend, each in its own terminal.

---

## 1. Prerequisites

Install these once, on either OS:

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

The backend uses **SQLite by default** (`backend/careeros.db`) — no database server
is needed. Tables are created automatically on startup.

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

> `npm install` is required even if you cloned before — the dependency list changed,
> so an older `node_modules` / lockfile will be out of sync.

---

## 4. Golden path — manual test

Do this with **both servers running**. Steps 1–7 work with **no API keys**.
Steps marked 🔑 need optional keys (see section 5) and can be skipped.

| # | Action | Expected result |
|---|--------|-----------------|
| 1 | Open <http://localhost:3000> | Landing page loads. |
| 2 | Go to **/auth**, click **Sign Up**, enter name/email/password, tick the terms box, submit | You are redirected to **/dashboard**. (A wrong login shows an inline red error instead.) |
| 3 | Refresh the browser | You stay logged in — the dashboard still loads (the JWT is persisted). |
| 4 | Go to **Resume**, upload any PDF or DOCX résumé | Parsed sections, detected skills, and experience are shown. |
| 5 | Go to **ATS Score**, paste a job description, run the score | An overall score (0–100), a grade, and 5 dimension breakdowns appear. |
| 6 | Go to **Skill Gap**, choose a target role (e.g. *Backend Engineer*) | Missing skills and recommended courses are listed. |
| 7 | Go to **Tracker**, add an application (company, role, status, date), then change its status | The application appears in the list and the status update sticks. |
| 8 | Go to **Interview**, pick a role, **leave the job description blank**, get questions | A set of 5–8 questions from the built-in bank appears. |
| 9 | Click **Log out** | You return to **/auth**; refreshing no longer shows the app. |
| 10 🔑 | **Jobs** — search with a query/location | Job listings appear. *Needs Adzuna keys; without them the page reports "Job API key not configured".* |
| 11 🔑 | **Resume Curator** / **Cold Email** / **Interview → evaluate answer** | AI-generated output appears. *Needs `GEMINI_API_KEY`; without it these return a 503 "AI service not configured".* |

If steps **1–9** pass, the core application is working correctly.

### Optional: quick API-only check

The two key endpoints, without the UI:

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

Core features work without any keys. To enable the rest, edit `backend/.env` and
restart the backend:

| Variable | Enables | If left blank |
|----------|---------|---------------|
| `GEMINI_API_KEY` | Resume curator, cold email, interview answer evaluation | those endpoints return `503` |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Job search | `/jobs` reports "Job API key not configured" |
| `RAPIDAPI_KEY` | Extra job results (JSearch) | silently skipped |
| `TAVILY_API_KEY` | Company news line in cold emails | silently skipped |

---

## 6. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `OSError: Can't find model 'en_core_web_sm'` | spaCy model not downloaded | run `python -m spacy download en_core_web_sm` inside the activated venv |
| PowerShell: `Activate.ps1 cannot be loaded` | script execution disabled | `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then activate again |
| `uvicorn: command not found` | venv not activated | activate the venv (section 2) before running `uvicorn` |
| Login bounces back to `/auth` | backend not running, or wrong `VITE_API_URL` | start the backend; ensure `frontend/.env` points at `http://localhost:8000` |
| `npm ci` fails / odd frontend errors | stale `node_modules` after the dependency cleanup | delete `node_modules` and run `npm install` again |
| First backend start hangs for a minute | downloading the ML model (~90 MB) | wait — it is cached after the first run |

---

## 7. Notes for the next person

- **Database:** SQLite by default (`backend/careeros.db`), created automatically. To use
  Postgres instead, set the `postgresql+asyncpg://...` URL in `backend/.env` (the
  commented line is already there) and run a Postgres server.
- **Docker:** `backend/docker-compose.yml` runs the API + Postgres + Redis + Celery if
  you prefer containers — see `README.md`. It is optional; the steps above do not need it.
- **Celery:** only needed for the follow-up-email scheduler; not part of the golden path.
- There are no database migrations — the schema is built at startup, so changing a model
  means deleting `backend/careeros.db` and letting it regenerate.
