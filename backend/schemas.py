
"""
Core reverse proxy logic.
Orchestrates DLP → ML → Auth → LLM pipeline.

"""

import httpx
import asyncio
import time
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime
from backend.schemas import (
    PromptRequest, ProxyRequest, SecurityDecision,
    DLPResult, MLResult, AuthResult, ProxyResponse
)

class LLMGuardProxy:
    """
    Main proxy orchestrator.
    """
    
    def __init__(self, llm_api_url: str = "https://api.openai.com/v1/chat/completions"):
        self.llm_api_url = llm_api_url
        self.metrics = {
            "total_requests": 0,
            "allowed": 0,
            "blocked": 0,
            "avg_latency_ms": 0
        }
    
    async def process_prompt(
        self,
        request: PromptRequest,
        user_id: str,
        api_key: str
    ) -> ProxyResponse:
        """
        Main request pipeline:
        1. Auth check (M4)
        2. DLP masking (M3)
        3. ML threat detection (M2)
        4. Risk decision
        5. Forward to LLM (or block)
        6. Log to SIEM (M4)
        """
        
        start_time = time.time()
        
        # Extract prompt from messages
        prompt_text = request.messages[-1]["content"] if request.messages else ""
        
        # ===== STEP 1: AUTH CHECK (M4) =====
        try:
            auth_result = await self._verify_auth(user_id, api_key)
            if not auth_result["is_authorized"]:
                return ProxyResponse(
                    status="blocked",
                    error_message="User not authorized",
                    security_decision=SecurityDecision(
                        action="BLOCK",
                        risk_score=100,
                        reason="Authentication failed",
                        dl_flagged=False,
                        ml_flagged=False,
                        auth_passed=False
                    )
                )
        except Exception as e:
            return ProxyResponse(
                status="error",
                error_message=f"Auth error: {str(e)}"
            )
        
        # ===== STEP 2: DLP MASKING (M3) =====
        dlp_result = await self._apply_dlp(prompt_text)
        masked_prompt = dlp_result.masked_text if dlp_result else prompt_text
        
        # ===== STEP 3: ML THREAT DETECTION (M2) =====
        ml_result = await self._run_ml_detection(prompt_text)
        ml_flagged = ml_result.is_jailbreak if ml_result else False
        ml_confidence = ml_result.confidence if ml_result else 0.0
        
        # ===== STEP 4: RISK DECISION =====
        decision = self._calculate_security_decision(
            dl_result=dlp_result,
            ml_result=ml_result,
            auth_result=auth_result
        )
        
        # ===== STEP 5: BLOCK OR FORWARD =====
        if decision.action == "BLOCK":
            self.metrics["blocked"] += 1
            return ProxyResponse(
                status="blocked",
                security_decision=decision
            )
        
        # Forward to LLM (Week 2+: add real endpoint)
        llm_response = await self._forward_to_llm(request, masked_prompt)
        self.metrics["allowed"] += 1
        
        # ===== STEP 6: LOG TO SIEM (M4) =====
        await self._log_to_siem(
            user_id=user_id,
            decision=decision,
            prompt_hash=self._hash_prompt(prompt_text)
        )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        self.metrics["total_requests"] += 1
        self.metrics["avg_latency_ms"] = (
            self.metrics["avg_latency_ms"] * 0.9 + latency_ms * 0.1
        )
        
        return ProxyResponse(
            status="success",
            data=llm_response,
            security_decision=decision
        )
    
    # ===== HELPER METHODS =====
    
    async def _verify_auth(self, user_id: str, api_key: str) -> AuthResult:
        """
        Call M4 (Identity Specialist) auth endpoint.
        Week 1: Mock
        Week 2+: Real IdP integration
        """
        # WEEK 1: Mock response
        return AuthResult(
            user_id=user_id,
            role="user",
            is_authorized=True,
            permissions=["read", "write"]
        )
    
    async def _apply_dlp(self, text: str) -> Optional[DLPResult]:
        """
        Call M3 (AppSec) DLP endpoint.
        Masks emails, SSNs, credit cards, etc.
        """
        # WEEK 1: Mock response
        return DLPResult(
            original_text=text,
            masked_text=text,  # No masking yet
            entities_masked=0,
            entity_types=[]
        )
    
    async def _run_ml_detection(self, text: str) -> Optional[MLResult]:
        """
        Call M2 (ML/NLP) jailbreak detector.
        Detects DAN, roleplay, prompt injection, etc.
        """
        # WEEK 1: Mock response
        return MLResult(
            is_jailbreak=False,
            confidence=0.0,
            matched_keywords=[],
            detection_type="none"
        )
    
    def _calculate_security_decision(
        self,
        dl_result: Optional[DLPResult],
        ml_result: Optional[MLResult],
        auth_result: AuthResult
    ) -> SecurityDecision:
        """
        Combine DLP, ML, Auth signals into final decision.
        """
        risk_score = 0.0
        reasons = []
        
        if ml_result and ml_result.is_jailbreak:
            risk_score = max(risk_score, ml_result.confidence * 100)
            reasons.append(f"Jailbreak detected: {ml_result.detection_type}")
        
        if dl_result and dl_result.entities_masked > 0:
            risk_score = max(risk_score, 25)
            reasons.append(f"PII detected: {dl_result.entities_masked} entities masked")
        
        if not auth_result.is_authorized:
            risk_score = 100
            reasons.append("User unauthorized")
        
        # Determine action
        if risk_score >= 75:
            action = "BLOCK"
        elif risk_score >= 25:
            action = "WARN"
        else:
            action = "ALLOW"
        
        return SecurityDecision(
            action=action,
            risk_score=risk_score,
            reason=" | ".join(reasons) if reasons else "No threats detected",
            dl_flagged=dl_result and dl_result.entities_masked > 0,
            ml_flagged=ml_result and ml_result.is_jailbreak,
            auth_passed=auth_result.is_authorized
        )
    
    async def _forward_to_llm(self, request: PromptRequest, masked_prompt: str) -> Dict[str, Any]:
        """
        Forward sanitized request to actual LLM API.
        Week 2+: Integrate with real OpenAI/etc endpoints.
        """
        # WEEK 1: Mock response
        return {
            "id": "chatcmpl-mock",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "[Mock LLM response - Week 1]"
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(masked_prompt.split()),
                "completion_tokens": 10,
                "total_tokens": 0
            }
        }
    
    async def _log_to_siem(self, user_id: str, decision: SecurityDecision, prompt_hash: str):
        """
        Log to M4 (Identity/Telemetry) SIEM endpoint.
        For audit, compliance, threat hunting.
        """
        # WEEK 1: Mock logging
        print(f"[SIEM LOG] User: {user_id}, Decision: {decision.action}, Risk: {decision.risk_score}")
    
    def _hash_prompt(self, text: str) -> str:
        """Hash prompt for logging (PII protection)."""
        return hashlib.sha256(text.encode()).hexdigest()[:16]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Return proxy metrics for M6 (QA/monitoring)."""
"""
Core reverse proxy logic.
Orchestrates DLP → ML → Auth → LLM pipeline.

"""

import httpx
import asyncio
import time
import hashlib
from typing import Dict, Any, Optional
from datetime import datetime
from backend.schemas import (
    PromptRequest, ProxyRequest, SecurityDecision,
    DLPResult, MLResult, AuthResult, ProxyResponse
)

class LLMGuardProxy:
    """
    Main proxy orchestrator.
    """
    
    def __init__(self, llm_api_url: str = "https://api.openai.com/v1/chat/completions"):
        self.llm_api_url = llm_api_url
        self.metrics = {
            "total_requests": 0,
            "allowed": 0,
            "blocked": 0,
            "avg_latency_ms": 0
        }
    
    async def process_prompt(
        self,
        request: PromptRequest,
        user_id: str,
        api_key: str
    ) -> ProxyResponse:
        """
        Main request pipeline:
        1. Auth check (M4)
        2. DLP masking (M3)
        3. ML threat detection (M2)
        4. Risk decision
        5. Forward to LLM (or block)
        6. Log to SIEM (M4)
        """
        
        start_time = time.time()
        
        # Extract prompt from messages
        prompt_text = request.messages[-1]["content"] if request.messages else ""
        
        # ===== STEP 1: AUTH CHECK (M4) =====
        try:
            auth_result = await self._verify_auth(user_id, api_key)
            if not auth_result["is_authorized"]:
                return ProxyResponse(
                    status="blocked",
                    error_message="User not authorized",
                    security_decision=SecurityDecision(
                        action="BLOCK",
                        risk_score=100,
                        reason="Authentication failed",
                        dl_flagged=False,
                        ml_flagged=False,
                        auth_passed=False
                    )
                )
        except Exception as e:
            return ProxyResponse(
                status="error",
                error_message=f"Auth error: {str(e)}"
            )
        
        # ===== STEP 2: DLP MASKING (M3) =====
        dlp_result = await self._apply_dlp(prompt_text)
        masked_prompt = dlp_result.masked_text if dlp_result else prompt_text
        
        # ===== STEP 3: ML THREAT DETECTION (M2) =====
        ml_result = await self._run_ml_detection(prompt_text)
        ml_flagged = ml_result.is_jailbreak if ml_result else False
        ml_confidence = ml_result.confidence if ml_result else 0.0
        
        # ===== STEP 4: RISK DECISION =====
        decision = self._calculate_security_decision(
            dl_result=dlp_result,
            ml_result=ml_result,
            auth_result=auth_result
        )
        
        # ===== STEP 5: BLOCK OR FORWARD =====
        if decision.action == "BLOCK":
            self.metrics["blocked"] += 1
            return ProxyResponse(
                status="blocked",
                security_decision=decision
            )
        
        # Forward to LLM (Week 2+: add real endpoint)
        llm_response = await self._forward_to_llm(request, masked_prompt)
        self.metrics["allowed"] += 1
        
        # ===== STEP 6: LOG TO SIEM (M4) =====
        await self._log_to_siem(
            user_id=user_id,
            decision=decision,
            prompt_hash=self._hash_prompt(prompt_text)
        )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        self.metrics["total_requests"] += 1
        self.metrics["avg_latency_ms"] = (
            self.metrics["avg_latency_ms"] * 0.9 + latency_ms * 0.1
        )
        
        return ProxyResponse(
            status="success",
            data=llm_response,
            security_decision=decision
        )
    
    # ===== HELPER METHODS =====
    
    async def _verify_auth(self, user_id: str, api_key: str) -> AuthResult:
        """
        Call M4 (Identity Specialist) auth endpoint.
        Week 1: Mock
        Week 2+: Real IdP integration
        """
        # WEEK 1: Mock response
        return AuthResult(
            user_id=user_id,
            role="user",
            is_authorized=True,
            permissions=["read", "write"]
        )
    
    async def _apply_dlp(self, text: str) -> Optional[DLPResult]:
        """
        Call M3 (AppSec) DLP endpoint.
        Masks emails, SSNs, credit cards, etc.
        """
        # WEEK 1: Mock response
        return DLPResult(
            original_text=text,
            masked_text=text,  # No masking yet
            entities_masked=0,
            entity_types=[]
        )
    
    async def _run_ml_detection(self, text: str) -> Optional[MLResult]:
        """
        Call M2 (ML/NLP) jailbreak detector.
        Detects DAN, roleplay, prompt injection, etc.
        """
        # WEEK 1: Mock response
        return MLResult(
            is_jailbreak=False,
            confidence=0.0,
            matched_keywords=[],
            detection_type="none"
        )
    
    def _calculate_security_decision(
        self,
        dl_result: Optional[DLPResult],
        ml_result: Optional[MLResult],
        auth_result: AuthResult
    ) -> SecurityDecision:
        """
        Combine DLP, ML, Auth signals into final decision.
        """
        risk_score = 0.0
        reasons = []
        
        if ml_result and ml_result.is_jailbreak:
            risk_score = max(risk_score, ml_result.confidence * 100)
            reasons.append(f"Jailbreak detected: {ml_result.detection_type}")
        
        if dl_result and dl_result.entities_masked > 0:
            risk_score = max(risk_score, 25)
            reasons.append(f"PII detected: {dl_result.entities_masked} entities masked")
        
        if not auth_result.is_authorized:
            risk_score = 100
            reasons.append("User unauthorized")
        
        # Determine action
        if risk_score >= 75:
            action = "BLOCK"
        elif risk_score >= 25:
            action = "WARN"
        else:
            action = "ALLOW"
        
        return SecurityDecision(
            action=action,
            risk_score=risk_score,
            reason=" | ".join(reasons) if reasons else "No threats detected",
            dl_flagged=dl_result and dl_result.entities_masked > 0,
            ml_flagged=ml_result and ml_result.is_jailbreak,
            auth_passed=auth_result.is_authorized
        )
    
    async def _forward_to_llm(self, request: PromptRequest, masked_prompt: str) -> Dict[str, Any]:
        """
        Forward sanitized request to actual LLM API.
        Week 2+: Integrate with real OpenAI/etc endpoints.
        """
        # WEEK 1: Mock response
        return {
            "id": "chatcmpl-mock",
            "object": "chat.completion",
            "created": int(time.time()),
            "model": request.model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "[Mock LLM response - Week 1]"
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": len(masked_prompt.split()),
                "completion_tokens": 10,
                "total_tokens": 0
            }
        }
    
    async def _log_to_siem(self, user_id: str, decision: SecurityDecision, prompt_hash: str):
        """
        Log to M4 (Identity/Telemetry) SIEM endpoint.
        For audit, compliance, threat hunting.
        """
        # WEEK 1: Mock logging
        print(f"[SIEM LOG] User: {user_id}, Decision: {decision.action}, Risk: {decision.risk_score}")
    
    def _hash_prompt(self, text: str) -> str:
        """Hash prompt for logging (PII protection)."""
        return hashlib.sha256(text.encode()).hexdigest()[:16]
    
    def get_metrics(self) -> Dict[str, Any]:
        """Return proxy metrics for M6 (QA/monitoring)."""
        return self.metrics.copy()