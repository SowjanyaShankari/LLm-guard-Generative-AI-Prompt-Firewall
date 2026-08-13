"""
telemetry.py (Week 4 Final)

Logs bi-directional scanning activity to SQLite (Local UI) 
and exports structured JSON streams for Enterprise SIEM ingestion.
"""

import sqlite3
import json
from datetime import datetime

DB_NAME = "llm_guard.db"
SIEM_LOG_FILE = "siem_export.jsonl"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
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

# --- WEEK 4 NEW: Enterprise SIEM Export ---
def export_to_siem(log_entry: dict):
    """
    Appends the structured threat data as a JSON string to a flat file.
    In production, a Splunk Forwarder or Datadog Agent reads this file 
    asynchronously to prevent database locking.
    """
    try:
        with open(SIEM_LOG_FILE, "a") as f:
            # json.dumps converts the dictionary into a strict JSON string
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print(f"[ERROR] Failed to write to SIEM log: {e}")

def log_security_event(user_id: str, role: str, direction: str, payload: str, risk_score: int, action: str, rule_triggered: str = "None"):
    timestamp = datetime.utcnow().isoformat() + "Z" # ISO-8601 format for SIEM compatibility

    # 1. Dictionary formatting
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

    # 2. Save to SQLite Database (Powers the React Dashboard)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO security_logs_v2 (timestamp, user_id, role, traffic_direction, payload, risk_score, action, rule_triggered)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (timestamp, user_id, role, direction, payload, risk_score, action, rule_triggered))
    conn.commit()
    conn.close()

    # 3. WEEK 4: Stream to Enterprise JSON file
    export_to_siem(log_entry)

    # 4. Print to console for local debugging
    print("\n========== LLM-Guard Security Log ==========")
    print(f"Time        : {log_entry['timestamp']}")
    print(f"User ID     : {log_entry['user_id']} ({log_entry['role']})")
    print(f"Direction   : {log_entry['traffic_direction']}")
    print(f"Action      : {log_entry['action']} (Score: {log_entry['risk_score']})")
    print("============================================\n")

    return log_entry

init_db()

# --- WEEK 4: React Dashboard Fetch Functions (Frontend Hooks) ---

def get_recent_logs(limit: int = 20):
    """Fetches the most recent security logs for the live dashboard feed."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # Allows accessing columns by name
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM security_logs_v2 ORDER BY id DESC LIMIT ?', (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_metrics_summary():
    """Calculates total scans and block rates for the UI metric cards."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) FROM security_logs_v2')
    total = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT COUNT(*) FROM security_logs_v2 WHERE action='BLOCK'")
    blocked = cursor.fetchone()[0] or 0
    conn.close()
    
    return {
        "total_scans": total, 
        "blocked_threats": blocked, 
        "allowed": total - blocked
    }

def get_hourly_trend():
    """Aggregates log counts per hour for the dashboard trend chart."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    # Groups timestamps by the YYYY-MM-DD HH portion
    cursor.execute('''
        SELECT substr(timestamp, 1, 13) as hour, COUNT(*) as count 
        FROM security_logs_v2 
        GROUP BY hour ORDER BY hour DESC LIMIT 24
    ''')
    rows = cursor.fetchall()
    conn.close()
    
    # Formats back to a clean time string for the frontend graph
    return [{"time": f"{row[0]}:00:00Z", "events": row[1]} for row in rows]