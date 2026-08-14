
"""
Pydantic schemas for LLM-Guard proxy.
Defines request/response contracts.
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv
from openai import AsyncOpenAI
import os

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# ===== REQUEST SCHEMAS =====

class PromptRequest(BaseModel):
    """Incoming user prompt to LLM."""
    model: str = "gpt-4"
    messages: List[Dict[str, str]]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048
    user_id: Optional[str] = None  # For audit/RBAC

class ProxyRequest(BaseModel):
    """Internal proxy request wrapper."""
    prompt: str
    user_id: str
    timestamp: datetime
    original_payload: Dict[str, Any]

# ===== RESPONSE SCHEMAS =====

class DLPResult(BaseModel):
    """Output from Member 3 (DLP Engine)."""
    original_text: str
    masked_text: str
    entities_masked: int
    entity_types: List[str]

class MLResult(BaseModel):
    """Output from Member 2 (ML Detector)."""
    is_jailbreak: bool
    confidence: float
    matched_keywords: List[str]
    detection_type: str  # "dan", "roleplay", "injection", etc.

class AuthResult(BaseModel):
    """Output from Member 4 (Identity/Auth)."""
    user_id: str
    role: str  # "admin", "user", "analyst"
    is_authorized: bool
    permissions: List[str]

class SecurityDecision(BaseModel):
    """Final security decision."""
    action: str  # "ALLOW", "WARN", "BLOCK"
    risk_score: float  # 0-100
    reason: str
    dl_flagged: bool
    ml_flagged: bool
    auth_passed: bool

class ProxyResponse(BaseModel):
    """Response from proxy to user."""
    status: str  # "success", "blocked", "error"
    data: Optional[Dict[str, Any]] = None
    security_decision: Optional[SecurityDecision] = None
    error_message: Optional[str] = None

# ===== TELEMETRY SCHEMAS =====

class SecurityEvent(BaseModel):
    """For Member 4 (Telemetry/SIEM logging)."""
    timestamp: datetime
    event_id: str
    user_id: str
    action: str
    risk_score: float
    dl_entities: int
    ml_confidence: float
    decision: str
    prompt_hash: str
"""
Pydantic schemas for LLM-Guard proxy.
Defines request/response contracts.
"""

from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv
from openai import AsyncOpenAI
import os

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# ===== REQUEST SCHEMAS =====

class PromptRequest(BaseModel):
    """Incoming user prompt to LLM."""
    model: str = "gpt-4"
    messages: List[Dict[str, str]]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 2048
    user_id: Optional[str] = None  # For audit/RBAC

class ProxyRequest(BaseModel):
    """Internal proxy request wrapper."""
    prompt: str
    user_id: str
    timestamp: datetime
    original_payload: Dict[str, Any]

# ===== RESPONSE SCHEMAS =====

class DLPResult(BaseModel):
    """Output from Member 3 (DLP Engine)."""
    original_text: str
    masked_text: str
    entities_masked: int
    entity_types: List[str]

class MLResult(BaseModel):
    """Output from Member 2 (ML Detector)."""
    is_jailbreak: bool
    confidence: float
    matched_keywords: List[str]
    detection_type: str  # "dan", "roleplay", "injection", etc.

class AuthResult(BaseModel):
    """Output from Member 4 (Identity/Auth)."""
    user_id: str
    role: str  # "admin", "user", "analyst"
    is_authorized: bool
    permissions: List[str]

class SecurityDecision(BaseModel):
    """Final security decision."""
    action: str  # "ALLOW", "WARN", "BLOCK"
    risk_score: float  # 0-100
    reason: str
    dl_flagged: bool
    ml_flagged: bool
    auth_passed: bool

class ProxyResponse(BaseModel):
    """Response from proxy to user."""
    status: str  # "success", "blocked", "error"
    data: Optional[Dict[str, Any]] = None
    security_decision: Optional[SecurityDecision] = None
    error_message: Optional[str] = None

# ===== TELEMETRY SCHEMAS =====

class SecurityEvent(BaseModel):
    """For Member 4 (Telemetry/SIEM logging)."""
    timestamp: datetime
    event_id: str
    user_id: str
    action: str
    risk_score: float
    dl_entities: int
    ml_confidence: float
    decision: str
    prompt_hash: str
    severity: str  # "info", "warning", "critical"