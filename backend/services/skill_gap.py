from __future__ import annotations

import asyncio
import logging

import google.generativeai as genai

from config import settings
from ml.ner_extractor import extract_skills
from schemas.skills import Course, SkillGapResult

from data.courses import COURSES_BY_SKILL
from utils.json_parser import clean_and_parse_json

logger = logging.getLogger("careeros.skill_gap")


# Static fallback used when Gemini is unavailable or rate-limited.
ROLE_REQUIRED_SKILLS: dict[str, list[str]] = {
    "Backend Engineer": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "System Design", "Git", "CI/CD"],
    "Frontend Engineer": ["React", "TypeScript", "HTML", "CSS", "Node.js", "Git", "System Design"],
    "Full Stack Developer": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Git", "System Design"],
    "Data Scientist": ["Python", "Machine Learning", "PostgreSQL", "System Design", "Git", "TensorFlow"],
    "ML Engineer": ["Python", "Machine Learning", "TensorFlow", "Docker", "Kubernetes", "System Design"],
    "Data Engineer": ["Python", "PostgreSQL", "Docker", "Kubernetes", "AWS", "System Design"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "Redis", "CI/CD", "System Design", "Git"],
    "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "CI/CD", "System Design", "Git"],
    "Mobile Developer (Android)": ["Kotlin", "Java", "Git", "System Design"],
    "Mobile Developer (iOS)": ["Swift", "Git", "System Design"],
    "Product Manager": ["Agile", "Scrum", "Product Management", "System Design"],
    "QA Engineer": ["Git", "CI/CD", "Postman"],
    "Security Engineer": ["Linux", "System Design", "AWS", "Git"],
    "Blockchain Developer": ["Solidity", "JavaScript", "Git", "System Design"],
    "UI/UX Designer": ["Figma", "Product Management", "Agile"],
}


# Process-local cache so repeated lookups for the same role don't hammer Gemini.
_role_skill_cache: dict[str, list[str]] = {}


def _fallback_required_skills(target_role: str) -> list[str]:
    if target_role in ROLE_REQUIRED_SKILLS:
        return list(ROLE_REQUIRED_SKILLS[target_role])
    prompt = f"{target_role} job description responsibilities and required technologies"
    return sorted({s for s in extract_skills(prompt) if s})


async def _gemini_required_skills(target_role: str) -> list[str]:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set")

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel(
        "gemini-2.0-flash",
        generation_config={"response_mime_type": "application/json"},
    )

    system_prompt = (
        "You are a senior hiring manager. List the 8-12 most important hard skills, "
        "tools, and technologies an entry-to-mid level candidate needs for the given "
        "role. Return ONLY a JSON object with a single key 'skills' whose value is an "
        "array of short skill names (e.g. 'Python', 'React', 'PostgreSQL'). No prose."
    )
    user_msg = f"Role: {target_role}"

    loop = asyncio.get_event_loop()

    def _call():
        return model.generate_content(f"{system_prompt}\n\n{user_msg}").text

    raw = await loop.run_in_executor(None, _call)
    parsed = clean_and_parse_json(raw)
    if isinstance(parsed, dict):
        skills = parsed.get("skills") or parsed.get("required_skills") or []
    elif isinstance(parsed, list):
        skills = parsed
    else:
        skills = []

    cleaned = [str(s).strip() for s in skills if str(s).strip()]
    # De-dup case-insensitively, preserving the first capitalisation seen.
    seen: dict[str, str] = {}
    for s in cleaned:
        key = s.lower()
        if key not in seen:
            seen[key] = s
    return list(seen.values())


async def _resolve_required_skills(target_role: str) -> list[str]:
    cached = _role_skill_cache.get(target_role.lower())
    if cached is not None:
        return cached

    if settings.gemini_api_key:
        try:
            skills = await _gemini_required_skills(target_role)
            if skills:
                _role_skill_cache[target_role.lower()] = skills
                logger.info("Gemini returned %d required skills for %s", len(skills), target_role)
                return skills
            logger.warning("Gemini returned an empty skill list for %s — falling back", target_role)
        except Exception:
            logger.exception("Gemini required-skills lookup failed for %s — falling back", target_role)

    fallback = _fallback_required_skills(target_role)
    _role_skill_cache[target_role.lower()] = fallback
    return fallback


async def detect_gap(resume_skills: list[str], target_role: str) -> SkillGapResult:
    your = sorted({s.strip() for s in (resume_skills or []) if s.strip()})
    your_lower = {s.lower() for s in your}

    required = await _resolve_required_skills(target_role)
    missing = sorted([s for s in required if s.lower() not in your_lower])

    courses: dict[str, list[Course]] = {}
    for s in missing:
        items = COURSES_BY_SKILL.get(s) or COURSES_BY_SKILL.get(s.title())
        if not items:
            continue
        courses[s] = [Course(**c) for c in items]

    logger.info(
        "Skill gap for %s: %d required, %d missing", target_role, len(required), len(missing)
    )
    return SkillGapResult(
        target_role=target_role,
        your_skills=your,
        required_skills=required,
        missing_skills=missing,
        courses=courses,
    )


def get_courses(skill: str) -> list[Course]:
    items = COURSES_BY_SKILL.get(skill) or COURSES_BY_SKILL.get(skill.title()) or []
    return [Course(**c) for c in items]
