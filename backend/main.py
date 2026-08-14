from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.validation import validate_prompt
from backend.rules import calculate_risk, enforce_firewall_rules
from backend.telemetry import log_prompt
from backend.auth import verify_api_key, check_rate_limit

# Create FastAPI application
app = FastAPI(
    title="LLM-Guard",
    description="Generative AI Prompt Firewall",
    version="1.0.0"
)

# Enable CORS for Frontend Dashboard
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

# -----------------------------
# Request Model
# -----------------------------
class PromptRequest(BaseModel):
    prompt: str


# -----------------------------
# Health Check Endpoint
# -----------------------------
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


# -----------------------------
# Prompt Scan Endpoint
# -----------------------------
@app.post("/scan")
async def scan_prompt(
    request: PromptRequest,
    x_api_key: str = Header(...)
):
    # Verify API key
    verify_api_key(x_api_key)

    # Rate limiting
    check_rate_limit(client_identifier=x_api_key)

        # Firewall rules
    firewall_check = enforce_firewall_rules(request.prompt)

    if not firewall_check["is_safe"]:
        return {
            "status": "blocked",
            "reason": firewall_check["reason"],
            "rules": {
                "action": "BLOCK",
                "risk_score": 100
            },
            "validation": {
                "reason": firewall_check["reason"],
                "matched_keywords": []
            },
            "log": None
        }

    # Safe prompt
    safe_prompt = firewall_check["payload"]

    # Validation
    validation = validate_prompt(safe_prompt)

    # Risk calculation
    rules = calculate_risk(validation)

    # Telemetry logging
    log = log_prompt(
        safe_prompt,
        rules["risk_score"],
        rules["action"]
    )

    return {
        "status": "success",
        "prompt": safe_prompt,
        "validation": validation,
        "rules": rules,
        "log": log
    }