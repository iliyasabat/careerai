from __future__ import annotations

import re
from dataclasses import dataclass

from ml.embeddings import cosine_similarity, embed_text
from ml.ner_extractor import extract_skills
from schemas.ats import ATSDimension, ATSResult
from schemas.resume import ParsedResume


_EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.IGNORECASE)
_PHONE_RE = re.compile(r"(\+\d{1,3}[- ]?)?\b\d{10}\b")


def _grade(score: int) -> str:
    if score >= 90:
        return "A"
    if score >= 75:
        return "B"
    if score >= 60:
        return "C"
    if score >= 45:
        return "D"
    return "F"


def _extract_required_years(jd: str) -> tuple[int | None, int | None]:
    # Returns (min, max) where max may be None
    m = re.search(r"(\d+)\+?\s*years?", jd, re.IGNORECASE)
    if m:
        return int(m.group(1)), None
    m = re.search(r"(\d+)\s*[–-]\s*(\d+)\s*years?", jd, re.IGNORECASE)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None, None


def score_ats(parsed_resume: ParsedResume, job_description: str) -> ATSResult:
    resume_text = "\n".join(parsed_resume.sections.values())
    jd_text = job_description or ""

    # Dimension 1 — keyword_match (max 30)
    # Reuse precomputed resume embedding from upload when available
    resume_emb = parsed_resume.embedding or embed_text(resume_text)
    jd_emb = embed_text(jd_text)
    sem = max(0.0, min(1.0, cosine_similarity(resume_emb, jd_emb))) * 20.0

    resume_skills = {s.lower() for s in parsed_resume.skills}
    jd_skills = {s.lower() for s in extract_skills(jd_text)}
    overlap = 0.0
    missing = []
    if jd_skills:
        overlap = (len(resume_skills & jd_skills) / len(jd_skills)) * 10.0
        missing = sorted(list(jd_skills - resume_skills))[:5]

    dim_keyword = ATSDimension(score=int(sem + overlap), max=30, missing=missing)

    # Dimension 2 — section_completeness (max 20)
    sections_lower = {k.lower(): v for k, v in parsed_resume.sections.items()}
    pts = 0
    if any(k in sections_lower for k in ["summary", "objective"]):
        pts += 4
    if "experience" in sections_lower:
        pts += 5
    if "education" in sections_lower:
        pts += 3
    if "skills" in sections_lower:
        pts += 4
    if "projects" in sections_lower:
        pts += 2
    if "certifications" in sections_lower:
        pts += 2
    dim_sections = ATSDimension(score=pts, max=20)

    # Dimension 3 — bullet_strength (max 25)
    bullets = parsed_resume.bullets or []
    weak_bullets = [b.text for b in bullets if not b.is_strong]
    if bullets:
        total = sum(5 if b.is_strong else 2 for b in bullets)
        score = (total / (len(bullets) * 5.0)) * 25.0
    else:
        score = 0.0
    dim_bullets = ATSDimension(score=int(score), max=25, weak_bullets=weak_bullets)

    # Dimension 4 — format_quality (max 15)
    fmt = 0
    fmt += 3  # parsed without error (if we have ParsedResume, assume yes)

    pipes = resume_text.count("|")
    ratio = pipes / max(1, len(resume_text))
    if ratio < 0.01:
        fmt += 3

    if _EMAIL_RE.search(resume_text) and _PHONE_RE.search(resume_text):
        fmt += 3

    # Consistent date format heuristic: if we find multiple date styles, penalize.
    patterns = [
        re.compile(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\w*\s+\d{4}\b", re.IGNORECASE),
        re.compile(r"\b\d{4}\b"),
        re.compile(r"\b\d{1,2}/\d{4}\b"),
    ]
    hits = [bool(p.search(resume_text)) for p in patterns]
    if sum(1 for h in hits if h) <= 1:
        fmt += 3

    wc = len(re.findall(r"\w+", resume_text))
    if 300 <= wc <= 900:
        fmt += 3

    dim_format = ATSDimension(score=fmt, max=15)

    # Dimension 5 — experience_fit (max 10)
    min_y, max_y = _extract_required_years(jd_text)
    exp = parsed_resume.experience_years
    exp_score = 0
    if min_y is None and max_y is None:
        exp_score = 6
    else:
        if max_y is None:
            req_min = float(min_y or 0)
            if exp >= req_min:
                exp_score = 10 if exp <= req_min + 3 else 8
            elif exp >= req_min - 1:
                exp_score = 6
            elif exp <= req_min - 2:
                exp_score = 0
        else:
            lo, hi = float(min_y), float(max_y)
            if lo <= exp <= hi:
                exp_score = 10
            elif exp >= hi:
                exp_score = 8
            elif exp >= lo - 1:
                exp_score = 6
            else:
                exp_score = 0
    dim_exp = ATSDimension(score=exp_score, max=10)

    dimensions = {
        "keyword_match": dim_keyword,
        "section_completeness": dim_sections,
        "bullet_strength": dim_bullets,
        "format_quality": dim_format,
        "experience_fit": dim_exp,
    }

    overall = sum(d.score for d in dimensions.values())
    grade = _grade(overall)

    missing_keywords = sorted(list(jd_skills - resume_skills))
    recommendation = "Improve missing keywords and strengthen weak bullets." if overall < 75 else "Resume is well aligned."

    return ATSResult(
        resume_id=parsed_resume.resume_id,
        overall_score=overall,
        grade=grade,
        dimensions=dimensions,
        recommendation=recommendation,
        missing_keywords=missing_keywords,
        weak_bullets=weak_bullets,
    )
