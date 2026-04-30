export const mockUser = {
  id: '1', name: 'Arjun Sharma', email: 'arjun.sharma@gmail.com', avatar: 'AS'
}

export const mockATSResult = {
  overall_score: 68,
  grade: 'C+',
  dimensions: {
    keyword_match:        { score: 18, max: 30, missing: ['Docker', 'CI/CD', 'FastAPI', 'Redis', 'Kubernetes'] },
    section_completeness: { score: 14, max: 20, missing: ['Summary', 'Certifications'] },
    bullet_strength:      { score: 16, max: 25, weak_bullets: [
      'Responsible for managing the backend API for e-commerce platform',
      'Worked on database optimisation tasks',
      'Helped with frontend development using React'
    ]},
    format_quality:       { score: 12, max: 15 },
    experience_fit:       { score: 8,  max: 10, required: '2+ years', found: '1.5 years' }
  },
  recommendation: 'Add a Summary section and quantify at least 3 experience bullets with metrics. Adding Docker and CI/CD to your skills section will significantly improve your keyword match score.'
}

export const mockCurationResult = {
  bullets: [
    {
      id: '1',
      original: 'Responsible for managing the backend API for e-commerce platform',
      rewritten: 'Architected and maintained RESTful APIs for a high-traffic e-commerce platform serving 10K+ daily users',
      status: 'pending' // 'accepted' | 'rejected' | 'pending'
    },
    {
      id: '2',
      original: 'Worked on database optimisation tasks',
      rewritten: 'Optimised PostgreSQL queries and added indexing strategies, reducing average response time by 35%',
      status: 'pending'
    },
    {
      id: '3',
      original: 'Helped with frontend development using React',
      rewritten: 'Built 8 reusable React components for the checkout flow, improving UI consistency across 3 product pages',
      status: 'pending'
    }
  ]
}

export const mockJobs = [
  {
    id: '1', title: 'Backend Engineer', company: 'Razorpay', location: 'Bangalore',
    mode: 'Hybrid', salary: '18–24 LPA', experience: '2–4 years',
    match_score: 82, posted: '2 days ago',
    skills_required: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    description: 'Join our payments infrastructure team...'
  },
  {
    id: '2', title: 'Software Engineer — Python', company: 'Zepto', location: 'Mumbai',
    mode: 'Onsite', salary: '15–20 LPA', experience: '1–3 years',
    match_score: 74, posted: '1 day ago',
    skills_required: ['Python', 'Django', 'MySQL', 'Celery', 'AWS'],
    description: 'Build the backend for India\'s fastest grocery delivery...'
  },
  {
    id: '3', title: 'Full Stack Developer', company: 'Groww', location: 'Bangalore',
    mode: 'Hybrid', salary: '20–28 LPA', experience: '2–5 years',
    match_score: 61, posted: '3 days ago',
    skills_required: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Kubernetes'],
    description: 'Work on India\'s largest retail investment platform...'
  },
  {
    id: '4', title: 'ML Engineer', company: 'PhonePe', location: 'Bangalore',
    mode: 'Onsite', salary: '22–30 LPA', experience: '2–4 years',
    match_score: 55, posted: '5 days ago',
    skills_required: ['Python', 'PyTorch', 'MLflow', 'Spark', 'Kubernetes'],
    description: 'Build fraud detection and recommendation models...'
  },
  {
    id: '5', title: 'Backend Engineer — Go', company: 'CRED', location: 'Bangalore',
    mode: 'Remote', salary: '25–35 LPA', experience: '3–6 years',
    match_score: 41, posted: '1 week ago',
    skills_required: ['Go', 'gRPC', 'Kafka', 'PostgreSQL', 'Docker'],
    description: 'Scale our credit management infrastructure...'
  },
  {
    id: '6', title: 'Python Developer', company: 'Meesho', location: 'Bangalore',
    mode: 'Hybrid', salary: '14–18 LPA', experience: '1–2 years',
    match_score: 88, posted: '6 hours ago',
    skills_required: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    description: 'Build seller tools for India\'s fastest growing e-commerce...'
  }
]

export const mockSkillGap = {
  target_role: 'Backend Engineer',
  your_skills: ['Python', 'Django', 'PostgreSQL', 'React', 'Git', 'REST APIs', 'HTML/CSS', 'JavaScript'],
  required_skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'CI/CD', 'Kubernetes', 'System Design', 'Git', 'AWS'],
  missing_skills: ['FastAPI', 'Docker', 'Redis', 'CI/CD', 'Kubernetes', 'System Design', 'AWS'],
  courses: {
    'FastAPI': [
      { title: 'FastAPI Full Course', platform: 'YouTube', instructor: 'Traversy Media', duration: '3 hrs', free: true, url: 'https://youtube.com' },
      { title: 'FastAPI — Modern Python APIs', platform: 'Udemy', instructor: 'Jose Salvatierra', duration: '7 hrs', free: false, rating: 4.7, url: 'https://udemy.com' },
      { title: 'FastAPI Official Tutorial', platform: 'Docs', instructor: 'FastAPI', duration: '2 hrs', free: true, url: 'https://fastapi.tiangolo.com' }
    ],
    'Docker': [
      { title: 'Docker for Beginners', platform: 'YouTube', instructor: 'TechWorld with Nana', duration: '4 hrs', free: true, url: 'https://youtube.com' },
      { title: 'Docker & Kubernetes: The Complete Guide', platform: 'Udemy', instructor: 'Stephen Grider', duration: '22 hrs', free: false, rating: 4.8, url: 'https://udemy.com' },
      { title: 'Play with Docker', platform: 'Labs', instructor: 'Docker Inc', duration: '1 hr', free: true, url: 'https://labs.play-with-docker.com' }
    ],
    'Redis': [
      { title: 'Redis Crash Course', platform: 'YouTube', instructor: 'Traversy Media', duration: '1.5 hrs', free: true, url: 'https://youtube.com' },
      { title: 'Redis University RU101', platform: 'Redis University', instructor: 'Redis', duration: '5 hrs', free: true, url: 'https://university.redis.com' },
      { title: 'Redis in Action', platform: 'Book', instructor: 'Manning', duration: 'Self-paced', free: false, url: 'https://redis.com' }
    ]
  }
}

export const mockEmailResult = {
  subject: 'Backend Engineer Role — Python/FastAPI at Razorpay',
  variants: {
    formal: {
      subject: 'Application: Backend Engineer — Python/FastAPI at Razorpay',
      body: `Dear Priya,\n\nRazorpay's shift toward event-driven payments infrastructure and its recent launch of RazorpayX Business Banking caught my attention.\n\nI am a backend engineer with 1.5 years of experience building high-throughput REST APIs in Python and Django. I recently migrated a monolithic service to a microservices architecture, cutting deployment time by 40%. I also have hands-on experience with PostgreSQL query optimisation — reducing p99 latency from 800ms to 210ms on a product search endpoint.\n\nI believe these directly align with what your infrastructure team is scaling. I would welcome a 15-minute conversation to discuss further.\n\nBest regards,\nArjun Sharma\narjun.sharma@gmail.com`
    },
    conversational: {
      subject: 'Backend Engineer at Razorpay — Would love to chat',
      body: `Hi Priya,\n\nRazorpay's recent push into event-driven architecture is exactly the kind of infrastructure challenge I want to work on.\n\nI've spent the last 1.5 years building Python backends — recently led a migration from monolith to microservices that cut deployment cycles by 40%, and optimised a PostgreSQL search endpoint from 800ms to 210ms. Both feel relevant to what Razorpay's payments infra team is working on.\n\nWould you be open to a quick 15-minute call this week?\n\nThanks,\nArjun`
    },
    referral: {
      subject: 'Backend Engineer Role — Referred by Rahul Verma',
      body: `Hi Priya,\n\nRahul Verma (Senior Engineer, Platform team) suggested I reach out regarding the Backend Engineer opening.\n\nI've built and maintained high-throughput Python APIs serving 10K+ daily users and led a microservices migration that reduced deployment time by 40%. I also optimised PostgreSQL query performance significantly on a previous project — skills Rahul mentioned align well with what your team needs.\n\nWould a brief call work this week?\n\nBest,\nArjun Sharma`
    }
  }
}

export const mockApplications = [
  { id: '1', company: 'Razorpay', role: 'Backend Engineer', status: 'Interview', date: '2025-04-15', days_since: 15, notes: 'Technical round scheduled May 2nd' },
  { id: '2', company: 'Zepto', role: 'Software Engineer', status: 'Screening', date: '2025-04-20', days_since: 10, notes: 'HR call done, waiting for technical' },
  { id: '3', company: 'Groww', role: 'Full Stack Developer', status: 'Applied', date: '2025-04-25', days_since: 5, notes: '' },
  { id: '4', company: 'PhonePe', role: 'ML Engineer', status: 'Rejected', date: '2025-04-10', days_since: 20, notes: 'Not enough ML experience' },
  { id: '5', company: 'Meesho', role: 'Python Developer', status: 'Applied', date: '2025-04-28', days_since: 2, notes: 'Applied via referral from college senior' },
  { id: '6', company: 'Swiggy', role: 'Backend Engineer', status: 'Offer', date: '2025-04-01', days_since: 29, notes: '22 LPA offer, deciding' },
  { id: '7', company: 'CRED', role: 'Backend Engineer', status: 'Applied', date: '2025-04-27', days_since: 3, notes: '' },
  { id: '8', company: 'Dunzo', role: 'Software Engineer', status: 'Screening', date: '2025-04-18', days_since: 12, notes: 'Take-home assignment submitted' }
]

export const mockInterviewQuestions = [
  {
    id: '1', difficulty: 'Medium',
    question: 'Design a URL shortener service. Walk me through the system design.',
    model_answer: 'Start with requirements: 100M URLs/day, reads 10x writes. Use a hash function (MD5/base62) to generate 7-char short codes. Store in SQL (id, short_code, long_url, created_at). Cache hot URLs in Redis. For scale: add a distributed ID generator, horizontal sharding on short_code, CDN for reads.',
    category: 'System Design'
  },
  {
    id: '2', difficulty: 'Easy',
    question: 'What is the difference between a process and a thread?',
    model_answer: 'A process is an independent program in execution with its own memory space. A thread is a lightweight unit of execution within a process, sharing memory. Threads are faster to create and communicate but share state (risk of race conditions). Use threads for I/O-bound tasks, processes for CPU-bound tasks in Python (due to GIL).',
    category: 'OS Concepts'
  },
  {
    id: '3', difficulty: 'Hard',
    question: 'How would you handle database migration with zero downtime in production?',
    model_answer: 'Use the expand-contract pattern: (1) Expand — add new column as nullable, deploy code that writes to both old and new. (2) Migrate — backfill existing rows in batches. (3) Contract — make new column required, remove old. Never rename/drop in one deploy. Use Alembic for versioned migrations. Feature flags to control rollout.',
    category: 'Backend'
  },
  {
    id: '4', difficulty: 'Medium',
    question: 'Explain how you would optimise a slow SQL query.',
    model_answer: 'Step 1: Run EXPLAIN ANALYZE to see query plan. Step 2: Check if indices are being used — add composite index on filtered/joined columns. Step 3: Avoid SELECT *, fetch only needed columns. Step 4: Check N+1 queries — use JOINs or eager loading. Step 5: Consider query result caching with Redis. Step 6: If table is huge, consider partitioning.',
    category: 'Databases'
  },
  {
    id: '5', difficulty: 'Easy',
    question: 'Tell me about a time you handled a production incident. How did you respond?',
    model_answer: 'Use STAR format. Situation: describe the incident clearly (service down, latency spike). Task: your role in the response. Action: specific steps — acknowledged alert, checked logs, identified root cause, hotfix or rollback, communicated status. Result: quantify recovery time, what you learned, what monitoring/prevention you added.',
    category: 'Behavioural'
  }
]
