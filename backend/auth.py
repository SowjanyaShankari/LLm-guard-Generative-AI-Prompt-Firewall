"""
auth.py

Simple API Key Authentication
"""

from fastapi import HTTPException

# Demo API Key
API_KEY = "LLM-GUARD-2026"


def verify_api_key(api_key: str):
    """
    Verify whether the provided API key is valid.
    """

    if api_key != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API Key"
        )

    return True