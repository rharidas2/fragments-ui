import { signIn, getUser } from './auth.js';

async function init() {
  console.log('DOM loaded, initializing app...');
  
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');

  console.log('Login button found:', loginBtn);
  
  loginBtn.onclick = () => {
    console.log('Login button clicked! Starting signIn...');
    signIn().catch(error => {
      console.error('SignIn failed:', error);
    });
  };

  console.log('Checking for existing user...');
  const user = await getUser();
  console.log('User found:', user);
  
  if (!user) {
    console.log('No user found, showing login button');
    return;
  }

  // Update the UI to welcome the user
  userSection.hidden = false;
  userSection.querySelector('.username').innerText = user.username;
  
  // Disable the Login button (change this line)
  loginBtn.disabled = true;
  loginBtn.textContent = 'Logged In'; // Optional: change text too
}

addEventListener('DOMContentLoaded', init);