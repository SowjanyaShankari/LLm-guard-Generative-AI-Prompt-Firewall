# System Architecture

                    User
                      │
                      ▼
              FastAPI Gateway
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
 Authentication   Validation     Rules Engine
                      │
                      ▼
              Telemetry Logger
                      │
                      ▼
                 External LLM
                      │
                      ▼
                   Response