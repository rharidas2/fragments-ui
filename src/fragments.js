// src/fragments.js
import config from "./app.config.js";
import { getToken } from "./auth.js";

const API_URL = config.api.baseUrl;

async function apiRequest(path, options = {}) {
  const token = getToken();
  if (!token) {
    throw new Error("Not authenticated – please log in first.");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`
  };

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res;
}

export async function listFragments(expand = true) {
  const query = expand ? "?expand=1" : "";
  const res = await apiRequest(`/v1/fragments${query}`);
  return res.json();
}

export async function createTextOrJsonFragment(data, contentType) {
  const res = await apiRequest("/v1/fragments", {
    method: "POST",
    headers: {
      "Content-Type": contentType
    },
    body: data
  });
  return res.json();
}

export async function uploadImageFragment(file) {
  const res = await apiRequest("/v1/fragments", {
    method: "POST",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });
  return res.json();
}

export async function getFragmentData(id) {
  const res = await apiRequest(`/v1/fragments/${id}`);
  const contentType = res.headers.get("Content-Type") || "";

  if (contentType.startsWith("image/")) {
    const blob = await res.blob();
    return { type: "image", blob };
  } else if (contentType.includes("application/json")) {
    const json = await res.json();
    return { type: "json", json };
  } else {
    const text = await res.text();
    return { type: "text", text };
  }
}

export async function updateFragment(id, data, contentType) {
  const res = await apiRequest(`/v1/fragments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": contentType
    },
    body: data
  });
  return res.json();
}

export async function deleteFragment(id) {
  const res = await apiRequest(`/v1/fragments/${id}`, {
    method: "DELETE"
  });
  return res.json();
}

export async function convertFragment(id, extension) {
  const res = await apiRequest(`/v1/fragments/${id}.${extension}`);
  const contentType = res.headers.get("Content-Type") || "";

  if (contentType.startsWith("image/")) {
    const blob = await res.blob();
    return { type: "image", blob };
  } else if (contentType.includes("application/json")) {
    const json = await res.json();
    return { type: "json", json };
  } else {
    const text = await res.text();
    return { type: "text", text };
  }
}
