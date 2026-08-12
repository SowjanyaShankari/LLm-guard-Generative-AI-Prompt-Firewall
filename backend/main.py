from fastapi import FastAPI, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.validation import validate_prompt
from backend.rules import calculate_risk, enforce_firewall_rules
from backend.telemetry import log_security_event, get_recent_logs, get_metrics_summary, get_hourly_trend
from backend.auth import get_current_user, check_rate_limit, UserContext

app = FastAPI(title="LLM-Guard", description="Generative AI Prompt Firewall", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str
    direction: str = "inbound"


@app.get("/")
def home():
    return {"message": "Welcome to LLM-Guard", "status": "Running"}


@app.get("/health")
def health():
    return {"status": "Healthy", "service": "LLM-Guard", "version": "1.0.0"}


@app.post("/scan")
async def scan_prompt(request: PromptRequest, user: UserContext = Security(get_current_user)):
    check_rate_limit(user)

    firewall_check = enforce_firewall_rules(request.prompt)
    if not firewall_check["is_safe"]:
        log = log_security_event(
            user_id=user.user_id, role=user.role, direction=request.direction,
            payload=request.prompt, risk_score=100, action="BLOCK",
            rule_triggered=firewall_check["reason"]
        )
        return {
            "status": "blocked", "reason": firewall_check["reason"],
            "rules": {"action": "BLOCK", "risk_score": 100},
            "validation": {"reason": firewall_check["reason"], "matched_keywords": []},
            "log": log
        }

    safe_prompt = firewall_check["payload"]
    validation = validate_prompt(safe_prompt)
    rules = calculate_risk(validation)
    log = log_security_event(
        user_id=user.user_id, role=user.role, direction=request.direction,
        payload=safe_prompt, risk_score=rules["risk_score"], action=rules["action"],
        rule_triggered=", ".join(validation["matched_keywords"]) or "None"
    )

    return {"status": "success", "prompt": safe_prompt, "validation": validation, "rules": rules, "log": log}


@app.get("/api/alerts")
def api_alerts(limit: int = 20, user: UserContext = Security(get_current_user)):
    return get_recent_logs(limit)


@app.get("/api/metrics")
def api_metrics(user: UserContext = Security(get_current_user)):
    return get_metrics_summary()


@app.get("/api/trend")
def api_trend(user: UserContext = Security(get_current_user)):
    return get_hourly_trend()
