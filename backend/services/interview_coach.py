import json
import asyncio
import google.generativeai as genai
from fastapi import HTTPException
from config import settings
from schemas.interview import Question, Evaluation

async def generate_dynamic_questions(role: str, job_description: str) -> list[dict]:
    if not settings.gemini_api_key:
        return []
        
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    system_prompt = """You are an expert technical interviewer. Generate 5 role-specific interview questions based on the provided Job Description.
Categories should be chosen appropriately (e.g. System Design, Backend, Behavioural).
Difficulties should be a mix of Easy, Medium, and Hard.
Return ONLY a JSON array of objects with keys: id (string, can be anything unique), question (string), difficulty (string), category (string), model_answer (string).
No markdown, no explanation."""
    
    user_message = f"Role: {role}\nJD: {job_description}"
    try:
        loop = asyncio.get_event_loop()
        def _call():
            prompt = f"{system_prompt}\n\n{user_message}"
            response = model.generate_content(prompt)
            return response.text
            
        response_text = await loop.run_in_executor(None, _call)
        
        text = response_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
            
        return json.loads(text)
    except Exception as e:
        return []

async def evaluate_answer(question_id: str, question_text: str, answer_text: str, role: str) -> Evaluation:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=503, detail="AI service not configured")
        
    genai.configure(api_key=settings.gemini_api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
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
            prompt = f"{system_prompt}\n\n{user_message}"
            response = model.generate_content(prompt)
            return response.text
            
        response_text = await loop.run_in_executor(None, _call)
        text = response_text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
            
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
                prompt = f"{strict_prompt}\n\n{user_message}"
                response = model.generate_content(prompt)
                return response.text
                
            response_text = await loop.run_in_executor(None, _call_retry)
            text = response_text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()
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
