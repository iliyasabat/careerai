from __future__ import annotations

from datetime import date

from ml.ner_extractor import extract_skills
from schemas.skills import Course, SkillGapResult

from data.courses import COURSES_BY_SKILL


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


def detect_gap(resume_skills: list[str], target_role: str) -> SkillGapResult:
    your = sorted({s.strip() for s in (resume_skills or []) if s.strip()})
    your_lower = {s.lower() for s in your}

    required = ROLE_REQUIRED_SKILLS.get(target_role)
    if not required:
        prompt = f"{target_role} job description responsibilities and required technologies"
        required = sorted({s for s in extract_skills(prompt) if s})

    req_lower = {s.lower() for s in required}
    missing = sorted([s for s in required if s.lower() not in your_lower])

    courses: dict[str, list[Course]] = {}
    for s in missing:
        items = COURSES_BY_SKILL.get(s) or COURSES_BY_SKILL.get(s.title())
        if not items:
            continue
        courses[s] = [Course(**c) for c in items]

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
