from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.validation import validate_prompt
from backend.rules import calculate_risk, enforce_firewall_rules
from backend.telemetry import log_security_event
from backend.auth import UserContext, get_current_user, check_rate_limit


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="LLM-Guard",
    description="Generative AI Prompt Firewall",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST MODEL
# ============================================================

class PromptRequest(BaseModel):
    prompt: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="Prompt to be scanned by LLM-Guard"
    )


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to LLM-Guard",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "service": "LLM-Guard",
        "version": "1.0.0"
    }


# ============================================================
# PROMPT SCAN ENDPOINT
# ============================================================

@app.post("/scan")
async def scan_prompt(
    request: PromptRequest,
    user: UserContext = Depends(get_current_user)
):
    

    # --------------------------------------------------------
    # DYNAMIC RATE LIMITING
    # --------------------------------------------------------

    check_rate_limit(user)


    # --------------------------------------------------------
    # FIREWALL INSPECTION
    # --------------------------------------------------------

    firewall_check = enforce_firewall_rules(
        request.prompt
    )


    # --------------------------------------------------------
    # BLOCKED PROMPT
    # --------------------------------------------------------

    if not firewall_check["is_safe"]:

        log = log_security_event(
            user_id=user.user_id,
            role=user.role,
            direction="inbound",
            payload=request.prompt,
            risk_score=100,
            action="BLOCK",
            rule_triggered=firewall_check["reason"]
        )

        return {
            "status": "blocked",

            "reason": firewall_check["reason"],

            "rules": {
                "action": "BLOCK",
                "risk_score": 100
            },

            "validation": {
                "safe": False,
                "reason": firewall_check["reason"],
                "matched_keywords": []
            },

            "log": log
        }


    # --------------------------------------------------------
    # SAFE / NON-BLOCKED PROMPT
    # --------------------------------------------------------

    safe_prompt = firewall_check["payload"]


    # --------------------------------------------------------
    # PROMPT VALIDATION
    # --------------------------------------------------------

    validation = validate_prompt(
        safe_prompt
    )


    # --------------------------------------------------------
    # RISK CALCULATION
    # --------------------------------------------------------

    rules = calculate_risk(
        validation
    )


    # --------------------------------------------------------
    # TELEMETRY
    # --------------------------------------------------------

    log = log_security_event(
        user_id=user.user_id,
        role=user.role,
        direction="inbound",
        payload=safe_prompt,
        risk_score=rules["risk_score"],
        action=rules["action"],
        rule_triggered="None"
    )


    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return {
        "status": "success",

        "prompt": safe_prompt,

        "validation": validation,

        "rules": rules,

        "log": log
    }