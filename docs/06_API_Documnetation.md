# API Documentation

## Base URL

http://127.0.0.1:8000

---

## GET /

Returns project status.

---

## GET /health

Checks server health.

---

## POST /scan

Scans prompts.

Header

x-api-key

Body

{
    "prompt":"Hello"
}