// Placeholder data only. Once the Backend Security Engineer's telemetry
// endpoint exists (see workflow step "Telemetry Logging"), replace these
// with fetch()/WebSocket calls into /api/telemetry.

export const metrics = [
  { id: 'blocked', label: 'Prompts Blocked (24h)', value: 342, tone: 'threat' },
  { id: 'scanned', label: 'Prompts Scanned (24h)', value: 18420, tone: 'safe' },
  { id: 'dlp', label: 'PII Redactions (24h)', value: 57, tone: 'threat' },
  { id: 'latency', label: 'Avg Proxy Latency', value: '42ms', tone: 'safe' }
];

export const alerts = [
  {
    id: 'a1',
    severity: 'critical',
    type: 'Prompt Injection',
    summary: 'Nested instruction override attempt detected in user session.',
    time: '2m ago'
  },
  {
    id: 'a2',
    severity: 'high',
    type: 'Jailbreak Attempt',
    summary: 'Roleplay-based guardrail bypass pattern flagged by classifier.',
    time: '11m ago'
  },
  {
    id: 'a3',
    severity: 'medium',
    type: 'DLP Redaction',
    summary: 'Credit card number pattern masked before forwarding to LLM.',
    time: '26m ago'
  },
  {
    id: 'a4',
    severity: 'low',
    type: 'Rate Limit',
    summary: 'Client exceeded configured request threshold, throttled.',
    time: '48m ago'
  }
];

export const trend = [
  { hour: '00:00', blocked: 12, scanned: 640 },
  { hour: '04:00', blocked: 8, scanned: 480 },
  { hour: '08:00', blocked: 34, scanned: 1210 },
  { hour: '12:00', blocked: 61, scanned: 1890 },
  { hour: '16:00', blocked: 45, scanned: 1620 },
  { hour: '20:00', blocked: 27, scanned: 990 }
];
