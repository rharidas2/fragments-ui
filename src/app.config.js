// src/app.config.js
// src/app.config.js
export default {
    cognito: {
      userPoolId: "us-east-1_d7QxAcfsU",
      clientId: "5rjp6l4ivucrc6mevdgspn2u4h",   // from your App client
      region: "us-east-1",
      cognitoDomain: "https://us-east-1d7qxacfsu.auth.us-east-1.amazoncognito.com",
      redirectUri: "http://localhost:1234/"
    },
    api: {
      baseUrl: "http://fragments-lb-511747854.us-east-1.elb.amazonaws.com"
    }
  };
  
  