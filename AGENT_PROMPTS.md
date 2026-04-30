# CareerOS — Agent Prompts
# Sprint 1 → OpenCode | Sprint 2 → Cursor | Sprint 3 → Antigravity
# Copy the relevant section for each tool. Do NOT share another agent's prompt with the wrong tool.

===========================================================================================
PROMPT 1 — OPENCODE (Sprint 1 of 3)
===========================================================================================

You are OpenCode, sprint 1 of 3 on the CareerOS project. You are building the Python FastAPI
backend for an AI-powered job search platform. The React frontend already exists — your job is
to build everything the frontend needs to talk to.

---

Step 1 — Read these files in full before doing anything else:
  - IMPLEMENTATION_PLAN.md (entire file — every section, every word)
  - TODOS.md

Step 2 — First git action:
  git checkout -b feat/careeros-backend

Step 3 — Install spaCy model (run this once before any code):
  pip install -r backend/requirements.txt --break-system-packages
  python -m spacy download en_core_web_sm

Step 4 — Execute your sprint scope. Your tracks are A, B, C, D, E.
  Defined in full in Section 3 of IMPLEMENTATION_PLAN.md.

  CRITICAL ORDERING — do these in exact order:
  1. Track A first: scaffold every folder and file (empty stubs are fine). Do NOT skip any file.
     The docker-compose.yml must be complete and working (FastAPI + PostgreSQL + Redis).
  2. Track B second: write all SQLAlchemy models. These must exist before routes reference them.
  3. Track E third: write the ML layer (embeddings.py, ner_extractor.py, similarity.py).
     The sentence-transformers model and spaCy model must load at startup using a module-level
     singleton (not inside a function). Use @lru_cache or a module-level variable.
  4. Track C fourth: write auth routes. JWT must work end-to-end (register → get token → use token).
  5. Track D fifth: write the resume parser service and upload endpoint.
     The upload endpoint must accept multipart/form-data, parse the file, call embed_text() on the
     raw text, and save the full ParsedResume (including embedding as JSON list) to the DB.
  6. Write ALL Pydantic schemas in Section 2 of IMPLEMENTATION_PLAN.md to /backend/schemas/.
     These are LOCKED — Cursor and Antigravity import from here. Write them exactly as specified.

  DO NOT:
  - Add any LLM (Claude API) calls — those are Antigravity's job
  - Write Alembic migration files — SQLAlchemy models only
  - Modify any file in /frontend/ except /frontend/src/api/client.js if baseURL needs setting

Step 5 — Smoke test. Both must pass before you write your handoff log:
  cd backend && python -c "from main import app; print('Backend import OK')"
  cd frontend && npm run build

  Also manually verify: uvicorn main:app --reload starts without errors.

Step 6 — Append your handoff log entry to Section 7 of IMPLEMENTATION_PLAN.md.
  Use the template defined there. Be specific about failures — Cursor needs to know exactly what broke.

Step 7 — Closing commit:
  git add -A
  git commit -m "sprint 1 complete (opencode)"
  (or "sprint 1 complete with failures (opencode)" if smoke test failed — document in Section 7)

---

Commit hygiene (non-negotiable):
- Every commit: 5–10 words, no body, suffix (opencode)
- NEVER mention any AI tool, assistant, or agent name in commits, code, or comments
- Strip any Co-Authored-By trailers your tooling adds automatically
- Do NOT push to remote

---

Skills keyword list for ner_extractor.py (copy this exactly into the extractor):
Python, JavaScript, TypeScript, Java, Go, Rust, C++, C#, Ruby, PHP, Swift, Kotlin, Scala,
FastAPI, Django, Flask, Express.js, Spring Boot, NestJS, Rails, Laravel,
React, Vue.js, Angular, Next.js, Svelte, HTML, CSS, Tailwind CSS,
PostgreSQL, MySQL, SQLite, MongoDB, Redis, Cassandra, DynamoDB, Elasticsearch,
Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, GitLab CI, CircleCI,
AWS, GCP, Azure, Vercel, Netlify, Heroku, Railway,
Machine Learning, Deep Learning, NLP, Computer Vision, PyTorch, TensorFlow, Keras,
scikit-learn, Pandas, NumPy, Matplotlib, Seaborn, Jupyter,
LangChain, OpenAI, Anthropic, HuggingFace, FAISS, ChromaDB,
REST APIs, GraphQL, gRPC, WebSockets, Kafka, RabbitMQ, Celery,
Git, Linux, Bash, SQL, NoSQL, Microservices, System Design, CI/CD,
Agile, Scrum, Product Management, Figma, Postman, Jira

===========================================================================================
PROMPT 2 — CURSOR (Sprint 2 of 3)
===========================================================================================

You are Cursor, sprint 2 of 3 on the CareerOS project. OpenCode has finished sprint 1 and
committed on branch feat/careeros-backend. You continue on the same branch.
The Python FastAPI scaffold, DB models, ML layer, auth, and resume parser are done.
Your job is to implement the core feature services: job search, ATS scoring, skill gap detection,
application tracker, and the static interview question bank.

---

Step 1 — Read these files in full before doing anything else:
  - IMPLEMENTATION_PLAN.md (all sections — pay special attention to Sections 1, 2, 4, and 7)
  - TODOS.md
  - Section 7 of IMPLEMENTATION_PLAN.md: read OpenCode's handoff log carefully.
    If OpenCode documented failures, fix them FIRST before starting your tracks.

Step 2 — Confirm branch and install:
  git status   (confirm you are on feat/careeros-backend)
  pip install -r backend/requirements.txt --break-system-packages
  cd frontend && npm ci

Step 3 — Execute your sprint scope. Your tracks are F, G, H, I.
  Defined in full in Section 4 of IMPLEMENTATION_PLAN.md.

  CRITICAL ORDERING:
  1. Track F (Job Search) first — needed by dashboard and jobs page immediately.
     The Redis cache is essential — implement it properly or the Adzuna/JSearch APIs will rate-limit.
     Cache key format: "jobs:{query}:{location}:{mode}" (lowercase all values).
     If ADZUNA_APP_ID is not set in .env, return an informative error: {"detail": "Job API key not configured"}.
     If RAPIDAPI_KEY is not set, skip JSearch silently (only Adzuna results).
     Match scoring: the endpoint must accept an optional header X-Resume-Id. If present, fetch the
     resume embedding from DB and compute match_score per job. If absent, set match_score=50 for all.

  2. Track G (ATS Scorer) second.
     This is fully deterministic Python — zero LLM calls. Use only: the schemas from /backend/schemas/,
     the ML layer from /backend/ml/, and standard Python.
     The endpoint POST /api/ats/score must complete in under 3 seconds for any input.
     All 5 dimensions must be implemented exactly as specified in Section 4.

  3. Track H (Skill Gap) third.
     The role→required_skills fallback dictionary must cover at minimum these 15 roles:
     Backend Engineer, Frontend Engineer, Full Stack Developer, Data Scientist, ML Engineer,
     Data Engineer, DevOps Engineer, Cloud Engineer, Mobile Developer (Android), Mobile Developer (iOS),
     Product Manager, QA Engineer, Security Engineer, Blockchain Developer, UI/UX Designer
     The course database: create a Python dict (not a separate DB) in /backend/data/courses.py
     with at minimum 5 courses per skill for these 15 skills: Python, FastAPI, Docker, Redis,
     Kubernetes, AWS, React, TypeScript, PostgreSQL, Machine Learning, System Design, Git, CI/CD,
     TensorFlow, Node.js. All courses must have real URLs (actual YouTube/Coursera/Udemy links).

  4. Track I (Tracker + Interview Questions) last.
     The question bank: create /backend/data/question_bank.py with minimum 60 questions,
     12 per category: System Design, Backend Engineering, Database, Operating Systems, Behavioural.
     Each question: {id, question, difficulty, category, model_answer}.
     Role-to-category mapping: Backend Engineer → System Design + Backend + Database.
     Frontend Engineer → System Design + Backend(light) + Behavioural.
     Data Scientist → Database + Behavioural + (use System Design questions tagged data-infra).
     The evaluate endpoint (POST /api/interview/evaluate) is a STUB for now — return a fixed mock
     Evaluation response. Antigravity upgrades it with real LLM calls in Sprint 3.

  DO NOT:
  - Make any Claude API / LLM calls — those are Antigravity's job
  - Modify /backend/schemas/ — those are locked from Sprint 1
  - Modify any /frontend/ page or component files

Step 4 — Smoke test. All must pass:
  python -c "from main import app; print('OK')"   (in /backend)
  npm run build                                     (in /frontend)
  
  Additionally test these with curl or httpx:
  GET  /health                   → 200 {"status":"ok"}
  POST /api/auth/login           → 200 with token
  POST /api/resume/upload        → 200 with resume_id
  POST /api/ats/score            → 200 with overall_score (integer, 0-100)
  GET  /api/jobs?query=python    → 200 with array (may be empty if API keys missing — that is OK)
  POST /api/skills/gap           → 200 with missing_skills array
  GET  /api/tracker              → 200 with empty array (no data yet is fine)
  POST /api/interview/questions  → 200 with array of 5-8 questions

Step 5 — Append your handoff log to Section 7 of IMPLEMENTATION_PLAN.md.
  Be specific: list every endpoint that works, every endpoint that is stubbed, every failure.
  Antigravity reads this before starting.

Step 6 — Closing commit:
  git add -A
  git commit -m "sprint 2 complete (cursor)"
  (or "sprint 2 complete with failures (cursor)" if any smoke test failed)

---

Commit hygiene (non-negotiable):
- Every commit: 5–10 words, no body, suffix (cursor)
- NEVER mention any AI tool, assistant, or agent name in commits, code, or comments
- Strip any Co-Authored-By trailers
- Do NOT push to remote

---

Implementation notes for Track F (Adzuna API mapping):
Adzuna response → Job schema mapping:
  id          = result["id"]
  title       = result["title"]
  company     = result.get("company", {}).get("display_name", "Unknown")
  location    = result.get("location", {}).get("display_name", "")
  salary      = f'₹{result.get("salary_min",0)//100000}–{result.get("salary_max",0)//100000} LPA' if result.get("salary_min") else "Not disclosed"
  description = result.get("description", "")[:500]
  apply_url   = result.get("redirect_url", "")
  mode        = "Remote" if "remote" in result.get("description","").lower() else "Onsite"
  experience  = "1-3 years"  # Adzuna doesn't always provide this cleanly
  posted      = result.get("created", "")[:10]
  skills_required = extract_skills(result.get("description",""))[:6]

===========================================================================================
PROMPT 3 — ANTIGRAVITY (Sprint 3 of 3)
===========================================================================================

You are Antigravity, sprint 3 of 3 on the CareerOS project. This is the final sprint.
OpenCode built the backend scaffold, ML layer, auth, and resume parser.
Cursor built job search, ATS scoring, skill gap detection, tracker, and the interview question bank.
Your job is to: implement all LLM-powered features (resume curator, cold email, interview evaluator),
add the Celery follow-up scheduler, and wire the entire frontend to the real backend.
After this sprint, CareerOS must be a fully working, end-to-end application.

---

Step 1 — Read these files in full before doing anything else:
  - IMPLEMENTATION_PLAN.md (entire file — especially Sections 1, 2, 5, and 7)
  - TODOS.md
  - Section 7 of IMPLEMENTATION_PLAN.md: read BOTH OpenCode's and Cursor's handoff logs.
    Fix ALL documented failures before starting your tracks. This is your first task.

Step 2 — Confirm and install:
  git status   (confirm you are on feat/careeros-backend)
  pip install -r backend/requirements.txt --break-system-packages
  cd frontend && npm ci

Step 3 — Fix failures first.
  Go through every failure logged in Section 7 of IMPLEMENTATION_PLAN.md.
  Fix each one. Commit each fix separately with message: "fix: [brief description] (antigravity)"

Step 4 — Execute your sprint scope. Your tracks are J, K, L, M.
  Defined in full in Section 5 of IMPLEMENTATION_PLAN.md.

  CRITICAL ORDERING:
  1. Track J (Resume Curator) first.
     The hallucination guard is non-negotiable — implement it exactly as specified.
     Use asyncio.gather to rewrite all weak bullets in parallel (not one at a time).
     If ANTHROPIC_API_KEY is not set in .env, return a 503 with {"detail": "AI service not configured"}.
     Test with a real weak bullet: "Responsible for backend work" should produce something like
     "Developed and maintained RESTful backend APIs supporting core product functionality".
     The endpoint POST /api/curator/curate must return in under 10 seconds for a 3-bullet resume.

  2. Track K (Cold Email) second.
     The Tavily news hook is optional and must fail silently.
     Test all 3 tone variants are distinct — if formal and conversational sound the same, the prompt
     needs adjustment. Add to the system prompt: "formal = third-person professional distance,
     conversational = first-name basis, casual but smart, referral = open by naming the referrer."
     The email body must reference something specific from the JD — not just the job title.
     Ensure word_count is accurately calculated (len(body.split())).

  3. Track L (Interview Evaluator) third.
     The static question bank from Cursor becomes dynamic when job_description is provided.
     When job_description IS provided: call Claude to generate 5 questions directly from JD content.
     When job_description is NOT provided: fall back to Cursor's static question bank.
     For the evaluator: the improved_answer must be substantive (>50 words), not a copy of the
     original. If Claude returns invalid JSON, retry once with a stricter prompt before failing.

  4. Track M (Celery + Frontend wiring) LAST — this is the most important track.
     
     CELERY SETUP:
     - /backend/workers/celery_app.py: configure Celery with Redis broker and backend
     - /backend/workers/follow_up.py: daily beat task for follow-up email reminders
     - Add to docker-compose.yml: a celery-worker service and celery-beat service

     FRONTEND WIRING (most critical part of the entire project):
     Open /frontend/src/api/index.js. This file currently has mock functions.
     Replace every function with a real Axios call. Here is the EXACT replacement map:

     uploadResume(file):
       const formData = new FormData(); formData.append('file', file);
       const res = await client.post('/api/resume/upload', formData);
       return res.data;

     getATSScore(resumeId, jobDescription):
       const res = await client.post('/api/ats/score', {resume_id: resumeId, job_description: jobDescription});
       return res.data;

     curateResume(resumeId, jobDescription):
       const res = await client.post('/api/curator/curate', {resume_id: resumeId, job_description: jobDescription});
       return res.data;

     searchJobs(filters):
       const resumeId = localStorage.getItem('resume_id');
       const config = resumeId ? {headers: {'X-Resume-Id': resumeId}} : {};
       const res = await client.get('/api/jobs', {params: filters, ...config});
       return res.data;

     getSkillGap(resumeId, targetRole):
       const res = await client.post('/api/skills/gap', {resume_id: resumeId, target_role: targetRole});
       return res.data;

     generateEmail(params):
       const res = await client.post('/api/email/generate', params);
       return res.data;

     getApplications():
       const res = await client.get('/api/tracker');
       return res.data;

     addApplication(data):
       const res = await client.post('/api/tracker', data);
       return res.data;

     updateApplication(id, data):
       const res = await client.patch(`/api/tracker/${id}`, data);
       return res.data;

     getInterviewQuestions(role, jobDescription):
       const res = await client.post('/api/interview/questions', {role, job_description: jobDescription});
       return res.data;

     evaluateAnswer(questionId, questionText, answerText, role):
       const res = await client.post('/api/interview/evaluate', {question_id: questionId, question_text: questionText, answer_text: answerText, role});
       return res.data;

     After uploading resume successfully, store the resume_id in localStorage:
       localStorage.setItem('resume_id', data.resume_id);

     Also ensure /frontend/src/api/client.js:
       - Sets Authorization header: `Bearer ${localStorage.getItem('careeros_token')}`
       - On 401 response: clear localStorage and redirect to /auth
     
     Create /frontend/.env if it doesn't exist:
       VITE_API_URL=http://localhost:8000

Step 5 — Full end-to-end smoke test. ALL of these must work:
  # Backend
  python -c "from main import app; print('OK')"
  
  # All endpoints
  curl -X POST localhost:8000/api/auth/register -H "Content-Type: application/json" \
    -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
  # → {"token":"...","user":{...}}

  curl -X POST localhost:8000/api/interview/evaluate \
    -H "Authorization: Bearer {token}" \
    -H "Content-Type: application/json" \
    -d '{"question_id":"1","question_text":"Tell me about yourself","answer_text":"I am a backend engineer with 2 years experience building APIs","role":"Backend Engineer"}'
  # → {"star_score": int, "feedback": "...", "missing_elements": [...], "improved_answer": "..."}

  # Frontend
  cd frontend && npm run build   # must exit 0

Step 6 — Append your handoff log to Section 7 of IMPLEMENTATION_PLAN.md.
  Mark the project as COMPLETE or list remaining issues clearly.

Step 7 — Final commit:
  git add -A
  git commit -m "sprint 3 complete, all features wired (antigravity)"

---

Commit hygiene (non-negotiable):
- Every commit: 5–10 words, no body, suffix (antigravity)  
- NEVER mention any AI tool, assistant, or agent name in commits, code, or comments
- Strip Co-Authored-By trailers
- Do NOT push to remote — human pushes after you finish

---

Claude API usage notes (use anthropic SDK throughout):
  from anthropic import Anthropic
  client_ai = Anthropic()   # reads ANTHROPIC_API_KEY from env automatically
  
  message = client_ai.messages.create(
      model="claude-sonnet-4-20250514",
      max_tokens=1000,
      system="your system prompt",
      messages=[{"role": "user", "content": "your user message"}]
  )
  result_text = message.content[0].text

  For parallel calls use asyncio with httpx or run sync calls in executor:
  import asyncio
  from concurrent.futures import ThreadPoolExecutor
  
  async def generate_all_variants(prompts):
      loop = asyncio.get_event_loop()
      with ThreadPoolExecutor(max_workers=3) as executor:
          tasks = [loop.run_in_executor(executor, call_claude, p) for p in prompts]
          return await asyncio.gather(*tasks)

  Always wrap Claude calls in try/except anthropic.APIError and return a 503 with a clear message.
  Never let an API key error crash the entire server.
