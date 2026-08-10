"""
telemetry.py

Week 3: Logs bi-directional scanning activity (RBAC + Inbound/Outbound) persistently to SQLite.
"""

import sqlite3
from datetime import datetime

DB_NAME = "llm_guard.db"

def init_db():
    """Initializes the SQLite database and creates the expanded Week 3 logs table."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Upgraded for Week 3: Added user_id, role, traffic_direction, and rule_triggered
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_logs_v2 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            user_id TEXT,
            role TEXT,
            traffic_direction TEXT,
            payload TEXT,
            risk_score INTEGER,
            action TEXT,
            rule_triggered TEXT
        )
    ''')
    conn.commit()
    conn.close()


def log_security_event(user_id: str, role: str, direction: str, payload: str, risk_score: int, action: str, rule_triggered: str = "None"):
    """
    Log the bi-directional scan details to the console and save persistently to SQLite.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Save to SQLite Database (Week 3 logic)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO security_logs_v2 (timestamp, user_id, role, traffic_direction, payload, risk_score, action, rule_triggered)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (timestamp, user_id, role, direction, payload, risk_score, action, rule_triggered))
    conn.commit()
    conn.close()

    # 2. Create the dictionary (Preserving the original format for the frontend)
    log_entry = {
        "timestamp": timestamp,
        "user_id": user_id,
        "role": role,
        "traffic_direction": direction,
        "payload": payload,
        "risk_score": risk_score,
        "action": action,
        "rule_triggered": rule_triggered
    }

    # 3. Print to console (Upgraded terminal output)
    print("\n========== LLM-Guard Security Log ==========")
    print(f"Time        : {log_entry['timestamp']}")
    print(f"User ID     : {log_entry['user_id']} ({log_entry['role']})")
    print(f"Direction   : {log_entry['traffic_direction']}")
    print(f"Payload     : {log_entry['payload']}")
    print(f"Risk Score  : {log_entry['risk_score']}")
    print(f"Action      : {log_entry['action']}")
    print(f"Rule        : {log_entry['rule_triggered']}")
    print("============================================\n")

    return log_entry

# Run this once when the module loads to ensure the database exists
init_db()