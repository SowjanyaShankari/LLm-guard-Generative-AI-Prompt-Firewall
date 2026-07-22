# Security Policies

## Authentication

Every request must include a valid API Key.

---

## Prompt Validation

The system checks for:

- Prompt Injection
- Jailbreak
- System Prompt Leakage
- Developer Mode Attacks

---

## Risk Levels

| Score | Action |
|--------|---------|
| 0-24 | Allow |
| 25-74 | Warn |
| 75-100 | Block |

---

## Logging

Every request stores

- Timestamp
- Prompt
- Risk Score
- Action