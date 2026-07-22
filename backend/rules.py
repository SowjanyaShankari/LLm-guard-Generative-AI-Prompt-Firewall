"""
rules.py

Risk Scoring and Decision Engine
"""

SAFE = "ALLOW"
WARN = "WARN"
BLOCK = "BLOCK"


def calculate_risk(validation_result):

    if validation_result["safe"]:
        return {
            "risk_score": 0,
            "action": SAFE
        }

    keywords = len(validation_result["matched_keywords"])

    risk = keywords * 25

    if risk > 100:
        risk = 100

    if risk >= 75:
        action = BLOCK

    elif risk >= 25:
        action = WARN

    else:
        action = SAFE

    return {
        "risk_score": risk,
        "action": action
    }