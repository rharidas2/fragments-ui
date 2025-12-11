// src/auth.js
import config from "./app.config.js";

const {
  cognitoDomain,
  clientId,
  redirectUri,
  region
} = config.cognito;

const REDIRECT_URI_ENCODED = encodeURIComponent(redirectUri);

const LOGIN_URL = `${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=openid+email&redirect_uri=${REDIRECT_URI_ENCODED}`;
const LOGOUT_URL = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${REDIRECT_URI_ENCODED}`;

export function login() {
  window.location.href = LOGIN_URL;
}

export function logout() {
  localStorage.removeItem("id_token");
  window.location.href = LOGOUT_URL;
}

// Called once on page load to see if Cognito sent a token in the #hash
export function handleCallback() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const idToken = params.get("id_token");

  if (idToken) {
    localStorage.setItem("id_token", idToken);
    // Clean URL
    window.location.hash = "";
  }
}

export function getToken() {
  return localStorage.getItem("id_token");
}

export function isAuthenticated() {
  return !!getToken();
}
