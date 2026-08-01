"""
auth.py

Simple API Key Authentication and API Rate Limiting
"""

from fastapi import HTTPException
import time

# --- AUTHENTICATION ---
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


# --- RATE LIMITING (Week 2 Core Defense) ---
# Store request timestamps per IP or API Key
request_history = {}
RATE_LIMIT = 5 # max requests per minute
TIME_WINDOW = 60 # 60 seconds

def check_rate_limit(client_identifier: str):
    """
    Checks if a client has exceeded the allowed requests per minute.
    Raises an HTTP 429 error if limit is reached.
    """
    current_time = time.time()
    
    # Initialize the client's history if they are new
    if client_identifier not in request_history:
        request_history[client_identifier] = []
        
    # Filter out old requests outside the 60-second window
    recent_requests = [t for t in request_history[client_identifier] if current_time - t < TIME_WINDOW]
    
    # Block if they hit the maximum limit
    if len(recent_requests) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429, 
            detail="Rate limit exceeded. Maximum 5 requests per minute."
        )
        
    # Add the current request timestamp and update history
    recent_requests.append(current_time)
    request_history[client_identifier] = recent_requests
    
    return True