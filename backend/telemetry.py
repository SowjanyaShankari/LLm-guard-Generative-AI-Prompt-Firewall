"""
telemetry.py

Week 3:
Persistent security telemetry for LLM-Guard.

Stores:
- User identity
- RBAC role
- Traffic direction
- Prompt/payload
- Risk score
- Firewall action
- Triggered rule
"""

import sqlite3
from datetime import datetime

DB_NAME = "llm_guard.db"


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def init_db():
    """
    Initialize the SQLite database and create the
    security logs table if it does not already exist.
    """

    conn = sqlite3.connect(DB_NAME)

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS security_logs_v2 (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                user_id TEXT,
                role TEXT,
                traffic_direction TEXT,
                payload TEXT,
                risk_score INTEGER,
                action TEXT,
                rule_triggered TEXT
            )
            """
        )

        conn.commit()

    finally:
        conn.close()


# ============================================================
# SECURITY EVENT LOGGER
# ============================================================

def log_security_event(
    user_id: str,
    role: str,
    direction: str,
    payload: str,
    risk_score: int,
    action: str,
    rule_triggered: str = "None",
):
    """
    Persist a security event to SQLite and return
    the event as a dictionary for the API/frontend.
    """

    timestamp = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    log_entry = {
        "timestamp": timestamp,
        "user_id": user_id,
        "role": role,
        "traffic_direction": direction,
        "payload": payload,
        "risk_score": risk_score,
        "action": action,
        "rule_triggered": rule_triggered,
    }

    conn = sqlite3.connect(DB_NAME)

    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO security_logs_v2 (
                timestamp,
                user_id,
                role,
                traffic_direction,
                payload,
                risk_score,
                action,
                rule_triggered
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                timestamp,
                user_id,
                role,
                direction,
                payload,
                risk_score,
                action,
                rule_triggered,
            ),
        )

        conn.commit()

    finally:
        conn.close()

    # Console telemetry
    print("\n========== LLM-Guard Security Log ==========")
    print(f"Time        : {timestamp}")
    print(f"User ID     : {user_id} ({role})")
    print(f"Direction   : {direction}")
    print(f"Payload     : {payload}")
    print(f"Risk Score  : {risk_score}")
    print(f"Action      : {action}")
    print(f"Rule        : {rule_triggered}")
    print("============================================\n")

    return log_entry


# ============================================================
# BACKWARD-COMPATIBLE LOGGER
# ============================================================

def log_prompt(
    prompt: str,
    risk_score: int = 0,
    action: str = "ALLOW",
    rule_triggered: str = "None",
    user_id: str = "unknown",
    role: str = "user",
    direction: str = "inbound",
):
    """
    Backward-compatible wrapper.

    Existing code can continue calling log_prompt(),
    while the actual event is stored using the Week 3
    security telemetry structure.
    """

    return log_security_event(
        user_id=user_id,
        role=role,
        direction=direction,
        payload=prompt,
        risk_score=risk_score,
        action=action,
        rule_triggered=rule_triggered,
    )


# ============================================================
# INITIALIZE DATABASE
# ============================================================

init_db()