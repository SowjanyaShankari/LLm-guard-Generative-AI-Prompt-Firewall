"""
auth.py (Week 4 Final)

Role-Based Access Control (RBAC), Dynamic Rate Limiting, 
and Configuration Tuning Authorization.
"""

from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import time

api_key_header = APIKeyHeader(name="X-API-Key")

# Simulated Identity Provider (IdP) Database
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
    user_data = USER_DATABASE.get(api_key)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or missing API Key. Access Denied."
        )
    return UserContext(**user_data)

async def require_admin(user: UserContext = Security(get_current_user)) -> UserContext:
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="RBAC Violation: Admin privileges required."
        )
    return user

# --- WEEK 4 NEW: Dynamic Tuning Authorization ---
async def require_config_permissions(user: UserContext = Security(get_current_user)) -> UserContext:
    """
    Strict RBAC dependency for Week 4. Only allows Admins and SOC Analysts 
    to adjust the AI Firewall sensitivity sliders from the React dashboard.
    """
    allowed_roles = ["admin", "security_auditor"]
    if user.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="RBAC Violation: You do not have permission to tune firewall guardrails."
        )
    return user

# --- RATE LIMITING & PENALTY BOX ---
request_history = {}
lockout_cache = {} # Tracks users who are in the 5-minute timeout penalty box
TIME_WINDOW = 60
PENALTY_TIMEOUT = 300 # 5 minutes

def check_rate_limit(user: UserContext):
    current_time = time.time()
    client_id = user.user_id
    
    # 1. Check if user is currently in the Penalty Box
    if client_id in lockout_cache:
        if current_time - lockout_cache[client_id] < PENALTY_TIMEOUT:
            time_left = int(PENALTY_TIMEOUT - (current_time - lockout_cache[client_id]))
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Security Lockout: Too many requests. Try again in {time_left} seconds."
            )
        else:
            # Penalty time is over, remove them from the box
            del lockout_cache[client_id]
            request_history[client_id] = [] # Reset their history
            
    # 2. Standard Rate Limiting Logic
    if client_id not in request_history:
        request_history[client_id] = []
        
    recent_requests = [t for t in request_history[client_id] if current_time - t < TIME_WINDOW]
    
    if len(recent_requests) >= user.rate_limit:
        # Trip the alarm: Put them in the Penalty Box
        lockout_cache[client_id] = current_time
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS, 
            detail=f"Rate limit exceeded. You have been placed in a 5-minute security timeout."
        )
        
    recent_requests.append(current_time)
    request_history[client_id] = recent_requests
    return True