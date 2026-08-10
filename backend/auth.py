"""
auth.py

Week 3: Role-Based Access Control (RBAC) and Dynamic Rate Limiting
"""

from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import time

# --- AUTHENTICATION & IDENTITY (Week 3 RBAC Upgrade) ---

# Defines the header our proxy will look for in incoming requests
api_key_header = APIKeyHeader(name="X-API-Key")

# Simulated Identity Provider (IdP) Database replacing the single API_KEY
USER_DATABASE = {
    "LLM-GUARD-2026-ADMIN": {"user_id": "admin_01", "role": "admin", "rate_limit": 100},
    "LLM-GUARD-2026-USER": {"user_id": "dev_user_01", "role": "standard", "rate_limit": 5},
    "LLM-GUARD-2026-SOC": {"user_id": "soc_analyst", "role": "security_auditor", "rate_limit": 50}
}

class UserContext(BaseModel):
    user_id: str
    role: str
    rate_limit: int

async def get_current_user(api_key: str = Security(api_key_header)) -> UserContext:
    """
    Validates the API key and returns the user's RBAC identity context.
    """
    user_data = USER_DATABASE.get(api_key)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or missing API Key. Access Denied."
        )
        
    return UserContext(**user_data)

async def require_admin(user: UserContext = Security(get_current_user)) -> UserContext:
    """
    Strict RBAC dependency. Use this on endpoints that only Admins can access.
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="RBAC Violation: Admin privileges required."
        )
    return user


# --- RATE LIMITING (Upgraded for Week 3 Dynamic Limits) ---
# Store request timestamps per user_id instead of IP/Key
request_history = {}
TIME_WINDOW = 60 # 60 seconds

def check_rate_limit(user: UserContext):
    """
    Checks if a client has exceeded their specific RBAC allowed requests per minute.
    Raises an HTTP 429 error if the limit is reached.
    """
    current_time = time.time()
    client_identifier = user.user_id
    
    # Initialize the client's history if they are new
    if client_identifier not in request_history:
        request_history[client_identifier] = []
        
    # Filter out old requests outside the 60-second window
    recent_requests = [t for t in request_history[client_identifier] if current_time - t < TIME_WINDOW]
    
    # Block if they hit the maximum limit assigned to their specific role
    if len(recent_requests) >= user.rate_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail=f"Rate limit exceeded for role '{user.role}'. Maximum {user.rate_limit} requests per minute."
        )
        
    # Add the current request timestamp and update history
    recent_requests.append(current_time)
    request_history[client_identifier] = recent_requests
    
    return True