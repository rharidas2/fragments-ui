// src/app.js

import { signIn, getUser } from './auth';

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || 'http://localhost:8080';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    signIn();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    return;
  }

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Add fragment creation UI
  userSection.innerHTML = `
    <h2>Hello <span class="username"></span>!</h2>
    
    <!-- Fragment Creation Form -->
    <div class="fragment-form">
      <h3>Create New Fragment</h3>
      <textarea id="fragmentContent" placeholder="Enter your text fragment..." rows="4" cols="50"></textarea>
      <br>
      <button id="createFragment">Create Fragment</button>
    </div>
    
    <!-- Fragment List -->
    <div class="fragments-list">
      <h3>Your Fragments</h3>
      <ul id="fragmentsList"></ul>
    </div>
  `;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Add event handler for create fragment button
  const createFragmentBtn = document.querySelector('#createFragment');
  createFragmentBtn.onclick = async () => {
    const content = document.querySelector('#fragmentContent').value;
    if (!content) {
      alert('Please enter some text');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/v1/fragments`, {
        method: 'POST',
        headers: user.authorizationHeaders('text/plain'),
        body: content
      });

      if (response.ok) {
        const fragment = await response.json();
        alert(`Fragment created! ID: ${fragment.fragment.id}`);
        document.querySelector('#fragmentContent').value = '';
        
        // Show the response in Network tab for screenshot
        console.log('Fragment created:', fragment);
      } else {
        alert('Failed to create fragment');
      }
    } catch (err) {
      console.error('Error creating fragment:', err);
      alert('Error creating fragment');
    }
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);