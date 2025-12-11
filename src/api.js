// src/api.js

// For now, hard-code the API URL. We know your backend is on 8080.
const API_URL = 'http://localhost:8080';

// Build Basic Auth header: "Basic base64(email:password)"
function buildAuthHeader(email, password) {
  const token = btoa(`${email}:${password}`);
  return `Basic ${token}`;
}

// Generic helper to call the backend
async function apiRequest(path, { method = 'GET', headers = {}, body } = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const contentType = res.headers.get('Content-Type') || '';

  // Try to parse JSON if possible
  if (contentType.includes('application/json')) {
    const json = await res.json();
    return { ok: res.ok, status: res.status, json };
  }

  // Fallback to text (like "Unauthorized")
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

// Health check: GET /
export async function checkHealth() {
  return apiRequest('/');
}

// Get current user's fragments: GET /v1/fragments
export async function getUserFragments(email, password) {
  const headers = {
    Authorization: buildAuthHeader(email, password),
  };

  return apiRequest('/v1/fragments', { method: 'GET', headers });
}
