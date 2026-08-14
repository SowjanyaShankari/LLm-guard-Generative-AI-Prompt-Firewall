from fastapi import FastAPI, Security
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
<<<<<<< HEAD
from backend.validation import validate_prompt
from backend.rules import calculate_risk, enforce_firewall_rules
from backend.telemetry import log_security_event, get_recent_logs, get_metrics_summary, get_hourly_trend
from backend.auth import get_current_user, check_rate_limit, UserContext
=======
from validation import validate_prompt
from rules import calculate_risk, enforce_firewall_rules
from telemetry import log_security_event, get_recent_logs, get_metrics_summary, get_hourly_trend
from auth import get_current_user, check_rate_limit, UserContext
from fastapi import Body
from settings import SETTINGS
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)

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

<<<<<<< HEAD
=======
@app.get("/api/metrics")
async def metrics(
    user: UserContext = Security(get_current_user)
):
    check_rate_limit(user)
    return get_metrics_summary()

@app.get("/api/alerts")
async def alerts(
    user: UserContext = Security(get_current_user)
):
    check_rate_limit(user)
    return get_recent_logs()

@app.get("/api/trend")
async def trend(
    user: UserContext = Security(get_current_user)
):
    check_rate_limit(user)
    return get_hourly_trend()

>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)

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


<<<<<<< HEAD
@app.get("/api/alerts")
def api_alerts(limit: int = 20, user: UserContext = Security(get_current_user)):
    return get_recent_logs(limit)


@app.get("/api/metrics")
def api_metrics(user: UserContext = Security(get_current_user)):
    return get_metrics_summary()


@app.get("/api/trend")
def api_trend(user: UserContext = Security(get_current_user)):
    return get_hourly_trend()
=======
# ==========================
# WEEK 4 SETTINGS APIs
# ==========================

@app.get("/api/settings")
async def get_settings(
    user: UserContext = Security(get_current_user)
):
    return SETTINGS


@app.post("/api/settings")
async def update_settings(
    payload: dict = Body(...),
    user: UserContext = Security(get_current_user)
):
    SETTINGS.update(payload)

    return {
        "message": "Settings updated successfully",
        "settings": SETTINGS
    }
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)
