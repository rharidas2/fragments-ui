// src/app.js
import { checkHealth, getUserFragments } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login');
  const healthBtn = document.getElementById('check-health');
  const loadBtn = document.getElementById('load-fragments');

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const userSection = document.getElementById('user');
  const usernameSpan = document.querySelector('.username');

  const outputPre = document.getElementById('output');

  function showOutput(content) {
    if (typeof content === 'string') {
      outputPre.textContent = content;
    } else {
      outputPre.textContent = JSON.stringify(content, null, 2);
    }
  }

  // "Login" just updates the greeting for now
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    if (!email) {
      alert('Please enter an email first.');
      return;
    }
    usernameSpan.textContent = email;
    userSection.hidden = false;
  });

  // Check API Health button
  if (healthBtn) {
    healthBtn.addEventListener('click', async () => {
      try {
        const result = await checkHealth();
        if (result.ok) {
          showOutput(result.json);
        } else {
          showOutput(`Health check failed (${result.status}): ${result.text || ''}`);
        }
      } catch (err) {
        showOutput(`Error calling health check: ${err.message}`);
      }
    });
  }

  // Load My Fragments button
  if (loadBtn) {
    loadBtn.addEventListener('click', async () => {
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        alert('Please enter email and password.');
        return;
      }

      try {
        const result = await getUserFragments(email, password);

        if (result.ok) {
          // Should be { status: "ok", fragments: [...] }
          showOutput(result.json);
        } else if (result.text) {
          // e.g. "Unauthorized"
          showOutput(`Non-JSON response (${result.status}):\n${result.text}`);
        } else {
          showOutput(`Request failed with status ${result.status}`);
        }
      } catch (err) {
        showOutput(`Error loading fragments: ${err.message}`);
      }
    });
  }
});
