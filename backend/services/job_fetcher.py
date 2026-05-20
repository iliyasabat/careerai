from __future__ import annotations

import json
import os
from typing import Any

import httpx
import redis

from config import settings
from ml.embeddings import embed_batch, cosine_similarity
from ml.ner_extractor import extract_skills
from schemas.jobs import Job


import logging

logger = logging.getLogger("careeros.jobs")

_redis = None
_in_memory_cache: dict[str, str] = {}

try:
    if settings.redis_url and settings.redis_url.startswith(("redis://", "rediss://", "unix://")):
        _redis = redis.Redis.from_url(settings.redis_url, decode_responses=True)
    else:
        logger.info("Bypassing Redis cache: non-redis scheme.")
except Exception as e:
    logger.warning(f"Failed to initialize Redis: {e}. Bypassing to in-memory cache.")


def _cache_get(key: str) -> str | None:
    if _redis:
        try:
            return _redis.get(key)
        except Exception:
            pass
    return _in_memory_cache.get(key)


def _cache_set(key: str, value: str, expire: int = 1800) -> None:
    if _redis:
        try:
            _redis.setex(key, expire, value)
            return
        except Exception:
            pass
    _in_memory_cache[key] = value


def _cache_key(query: str, location: str, mode: str | None) -> str:
    q = (query or "").strip().lower()
    loc = (location or "").strip().lower()
    m = (mode or "").strip().lower()
    return f"jobs:{q}:{loc}:{m}"


def _dedupe(jobs: list[Job]) -> list[Job]:
    seen: set[str] = set()
    out: list[Job] = []
    for j in jobs:
        k = (j.title + "|" + j.company).lower()
        if k in seen:
            continue
        seen.add(k)
        out.append(j)
    return out


def _adzuna_to_job(result: dict[str, Any]) -> Job:
    salary_min = result.get("salary_min")
    salary_max = result.get("salary_max")
    salary = "Not disclosed"
    if salary_min and salary_max:
        salary = f"₹{int(salary_min)//100000}–{int(salary_max)//100000} LPA"
    elif salary_min:
        salary = f"₹{int(salary_min)//100000}+ LPA"

    desc = (result.get("description") or "").strip()
    mode = "Remote" if "remote" in desc.lower() else "Onsite"

    return Job(
        id=str(result.get("id")),
        title=result.get("title") or "",
        company=(result.get("company") or {}).get("display_name") or "Unknown",
        location=(result.get("location") or {}).get("display_name") or "",
        mode=mode,
        salary=salary,
        experience="1-3 years",
        match_score=50,
        posted=(result.get("created") or "")[:10],
        skills_required=extract_skills(desc)[:6],
        description=desc[:500],
        apply_url=result.get("redirect_url"),
    )


async def fetch_adzuna(
    query: str,
    location: str,
    mode: str | None = None,
    experience: str | None = None,
    salary_min: int | None = None,
) -> list[Job]:
    if not settings.adzuna_app_id or not settings.adzuna_app_key:
        raise RuntimeError("Job API key not configured")

    params: dict[str, Any] = {
        "app_id": settings.adzuna_app_id,
        "app_key": settings.adzuna_app_key,
        "what": query,
        "where": location,
        "results_per_page": 20,
        "content-type": "application/json",
    }
    if salary_min:
        params["salary_min"] = salary_min

    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, params=params)
        r.raise_for_status()
        data = r.json()

    results = data.get("results") or []
    return [_adzuna_to_job(x) for x in results]


def _jsearch_to_job(result: dict[str, Any]) -> Job:
    desc = (result.get("job_description") or "").strip()
    mode = (result.get("job_employment_type") or "").strip() or "Onsite"
    loc = (result.get("job_city") or "") or (result.get("job_location") or "")
    return Job(
        id=str(result.get("job_id") or result.get("id") or ""),
        title=result.get("job_title") or "",
        company=result.get("employer_name") or "Unknown",
        location=loc,
        mode="Remote" if "remote" in desc.lower() else mode,
        salary=result.get("job_salary_currency") or "Not disclosed",
        experience="1-3 years",
        match_score=50,
        posted=(result.get("job_posted_at_datetime_utc") or "")[:10],
        skills_required=extract_skills(desc)[:6],
        description=desc[:500],
        apply_url=result.get("job_apply_link"),
    )


async def fetch_jsearch(query: str, location: str) -> list[Job]:
    if not settings.rapidapi_key:
        return []

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": settings.rapidapi_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {"query": f"{query} in {location}", "page": 1, "num_pages": 1}
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(url, headers=headers, params=params)
        r.raise_for_status()
        data = r.json()

    results = data.get("data") or []
    return [_jsearch_to_job(x) for x in results]


async def get_jobs(
    *,
    query: str,
    location: str,
    mode: str | None = None,
    experience: str | None = None,
    salary_min: int | None = None,
    resume_embedding: list[float] | None = None,
) -> list[Job]:
    key = _cache_key(query, location, mode)
    cached = _cache_get(key)
    if cached:
        raw = json.loads(cached)
        jobs = [Job(**j) for j in raw]
    else:
        jobs = []
        errors: list[str] = []
        adzuna_configured = bool(settings.adzuna_app_id and settings.adzuna_app_key)
        jsearch_configured = bool(settings.rapidapi_key)

        if not adzuna_configured and not jsearch_configured:
            raise RuntimeError(
                "No job providers configured. Set ADZUNA_APP_ID/ADZUNA_APP_KEY "
                "or RAPIDAPI_KEY in backend/.env."
            )

        if adzuna_configured:
            try:
                jobs.extend(await fetch_adzuna(query, location, mode=mode, experience=experience, salary_min=salary_min))
            except Exception as e:
                logger.warning("Adzuna failed: %s", e)
                errors.append(f"adzuna ({type(e).__name__}): {e}")

        if jsearch_configured:
            try:
                jobs.extend(await fetch_jsearch(query, location))
            except Exception as e:
                logger.warning("JSearch failed: %s", e)
                errors.append(f"jsearch ({type(e).__name__}): {e}")

        if not jobs and errors:
            raise RuntimeError("All configured job providers failed — " + "; ".join(errors))

        jobs = _dedupe(jobs)
        _cache_set(key, json.dumps([j.model_dump() for j in jobs]), 60 * 30)

    if resume_embedding is None:
        return [j.model_copy(update={"match_score": 50}) for j in jobs]

    # Embed all jobs in one shot for performance
    texts = [f"{j.title}\n{j.description}" for j in jobs]
    jd_embeddings = embed_batch(texts)
    scored: list[Job] = []
    for j, emb in zip(jobs, jd_embeddings):
        score = int(max(0.0, min(1.0, cosine_similarity(resume_embedding, emb))) * 100)
        scored.append(j.model_copy(update={"match_score": score}))

    scored.sort(key=lambda x: x.match_score, reverse=True)
    return scored


async def get_job_by_id(job_id: str, *, query: str, location: str, mode: str | None) -> Job | None:
    key = _cache_key(query, location, mode)
    cached = _cache_get(key)
    if not cached:
        return None
    raw = json.loads(cached)
    for j in raw:
        if str(j.get("id")) == str(job_id):
            return Job(**j)
    return None
