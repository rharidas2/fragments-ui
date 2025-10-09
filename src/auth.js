// src/auth.js

import { UserManager } from 'oidc-client-ts';

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.AWS_COGNITO_POOL_ID}`,
  client_id: process.env.AWS_COGNITO_CLIENT_ID,
  redirect_uri: process.env.OAUTH_SIGN_IN_REDIRECT_URL,
  response_type: 'code',
  scope: 'phone openid email',
  revokeTokenTypes: ['refresh_token'],
  automaticSilentRenew: false,
};

// Create a UserManager instance
const userManager = new UserManager({
  ...cognitoAuthConfig,
});

export async function signIn() {
  await userManager.signinRedirect();
}

// Create a User class with the authorizationHeaders method
export class User {
  constructor(profile, accessToken, idToken) {
    this.profile = profile;
    this.accessToken = accessToken;
    this.idToken = idToken;
  }

  authorizationHeaders(contentType) {
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    return headers;
  }

  get username() {
    return this.profile && this.profile['cognito:username'];
  }

  get email() {
    return this.profile && this.profile.email;
  }
}

function formatUser(user) {
  console.log('User Authenticated', { user });
  return new User(user.profile, user.access_token, user.id_token);
}

export async function getUser() {
  if (window.location.search.includes('code=')) {
    const user = await userManager.signinCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
    return formatUser(user);
  }

  const user = await userManager.getUser();
  return user ? formatUser(user) : null;
}