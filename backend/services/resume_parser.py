from __future__ import annotations

import re
import uuid
from dataclasses import dataclass

import fitz  # PyMuPDF
from docx import Document

from ml.embeddings import embed_text
from ml.ner_extractor import extract_experience_years, extract_skills


_SECTION_HEADINGS = {
    "summary": re.compile(r"^\s*(summary|objective)\s*$", re.IGNORECASE),
    "experience": re.compile(r"^\s*(experience|work experience|employment)\s*$", re.IGNORECASE),
    "education": re.compile(r"^\s*education\s*$", re.IGNORECASE),
    "skills": re.compile(r"^\s*skills?\s*$", re.IGNORECASE),
    "projects": re.compile(r"^\s*projects?\s*$", re.IGNORECASE),
    "certifications": re.compile(r"^\s*(certifications?|licenses?)\s*$", re.IGNORECASE),
}

_BULLET_RE = re.compile(r"^\s*(?:[-•*]|\d+[.)])\s+(?P<text>.+?)\s*$")

_ACTION_VERBS = [
    "Led",
    "Built",
    "Designed",
    "Developed",
    "Implemented",
    "Optimised",
    "Optimized",
    "Reduced",
    "Increased",
    "Managed",
    "Architected",
    "Deployed",
    "Automated",
    "Improved",
    "Created",
    "Launched",
    "Delivered",
    "Owned",
    "Migrated",
    "Refactored",
    "Enhanced",
    "Streamlined",
    "Resolved",
    "Debugged",
    "Integrated",
    "Collaborated",
    "Mentored",
    "Spearheaded",
    "Orchestrated",
    "Accelerated",
    "Scaled",
    "Optimized",
]

_ACTION_VERB_SET = {v.lower() for v in _ACTION_VERBS}


@dataclass(frozen=True)
class ParsedBullet:
    id: str
    text: str
    is_strong: bool
    action_verb: str | None
    has_metric: bool


@dataclass(frozen=True)
class ParsedResume:
    resume_id: str
    filename: str
    sections: dict[str, str]
    skills: list[str]
    experience_years: float
    bullets: list[ParsedBullet]
    embedding: list[float]


def _extract_text_pdf(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    try:
        return "\n".join(page.get_text("text") for page in doc)
    finally:
        doc.close()


def _extract_text_docx(file_bytes: bytes) -> str:
    # python-docx only accepts file paths or file-like objects
    import io

    with io.BytesIO(file_bytes) as bio:
        d = Document(bio)
        return "\n".join(p.text for p in d.paragraphs)


def _detect_sections(text: str) -> dict[str, str]:
    sections: dict[str, list[str]] = {"other": []}
    current = "other"

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        switched = False
        for name, rx in _SECTION_HEADINGS.items():
            if rx.match(line):
                current = name
                sections.setdefault(current, [])
                switched = True
                break
        if switched:
            continue

        sections.setdefault(current, []).append(raw_line)

    return {k: "\n".join(v).strip() for k, v in sections.items() if "\n".join(v).strip()}


def _parse_bullets(text: str) -> list[ParsedBullet]:
    bullets: list[ParsedBullet] = []
    for raw_line in text.splitlines():
        m = _BULLET_RE.match(raw_line)
        if not m:
            continue
        t = m.group("text").strip()
        first_word = re.split(r"\W+", t.strip(), maxsplit=1)[0].lower() if t else ""
        action_verb = None
        if first_word in _ACTION_VERB_SET:
            # recover canonical capitalization
            action_verb = next((v for v in _ACTION_VERBS if v.lower() == first_word), None)

        has_metric = bool(re.search(r"(\d+%?)|(\b\d+\.\d+\b)", t))
        word_count = len(t.split())
        is_strong = bool(action_verb) and (has_metric or word_count > 10)

        bullets.append(
            ParsedBullet(
                id=str(uuid.uuid4()),
                text=t,
                is_strong=is_strong,
                action_verb=action_verb,
                has_metric=has_metric,
            )
        )
    return bullets


def parse_resume(file_bytes: bytes, filename: str) -> ParsedResume:
    ext = (filename.rsplit(".", 1)[-1] if "." in filename else "").lower()
    if ext == "pdf":
        text = _extract_text_pdf(file_bytes)
    elif ext in {"docx", "doc"}:
        text = _extract_text_docx(file_bytes)
    else:
        text = file_bytes.decode("utf-8", errors="ignore")

    sections = _detect_sections(text)
    skills = extract_skills(text)
    experience_years = extract_experience_years(text)
    bullets = _parse_bullets(text)
    embedding = embed_text(text)

    return ParsedResume(
        resume_id=str(uuid.uuid4()),
        filename=filename,
        sections=sections,
        skills=skills,
        experience_years=experience_years,
        bullets=bullets,
        embedding=embedding,
    )
