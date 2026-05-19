import json
import re
from typing import Any

def clean_and_parse_json(text: str) -> Any:
    """
    Cleans markdown fences from LLM output and attempts to parse JSON safely.
    Handles ```json ... ``` and plain ``` ... ```
    """
    text = text.strip()
    
    # Remove markdown code blocks
    if text.startswith("```"):
        lines = text.split("\n")
        # Remove the first line if it's the start of a block
        if lines and lines[0].startswith("```"):
            lines = lines[1:]
        # Remove the last line if it's the end of a block
        if lines and lines[-1].strip() == "```":
            lines = lines[:-1]
        text = "\n".join(lines).strip()
        
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        # Fallback: attempt to find a JSON block using regex if parsing fails
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
        match_arr = re.search(r'\[.*\]', text, re.DOTALL)
        if match_arr:
            try:
                return json.loads(match_arr.group(0))
            except json.JSONDecodeError:
                pass
                
        raise e
