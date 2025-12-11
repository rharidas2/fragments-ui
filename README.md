# Fragments UI

Simple front-end testing UI for the Fragments microservice.

## Features

- Configure API base URL (localhost or ECS load balancer)
- (Option A) Basic Auth for local Docker dev
- (Option B) Cognito login flow (in progress / partial)
- Create text / markdown fragments
- Create JSON fragments
- Create image fragments (PNG/JPEG/etc.)
- List and inspect fragments
- Update, convert, and delete fragments via the API

## Run locally

```bash
npm install
npm run dev
