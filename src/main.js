// src/main.js
import { handleCallback, isAuthenticated, login, logout } from "./auth.js";
import {
  listFragments,
  createTextOrJsonFragment,
  uploadImageFragment,
  getFragmentData,
  updateFragment,
  deleteFragment,
  convertFragment
} from "./fragments.js";

function setStatus(msg, isError = false) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = isError ? "red" : "inherit";
}

function setOutput(obj) {
  const el = document.getElementById("output");
  if (typeof obj === "string") {
    el.textContent = obj;
  } else {
    el.textContent = JSON.stringify(obj, null, 2);
  }
}

function showImagePreview(blob) {
  const url = URL.createObjectURL(blob);
  const img = document.getElementById("image-preview");
  img.src = url;
  img.style.display = "block";
}

window.addEventListener("DOMContentLoaded", async () => {
  // Handle Cognito redirect
  handleCallback();

  const loginBtn = document.getElementById("btn-login");
  const logoutBtn = document.getElementById("btn-logout");
  const authState = document.getElementById("auth-state");

  function updateAuthUI() {
    if (isAuthenticated()) {
      authState.textContent = "Authenticated ✅";
      loginBtn.style.display = "inline-block";
      loginBtn.disabled = true;
      loginBtn.textContent = "Logged in";
      logoutBtn.style.display = "inline-block";
    } else {
      authState.textContent = "Not authenticated ❌";
      loginBtn.style.display = "inline-block";
      loginBtn.disabled = false;
      loginBtn.textContent = "Login with Cognito";
      logoutBtn.style.display = "none";
    }
  }

  loginBtn.addEventListener("click", () => login());
  logoutBtn.addEventListener("click", () => logout());
  updateAuthUI();

  // List fragments
  document.getElementById("btn-list").addEventListener("click", async () => {
    try {
      setStatus("Loading fragments...");
      const data = await listFragments(true);
      setOutput(data);
      setStatus(`Loaded ${data.fragments?.length ?? 0} fragment(s).`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Create text / markdown
  document.getElementById("btn-create-text").addEventListener("click", async () => {
    try {
      const type = document.querySelector("input[name='text-type']:checked").value;
      const text = document.getElementById("text-body").value;
      setStatus(`Creating ${type} fragment...`);
      const res = await createTextOrJsonFragment(text, type);
      setOutput(res);
      setStatus(`Created fragment ${res.fragment?.id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Create JSON
  document.getElementById("btn-create-json").addEventListener("click", async () => {
    try {
      const body = document.getElementById("json-body").value || "{}";
      setStatus("Creating JSON fragment...");
      const res = await createTextOrJsonFragment(body, "application/json");
      setOutput(res);
      setStatus(`Created JSON fragment ${res.fragment?.id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Upload image
  document.getElementById("file-image").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setStatus(`Uploading image (${file.type})...`);
      const res = await uploadImageFragment(file);
      setOutput(res);
      setStatus(`Uploaded image fragment ${res.fragment?.id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Load fragment
  document.getElementById("btn-load-frag").addEventListener("click", async () => {
    const id = document.getElementById("frag-id").value.trim();
    if (!id) return setStatus("Enter fragment ID", true);
    try {
      setStatus(`Loading fragment ${id}...`);
      const data = await getFragmentData(id);
      if (data.type === "image") {
        showImagePreview(data.blob);
        setOutput("Image fragment loaded (preview below).");
      } else if (data.type === "json") {
        setOutput(data.json);
      } else {
        setOutput(data.text);
      }
      setStatus(`Loaded fragment ${id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Update fragment
  document.getElementById("btn-update").addEventListener("click", async () => {
    const id = document.getElementById("frag-id").value.trim();
    const body = document.getElementById("update-body").value;
    const type = document.getElementById("update-type").value;
    if (!id) return setStatus("Enter fragment ID", true);
    try {
      setStatus(`Updating fragment ${id}...`);
      const res = await updateFragment(id, body, type);
      setOutput(res);
      setStatus(`Updated fragment ${id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Delete fragment
  document.getElementById("btn-delete").addEventListener("click", async () => {
    const id = document.getElementById("frag-id").value.trim();
    if (!id) return setStatus("Enter fragment ID", true);
    try {
      setStatus(`Deleting fragment ${id}...`);
      const res = await deleteFragment(id);
      setOutput(res);
      setStatus(`Deleted fragment ${id}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });

  // Convert fragment
  document.getElementById("btn-convert").addEventListener("click", async () => {
    const id = document.getElementById("frag-id").value.trim();
    const ext = document.getElementById("convert-ext").value.trim();
    if (!id || !ext) return setStatus("Enter fragment ID and extension", true);
    try {
      setStatus(`Converting ${id} -> .${ext} ...`);
      const data = await convertFragment(id, ext);
      if (data.type === "image") {
        showImagePreview(data.blob);
        setOutput(`Image converted to .${ext} (preview below).`);
      } else if (data.type === "json") {
        setOutput(data.json);
      } else {
        setOutput(data.text);
      }
      setStatus(`Converted fragment ${id} to .${ext}`);
    } catch (err) {
      setStatus(err.message, true);
    }
  });
});
