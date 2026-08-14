// Matches the backend as it exists today (backend/main.py):
//
// GET  /health            -> { status, service, version }
// POST /scan               -> body: { prompt: string }
//                            header: x-api-key
//                            response: {
//                              prompt: string,
//                              validation: { safe, reason, matched_keywords },
//                              rules: { risk_score, action },  // ALLOW | WARN | BLOCK
//                              log: { timestamp, prompt, risk_score, action }
//                            }
//
// There is no GET endpoint for historical metrics/alerts/trend yet, and
// no WebSocket — log_prompt() currently only prints to the server console
// and nothing is persisted. See the README note on what to ask the
// backend/telemetry teammate for next.

import { request } from './client.js';

export function checkHealth() {
  return request('/health');
}

export function postScan(prompt, direction = 'inbound') {
  return request('/scan', {
    method: 'POST',
    body: JSON.stringify({ prompt, direction })
  });
}
