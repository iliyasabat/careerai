from __future__ import annotations

from ml.embeddings import cosine_similarity


def job_match_score(resume_embedding: list[float], jd_embedding: list[float]) -> int:
    score = int(max(0.0, min(1.0, cosine_similarity(resume_embedding, jd_embedding))) * 100)
    return score


def rank_jobs(resume_embedding: list[float], jobs: list) -> list:
    # Sprint 2 enriches Job objects with embeddings; here we sort by existing match_score if present.
    return sorted(jobs, key=lambda j: getattr(j, "match_score", 0), reverse=True)
