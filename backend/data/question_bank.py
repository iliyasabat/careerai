from __future__ import annotations

# Minimum 60 questions, 12 per category:
# System Design, Backend Engineering, Database, Operating Systems, Behavioural

QUESTION_BANK: list[dict] = [
    # System Design (12)
    {"id": "sd-1", "question": "Design a URL shortener service.", "difficulty": "Medium", "category": "System Design", "model_answer": "Discuss API, storage schema, hashing/ID generation, redirects, caching, rate limiting, analytics, and scaling."},
    {"id": "sd-2", "question": "Design a real-time chat application.", "difficulty": "Medium", "category": "System Design", "model_answer": "WebSockets, message delivery guarantees, ordering, storage, presence, push notifications, and horizontal scaling."},
    {"id": "sd-3", "question": "Design a news feed for a social network.", "difficulty": "Hard", "category": "System Design", "model_answer": "Fanout strategies, ranking, caching, pagination, consistency, and write/read amplification trade-offs."},
    {"id": "sd-4", "question": "Design a job search system with caching.", "difficulty": "Medium", "category": "System Design", "model_answer": "External providers, dedupe, Redis caching keys/TTL, fallback behavior, and observability."},
    {"id": "sd-5", "question": "Design a rate limiter for an API.", "difficulty": "Medium", "category": "System Design", "model_answer": "Token bucket/leaky bucket, Redis counters, sliding window, headers, and failure modes."},
    {"id": "sd-6", "question": "Design a file upload service.", "difficulty": "Medium", "category": "System Design", "model_answer": "Multipart uploads, storage (S3), virus scanning, metadata DB, and authz."},
    {"id": "sd-7", "question": "Design an analytics event ingestion pipeline.", "difficulty": "Hard", "category": "System Design", "model_answer": "Kafka/queues, batching, idempotency, schema evolution, and storage."},
    {"id": "sd-8", "question": "Design a distributed cache.", "difficulty": "Hard", "category": "System Design", "model_answer": "Eviction policies, replication, consistency, cache stampede, and hot key mitigation."},
    {"id": "sd-9", "question": "Design an email sending system.", "difficulty": "Medium", "category": "System Design", "model_answer": "Providers, retries, bounce handling, rate limits, templates, logging, and idempotency."},
    {"id": "sd-10", "question": "Design an interview scheduling system.", "difficulty": "Medium", "category": "System Design", "model_answer": "Calendars, availability, timezones, notifications, conflict resolution."},
    {"id": "sd-11", "question": "Design a search autocomplete service.", "difficulty": "Hard", "category": "System Design", "model_answer": "Trie/FST, ranking, caching, sharding, and freshness."},
    {"id": "sd-12", "question": "Design a resume parsing pipeline.", "difficulty": "Medium", "category": "System Design", "model_answer": "Upload, parsing workers, NER, embeddings, storage, and reprocessing."},

    # Backend Engineering (12)
    {"id": "be-1", "question": "Explain idempotency and why it matters for APIs.", "difficulty": "Easy", "category": "Backend Engineering", "model_answer": "Safe retries, PUT vs POST, idempotency keys, and duplicate suppression."},
    {"id": "be-2", "question": "How do you handle pagination in a REST API?", "difficulty": "Easy", "category": "Backend Engineering", "model_answer": "Offset vs cursor, stable sorting, performance, and API response shape."},
    {"id": "be-3", "question": "What are common causes of N+1 queries and how do you fix them?", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Lazy loading, eager joins, batching, and query planning."},
    {"id": "be-4", "question": "Explain optimistic vs pessimistic locking.", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Version columns, transactions, contention, and trade-offs."},
    {"id": "be-5", "question": "How would you implement authentication using JWT?", "difficulty": "Easy", "category": "Backend Engineering", "model_answer": "Signing, claims, expiration, rotation, and middleware/dependencies."},
    {"id": "be-6", "question": "How do you design a background job system?", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Queues, retries, DLQ, idempotency, and monitoring."},
    {"id": "be-7", "question": "How do you prevent API rate limiting when calling third-party services?", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Caching, backoff, circuit breakers, concurrency limits, and batching."},
    {"id": "be-8", "question": "Explain CORS and common misconfigurations.", "difficulty": "Easy", "category": "Backend Engineering", "model_answer": "Origins, credentials, headers/methods, preflight, and security risks."},
    {"id": "be-9", "question": "How do you structure error responses in an API?", "difficulty": "Easy", "category": "Backend Engineering", "model_answer": "Consistent shape, HTTP codes, validation errors, and tracing."},
    {"id": "be-10", "question": "What is eventual consistency? Give an example.", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Async replication, caches, queues, and user-facing trade-offs."},
    {"id": "be-11", "question": "How do you safely roll out schema changes?", "difficulty": "Hard", "category": "Backend Engineering", "model_answer": "Backward-compatible changes, dual writes/reads, migrations, and feature flags."},
    {"id": "be-12", "question": "Explain how you would debug a slow API endpoint.", "difficulty": "Medium", "category": "Backend Engineering", "model_answer": "Profiling, DB query analysis, caching, timeouts, and logs/tracing."},

    # Database (12)
    {"id": "db-1", "question": "What is an index and when can it hurt performance?", "difficulty": "Easy", "category": "Database", "model_answer": "Speed reads, cost writes, storage, and selectivity."},
    {"id": "db-2", "question": "Explain ACID properties.", "difficulty": "Easy", "category": "Database", "model_answer": "Atomicity, Consistency, Isolation, Durability with examples."},
    {"id": "db-3", "question": "What isolation levels exist and what anomalies do they prevent?", "difficulty": "Hard", "category": "Database", "model_answer": "Read committed, repeatable read, serializable; phantom reads, etc."},
    {"id": "db-4", "question": "How do you model a many-to-many relationship?", "difficulty": "Easy", "category": "Database", "model_answer": "Join table with FKs, indexes, and uniqueness constraints."},
    {"id": "db-5", "question": "What is a transaction and when do you use it?", "difficulty": "Easy", "category": "Database", "model_answer": "Group operations, rollback on failure, consistency."},
    {"id": "db-6", "question": "Explain normalization and denormalization trade-offs.", "difficulty": "Medium", "category": "Database", "model_answer": "Reduce redundancy vs query speed; join costs."},
    {"id": "db-7", "question": "How do you design for high write throughput?", "difficulty": "Hard", "category": "Database", "model_answer": "Partitioning, batching, async ingestion, avoiding hotspots."},
    {"id": "db-8", "question": "What is JSONB and when is it useful in PostgreSQL?", "difficulty": "Medium", "category": "Database", "model_answer": "Flexible schema, indexing, querying nested fields."},
    {"id": "db-9", "question": "Explain the difference between LEFT JOIN and INNER JOIN.", "difficulty": "Easy", "category": "Database", "model_answer": "Row preservation vs matching rows only."},
    {"id": "db-10", "question": "What are common causes of deadlocks and how do you mitigate them?", "difficulty": "Hard", "category": "Database", "model_answer": "Lock ordering, shorter transactions, retries."},
    {"id": "db-11", "question": "How do you implement full-text search in PostgreSQL?", "difficulty": "Medium", "category": "Database", "model_answer": "tsvector/tsquery, GIN indexes, ranking."},
    {"id": "db-12", "question": "Explain caching strategies for DB-heavy endpoints.", "difficulty": "Medium", "category": "Database", "model_answer": "Redis, cache-aside, invalidation, TTL, and stampede protection."},

    # Operating Systems (12)
    {"id": "os-1", "question": "What is the difference between a process and a thread?", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Address space isolation vs shared memory, scheduling implications."},
    {"id": "os-2", "question": "Explain virtual memory and paging.", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "Page tables, page faults, and performance trade-offs."},
    {"id": "os-3", "question": "What is a file descriptor?", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Integer handle to OS resources like files/sockets."},
    {"id": "os-4", "question": "How does a TCP connection get established and terminated?", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "3-way handshake, FIN/ACK, TIME_WAIT."},
    {"id": "os-5", "question": "What causes a context switch and why is it expensive?", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "CPU state save/restore, cache/TLB effects."},
    {"id": "os-6", "question": "Explain deadlock conditions.", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "Mutual exclusion, hold-and-wait, no preemption, circular wait."},
    {"id": "os-7", "question": "What is a mutex vs semaphore?", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "Ownership, counting, use-cases."},
    {"id": "os-8", "question": "What is a race condition? Give an example.", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Concurrent access without synchronization."},
    {"id": "os-9", "question": "What is the difference between synchronous and asynchronous I/O?", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Blocking vs event-driven completion, throughput implications."},
    {"id": "os-10", "question": "Explain CPU scheduling basics (preemptive vs non-preemptive).", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Time slicing, fairness, latency vs throughput."},
    {"id": "os-11", "question": "What is DNS and how does resolution work at a high level?", "difficulty": "Easy", "category": "Operating Systems", "model_answer": "Recursive resolver, caching, authoritative servers."},
    {"id": "os-12", "question": "How do you investigate high memory usage in a service?", "difficulty": "Medium", "category": "Operating Systems", "model_answer": "Metrics, heap profiling, leak detection, and load testing."},

    # Behavioural (12)
    {"id": "bh-1", "question": "Tell me about a time you handled a tight deadline.", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Use STAR: prioritize, communicate trade-offs, deliver incrementally."},
    {"id": "bh-2", "question": "Describe a time you disagreed with a teammate and how you resolved it.", "difficulty": "Medium", "category": "Behavioural", "model_answer": "Data-driven discussion, align on goals, propose experiments, document decision."},
    {"id": "bh-3", "question": "Tell me about a failure and what you learned.", "difficulty": "Medium", "category": "Behavioural", "model_answer": "Own it, focus on learning, prevention, and process improvements."},
    {"id": "bh-4", "question": "How do you handle ambiguous requirements?", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Clarify stakeholders, define success criteria, prototype, iterate."},
    {"id": "bh-5", "question": "Describe a time you improved a system’s performance.", "difficulty": "Medium", "category": "Behavioural", "model_answer": "Measure first, optimize bottleneck, validate impact, and prevent regressions."},
    {"id": "bh-6", "question": "Tell me about a time you took initiative.", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Identify problem, propose solution, execute, and share results."},
    {"id": "bh-7", "question": "How do you prioritize tasks when everything seems urgent?", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Impact vs urgency, align with goals, communicate, timebox."},
    {"id": "bh-8", "question": "Tell me about mentoring or helping someone.", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Explain approach, pair, unblock, and encourage independence."},
    {"id": "bh-9", "question": "Describe a project you’re proud of.", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Scope, constraints, your contributions, results, and lessons."},
    {"id": "bh-10", "question": "How do you respond to critical feedback?", "difficulty": "Easy", "category": "Behavioural", "model_answer": "Listen, clarify, act, follow up, and improve."},
    {"id": "bh-11", "question": "Describe a time you improved reliability or reduced incidents.", "difficulty": "Medium", "category": "Behavioural", "model_answer": "Root cause analysis, fixes, monitoring, runbooks, and postmortems."},
    {"id": "bh-12", "question": "Tell me about a time you worked cross-functionally.", "difficulty": "Medium", "category": "Behavioural", "model_answer": "Align, communicate, manage expectations, and deliver outcomes."},
]


ROLE_TO_CATEGORIES: dict[str, list[str]] = {
    "Backend Engineer": ["System Design", "Backend Engineering", "Database"],
    "Frontend Engineer": ["System Design", "Backend Engineering", "Behavioural"],
    "Data Scientist": ["Database", "Behavioural", "System Design"],
}

