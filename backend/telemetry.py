"""
telemetry.py

Logs prompt scanning activity.
"""

from datetime import datetime


def log_prompt(prompt: str, risk_score: int, action: str):
    """
    Log the prompt scan details.
    """

    log_entry = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "prompt": prompt,
        "risk_score": risk_score,
        "action": action
    }

    print("\n========== LLM-Guard Log ==========")
    print(f"Time       : {log_entry['timestamp']}")
    print(f"Prompt     : {log_entry['prompt']}")
    print(f"Risk Score : {log_entry['risk_score']}")
    print(f"Action     : {log_entry['action']}")
    print("===================================\n")

    return log_entry