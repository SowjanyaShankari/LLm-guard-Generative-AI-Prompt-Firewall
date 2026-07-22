from fastapi import FastAPI
from pydantic import BaseModel
from backend.validation import validate_prompt
from backend.rules import calculate_risk
from backend.telemetry import log_prompt
from fastapi import Header
from backend.auth import verify_api_key

# Create FastAPI application
app = FastAPI(
    title="LLM-Guard",
    description="Generative AI Prompt Firewall",
    version="1.0.0"
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
def scan_prompt(
    request: PromptRequest,
    x_api_key: str = Header(...)
):

    verify_api_key(x_api_key)

    validation = validate_prompt(request.prompt)

    rules = calculate_risk(validation)

    log = log_prompt(
        request.prompt,
        rules["risk_score"],
        rules["action"]
    )

    return {
        "prompt": request.prompt,
        "validation": validation,
        "rules": rules,
        "log": log
    }