"""
validation.py

This module validates incoming prompts before they are sent to the AI model.
It checks for common jailbreak and prompt injection attempts.
"""

import re

# List of suspicious keywords
BLOCKED_KEYWORDS = [
    "ignore previous instructions",
    "forget previous instructions",
    "developer mode",
    "jailbreak",
    "dan",
    "system prompt",
    "reveal prompt",
    "disable safety",
    "bypass",
    "act as root",
]


def validate_prompt(prompt: str):
    """
    Validate the incoming prompt.
    """

    prompt_lower = prompt.lower()

    detected_keywords = []

    for keyword in BLOCKED_KEYWORDS:
        if keyword in prompt_lower:
            detected_keywords.append(keyword)

    # Prompt Injection
    if detected_keywords:
        return {
            "safe": False,
            "reason": "Prompt Injection Detected",
            "matched_keywords": detected_keywords
        }

    # SQL Injection
    sql_patterns = [
        r"(\bor\b|\band\b)\s+\d+=\d+",
        r"union\s+select",
        r"drop\s+table",
        r"insert\s+into",
        r"delete\s+from",
        r"--"
    ]

    for pattern in sql_patterns:
        if re.search(pattern, prompt_lower):
            return {
                "safe": False,
                "reason": "SQL Injection Detected",
                "matched_keywords": ["SQL Injection"]
            }

    # XSS Detection
    if re.search(r"<script.*?>.*?</script>", prompt_lower):
        return {
            "safe": False,
            "reason": "XSS Attack Detected",
            "matched_keywords": ["XSS"]
        }

    # Credit Card Detection
    if re.search(r"\b(?:\d[ -]*?){13,16}\b", prompt):
        return {
            "safe": False,
            "reason": "Sensitive Credit Card Data Detected",
            "matched_keywords": ["Credit Card"]
        }

    # Email Detection
    if re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", prompt):
        return {
            "safe": False,
            "reason": "Sensitive Email Detected",
            "matched_keywords": ["Email"]
        }

    return {
        "safe": True,
        "reason": "Prompt is Safe",
        "matched_keywords": []
    }