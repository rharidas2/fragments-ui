// src/api.js

// Base URL for your backend API
// Use env var if provided, otherwise default to localhost:8080
const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  window.API_URL ||
  'http://localhost:8080';

// Helper to build Basic Auth header
function buildAuthHeader(email, password) {
  const token = btoa(`${email}:${password}`);
  return `Basic ${token}`;
}

// Health check: GET /
export async function checkHealth() {
  const res = await fetch(`${API_URL}/`, {
    method: 'GET',
  });

  const text = await res.text();

  // Try to parse JSON if possible
  try {
    const json = JSON.parse(text);
    return { ok: res.ok, status: res.status, json };
  } catch (_) {
    return { ok: res.ok, status: res.status, text };
  }
}

// Get current user's fragments: GET /v1/fragments
export async function getUserFragments(email, password) {
  const res = await fetch(`${API_URL}/v1/fragments`, {
    method: 'GET',
    headers: {
      Authorization: buildAuthHeader(email, password),
    },
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    return { ok: res.ok, status: res.status, json };
  } catch (_) {
    return { ok: res.ok, status: res.status, text };
  }
}
