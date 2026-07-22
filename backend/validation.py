"""
validation.py

This module validates incoming prompts before they are sent to the AI model.
It checks for common jailbreak and prompt injection attempts.
"""

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

    Returns:
        dict
    """

    prompt_lower = prompt.lower()

    detected_keywords = []

    for keyword in BLOCKED_KEYWORDS:

        if keyword in prompt_lower:
            detected_keywords.append(keyword)

    if detected_keywords:

        return {
            "safe": False,
            "reason": "Prompt Injection Detected",
            "matched_keywords": detected_keywords
        }

    return {
        "safe": True,
        "reason": "Prompt is Safe",
        "matched_keywords": []
    }