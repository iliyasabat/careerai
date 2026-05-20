"""In-process follow-up email scheduler.

Replaces the previous Celery-based scheduler. A single asyncio task wakes every
``FOLLOW_UP_POLL_INTERVAL_SECONDS`` (default 1800s = 30 minutes), checks SQLite
for any ``EmailLog`` rows due for a follow-up today, drafts one with Gemini, and
writes the new row back.

Single-process by design — this is fine for the MVP. If we ever run multiple
backend workers, we'd need an external scheduler (or a row-level lock) to avoid
duplicate sends.
"""
from __future__ import annotations

import asyncio
import logging
import os
import uuid
from datetime import datetime, timezone

import google.generativeai as genai
from sqlalchemy import select

from config import settings
from database import async_session
from models.email_log import EmailLog

logger = logging.getLogger("careeros.follow_up")

_DEFAULT_INTERVAL_SECONDS = 1800


async def generate_follow_up_content(original_subject: str, original_body: str) -> str:
    if not settings.gemini_api_key:
        return (
            "Just checking in to see if you had a chance to review my previous email. "
            "I would love to connect and discuss how I can add value."
        )

    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    system_prompt = (
        "You are a professional cold email writer. Generate a short follow-up email "
        "based on the original email sent.\n"
        "Rules:\n"
        "1. Max 50 words\n"
        "2. Casual check-in tone\n"
        "3. DO NOT include a subject line, just the body text.\n"
        "4. Return ONLY the email body text. No explanation, no quotes."
    )
    user_message = f"Original Subject: {original_subject}\nOriginal Body: {original_body}"

    try:
        def _call() -> str:
            response = model.generate_content(f"{system_prompt}\n\n{user_message}")
            return response.text

        loop = asyncio.get_event_loop()
        text = (await loop.run_in_executor(None, _call)).strip()

        if text.startswith("```"):
            lines = text.split("\n")
            if lines and lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                lines = lines[:-1]
            text = "\n".join(lines).strip()

        return text.strip('"').strip()
    except Exception:
        logger.exception("Follow-up content generation failed")
        return "Just following up on my previous note. Let me know if you have a few minutes to connect."


async def _process_follow_ups_async() -> None:
    today = datetime.now(timezone.utc).date()

    async with async_session() as db:
        query = select(EmailLog).where(
            EmailLog.sent_at.isnot(None),
            EmailLog.follow_up_date == today,
            EmailLog.follow_up_sent.is_(False),
        )
        res = await db.execute(query)
        emails = res.scalars().all()

        for email in emails:
            new_body = await generate_follow_up_content(email.subject, email.body)
            new_log = EmailLog(
                id=uuid.uuid4(),
                user_id=email.user_id,
                company=email.company,
                role=email.role,
                subject=f"Re: {email.subject}",
                body=new_body,
                tone="casual",
                follow_up_date=today,
                parent_email_id=email.id,
            )
            db.add(new_log)
            email.follow_up_sent = True

        await db.commit()


def _interval_seconds() -> int:
    try:
        return int(os.getenv("FOLLOW_UP_POLL_INTERVAL_SECONDS", _DEFAULT_INTERVAL_SECONDS))
    except ValueError:
        return _DEFAULT_INTERVAL_SECONDS


async def follow_up_poll_loop() -> None:
    """Wake every N seconds, draft follow-up emails for any due rows."""
    interval = _interval_seconds()
    logger.info("Follow-up poll loop started (interval=%ss)", interval)
    while True:
        try:
            await _process_follow_ups_async()
        except Exception:
            logger.exception("Follow-up poll iteration failed")
        await asyncio.sleep(interval)
