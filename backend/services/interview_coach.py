import json
import asyncio
from anthropic import Anthropic, APIError
from fastapi import HTTPException
from config import settings
from schemas.interview import Question, Evaluation

async def generate_dynamic_questions(role: str, job_description: str) -> list[dict]:
    if not settings.anthropic_api_key:
        return []
        
    client_ai = Anthropic(api_key=settings.anthropic_api_key)
    system_prompt = """You are an expert technical interviewer. Generate 5 role-specific interview questions based on the provided Job Description.
Categories should be chosen appropriately (e.g. System Design, Backend, Behavioural).
Difficulties should be a mix of Easy, Medium, and Hard.
Return ONLY a JSON array of objects with keys: id (string, can be anything unique), question (string), difficulty (string), category (string), model_answer (string).
No markdown, no explanation."""
    
    user_message = f"Role: {role}\nJD: {job_description}"
    try:
        loop = asyncio.get_event_loop()
        def _call():
            msg = client_ai.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1500,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            return msg.content[0].text
            
        response_text = await loop.run_in_executor(None, _call)
        
        text = response_text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
            
        return json.loads(text)
    except Exception as e:
        return []

async def evaluate_answer(question_id: str, question_text: str, answer_text: str, role: str) -> Evaluation:
    if not settings.anthropic_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    client_ai = Anthropic(api_key=settings.anthropic_api_key)
    system_prompt = """You are an expert technical interviewer. Evaluate this answer to the interview question.
Score the answer on STAR format (Situation/Task/Action/Result) from 0-5.
Identify which STAR elements are missing or weak.
Suggest one concrete improvement.
Write a better version of the answer in max 100 words.
Return ONLY a JSON object with: star_score (int 0-5), feedback (str), missing_elements (list[str]), improved_answer (str). No markdown, no explanation."""
    
    user_message = f"Role: {role}\nQuestion: {question_text}\nAnswer: {answer_text}"
    try:
        loop = asyncio.get_event_loop()
        def _call():
            msg = client_ai.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1000,
                system=system_prompt,
                messages=[{"role": "user", "content": user_message}]
            )
            return msg.content[0].text
            
        response_text = await loop.run_in_executor(None, _call)
        text = response_text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].strip()
            
        data = json.loads(text)
        return Evaluation(
            question_id=question_id,
            star_score=data.get("star_score", 0),
            feedback=data.get("feedback", ""),
            missing_elements=data.get("missing_elements", []),
            improved_answer=data.get("improved_answer", "")
        )
    except Exception as e:
        try:
            strict_prompt = system_prompt + "\nFAILURE REASON: Previous output was not valid JSON. Ensure NO extra text is present."
            loop = asyncio.get_event_loop()
            def _call_retry():
                msg = client_ai.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=1000,
                    system=strict_prompt,
                    messages=[{"role": "user", "content": user_message}]
                )
                return msg.content[0].text
                
            response_text = await loop.run_in_executor(None, _call_retry)
            text = response_text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].strip()
            data = json.loads(text)
            return Evaluation(
                question_id=question_id,
                star_score=data.get("star_score", 0),
                feedback=data.get("feedback", ""),
                missing_elements=data.get("missing_elements", []),
                improved_answer=data.get("improved_answer", "")
            )
        except Exception:
            raise HTTPException(status_code=503, detail="AI evaluation failed")
