// Thin wrapper around fetch(). Every /scan call on this backend requires
// an x-api-key header (see backend/auth.py verify_api_key) — attach it
// here once so components never have to think about it.

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
<<<<<<< HEAD
const API_KEY = import.meta.env.VITE_API_KEY || '';
=======
const API_KEY = 'LLM-GUARD-2026-ADMIN';
console.log("API KEY =", API_KEY);
>>>>>>> dfed237 (Week 4 RBAC, telemetry and settings dashboard completed)

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers
    },
    ...options
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Request to ${path} failed: ${res.status} ${res.statusText} ${body}`);
  }

  return res.json();
}

export { API_BASE, request };
