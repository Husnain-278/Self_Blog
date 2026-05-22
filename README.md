# Self_Blog — Frontend (React + Vite)

This is the frontend application for the SelfBlog project. Built with React and Vite, it provides the UI for viewing, creating, editing posts, and user authentication.

## Contents
- `src/` — React source files
- `public/` — static assets
- `.env` — Vite environment variables (not committed; see example below)

## Prerequisites
- Node.js 18+ and npm
- Backend API running (see `backend_self_blog`)

## Setup
1. Install dependencies

```bash
cd Self_Blog
npm install --legacy-peer-deps
```

2. Create `.env` in the `Self_Blog` folder (example variables):

```
VITE_API_URL=http://127.0.0.1:8000/api/v1
VITE_FRONTEND_URL=http://localhost:5173
# Optional: Cloudinary client keys (use carefully)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

3. Start dev server

```bash
npm run dev
```

Open the printed URL (default http://localhost:5173 or another port if 5173 is in use).

## Build

```bash
npm run build
```

Serve the `dist/` output with your preferred static host or integrate into your backend deployment.

## Environment variables
- Use `VITE_` prefix for environment variables exposed to the client. Access them via `import.meta.env.VITE_API_URL`.

## Notes about the backend
- The frontend expects the Django backend (in `backend_self_blog`) to provide REST endpoints under `/api/v1` including token auth endpoints (`/token/`, `/token/refresh/`), profiles, posts, and categories.
- Ensure CORS and CSRF settings on the backend allow requests from the frontend origin.

## Common commands
- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run preview` — locally preview build

## Troubleshooting
- If you encounter peer dependency errors when installing, use `npm install --legacy-peer-deps`.
- If the frontend cannot reach the backend, verify `VITE_API_URL` and backend CORS.

## Contributing
Open a PR with changes to `src/` and include a description of your change and testing steps.

---
Update this README with any project-specific details you want to preserve.
