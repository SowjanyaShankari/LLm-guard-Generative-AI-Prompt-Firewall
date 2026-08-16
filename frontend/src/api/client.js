// Thin wrapper around fetch(). Every /scan call on this backend requires
// an x-api-key header — attach it here once so components never have to think about it.

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const API_KEY = 'LLM-GUARD-2026-ADMIN';

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
    throw new Error(
      `Request to ${path} failed: ${res.status} ${res.statusText} ${body}`
    );
  }

  return res.json();
}

export { API_BASE, request };