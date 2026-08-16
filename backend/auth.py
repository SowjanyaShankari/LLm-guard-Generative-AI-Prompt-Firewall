"""
auth.py

Week 3:
- API-key authentication
- Role-Based Access Control (RBAC)
- Dynamic per-user rate limiting
"""

import time

from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from pydantic import BaseModel


# ============================================================
# API KEY AUTHENTICATION
# ============================================================

api_key_header = APIKeyHeader(
    name="X-API-Key",
    auto_error=True
)


# ============================================================
# SIMULATED IDENTITY PROVIDER
# ============================================================

USER_DATABASE = {
    "LLM-GUARD-2026-ADMIN": {
        "user_id": "admin_01",
        "role": "admin",
        "rate_limit": 100,
    },

    "LLM-GUARD-2026-USER": {
        "user_id": "dev_user_01",
        "role": "standard",
        "rate_limit": 5,
    },

    "LLM-GUARD-2026-SOC": {
        "user_id": "soc_analyst",
        "role": "security_auditor",
        "rate_limit": 50,
    },
}


# ============================================================
# USER CONTEXT
# ============================================================

class UserContext(BaseModel):
    user_id: str
    role: str
    rate_limit: int


# ============================================================
# AUTHENTICATION
# ============================================================

async def get_current_user(
    api_key: str = Security(api_key_header)
) -> UserContext:
    """
    Validate an API key and return the associated user context.
    """

    user_data = USER_DATABASE.get(api_key)

    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API Key. Access Denied.",
        )

    return UserContext(**user_data)


# ============================================================
# RBAC
# ============================================================

async def require_admin(
    user: UserContext = Security(get_current_user)
) -> UserContext:
    """
    Allow access only to administrators.
    """

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="RBAC Violation: Admin privileges required.",
        )

    return user


# ============================================================
# RATE LIMITING
# ============================================================

request_history = {}

TIME_WINDOW = 60


def check_rate_limit(user: UserContext) -> bool:
    """
    Apply a dynamic requests-per-minute limit
    based on the authenticated user's role.
    """

    current_time = time.time()

    client_identifier = user.user_id

    if client_identifier not in request_history:
        request_history[client_identifier] = []

    recent_requests = [
        timestamp
        for timestamp in request_history[client_identifier]
        if current_time - timestamp < TIME_WINDOW
    ]

    if len(recent_requests) >= user.rate_limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=(
                f"Rate limit exceeded for role '{user.role}'. "
                f"Maximum {user.rate_limit} requests per minute."
            ),
        )

    recent_requests.append(current_time)

    request_history[client_identifier] = recent_requests

    return True


# ============================================================
# BACKWARD COMPATIBILITY
# ============================================================

verify_api_key = get_current_user