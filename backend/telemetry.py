"""
telemetry.py

Logs prompt scanning activity persistently to SQLite.
"""

import sqlite3
from datetime import datetime

DB_NAME = "llm_guard.db"

def init_db():
    """Initializes the SQLite database and creates the logs table if it doesn't exist."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            prompt TEXT,
            risk_score INTEGER,
            action TEXT
        )
    ''')
    conn.commit()
    conn.close()


def log_prompt(prompt: str, risk_score: int, action: str):
    """
    Log the prompt scan details to the console and save persistently to SQLite.
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Save to SQLite Database (Your new Week 2 logic)
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO security_logs (timestamp, prompt, risk_score, action)
        VALUES (?, ?, ?, ?)
    ''', (timestamp, prompt, risk_score, action))
    conn.commit()
    conn.close()

    # 2. Create the dictionary (Preserving the original format)
    log_entry = {
        "timestamp": timestamp,
        "prompt": prompt,
        "risk_score": risk_score,
        "action": action
    }

    # 3. Print to console (Preserving the original terminal output)
    print("\n========== LLM-Guard Log ==========")
    print(f"Time       : {log_entry['timestamp']}")
    print(f"Prompt     : {log_entry['prompt']}")
    print(f"Risk Score : {log_entry['risk_score']}")
    print(f"Action     : {log_entry['action']}")
    print("===================================\n")

    return log_entry

# Run this once when the module loads to ensure the database exists
init_db()