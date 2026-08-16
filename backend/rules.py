"""
rules.py

LLM-Guard firewall and risk decision engine.

Responsibilities:
- Prompt length enforcement
- High-risk keyword detection
- Risk scoring
- ALLOW / WARN / BLOCK decisions
"""

SAFE = "ALLOW"
WARN = "WARN"
BLOCK = "BLOCK"

MAX_PROMPT_LENGTH = 500

HIGH_RISK_KEYWORDS = [
    "ignore all previous instructions",
    "system prompt",
    "bypass",
    "jailbreak",
    "sudo",
]


def enforce_firewall_rules(user_prompt: str) -> dict:
    """
    Apply the initial firewall checks to the original user prompt.

    Returns:
        {
            "is_safe": bool,
            "payload": str,
            "reason": str
        }
    """

    if not isinstance(user_prompt, str):
        return {
            "is_safe": False,
            "payload": "",
            "reason": "Invalid prompt format."
        }

    prompt = user_prompt.strip()

    if not prompt:
        return {
            "is_safe": False,
            "payload": "",
            "reason": "Prompt cannot be empty."
        }

    # --------------------------------------------------------
    # Prompt length
    # --------------------------------------------------------

    if len(prompt) > MAX_PROMPT_LENGTH:
        return {
            "is_safe": False,
            "payload": "",
            "reason": (
                f"Prompt exceeds maximum length of "
                f"{MAX_PROMPT_LENGTH} characters."
            )
        }

    # --------------------------------------------------------
    # High-risk keyword detection
    # --------------------------------------------------------

    prompt_lower = prompt.lower()

    for keyword in HIGH_RISK_KEYWORDS:

        if keyword in prompt_lower:
            return {
                "is_safe": False,
                "payload": "",
                "reason": (
                    f"Blocked due to high-risk keyword "
                    f"detection: '{keyword}'"
                )
            }

    # --------------------------------------------------------
    # Safe prompt
    # --------------------------------------------------------

    return {
        "is_safe": True,
        "payload": prompt,
        "reason": "Firewall checks passed."
    }


def calculate_risk(validation_result: dict) -> dict:
    """
    Calculate a 0-100 risk score and determine
    the final firewall action.
    """

    if validation_result.get("safe", False):
        return {
            "risk_score": 0,
            "action": SAFE
        }

    matched_keywords = validation_result.get(
        "matched_keywords",
        []
    )

    keyword_count = len(matched_keywords)

    risk_score = min(
        keyword_count * 25,
        100
    )

    if risk_score >= 75:
        action = BLOCK

    elif risk_score >= 25:
        action = WARN

    else:
        action = SAFE

    return {
        "risk_score": risk_score,
        "action": action
    }