# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

SportSee is a sports-tracking dashboard (OpenClassrooms Project 6 rework). It is a monorepo with two independent Node projects, each with their own `package.json` and no shared root tooling:

- `frontend/` — React Router v7 (framework mode) + TypeScript + Tailwind CSS + Recharts. This is where almost all work happens.
- `backend/` — a small Express + JWT API (forked from `OpenClassrooms-Student-Center/P6JS`) that serves 3 hardcoded demo users from `backend/app/data.json`. Rarely needs changes; mostly treated as a fixed contract the frontend adapts to.

## Commands

All commands are run from the relevant subdirectory (`frontend/` or `backend/`) — there is no root `package.json`.

Frontend (`cd frontend`):
```bash
npm run dev        # react-router dev server, http://localhost:5173
npm run build       # react-router build -> build/client (+ build/server if SSR)
npm run start        # serve a production build (react-router-serve)
npm run typecheck   # react-router typegen && tsc
```
There is no lint or test script configured in `frontend/package.json` — don't assume `npm test`/`npm run lint` exist.

Backend (`cd backend`):
```bash
npm run dev     # nodemon app/index.js, http://localhost:8000
npm run start   # node app/index.js
```

## Architecture

### Data flow and the mock/real API switch

All network access from the frontend goes through **`frontend/app/services/apiService.ts`** — components never call `fetch` directly. Every exported fetch function (`fetchUserInfo`, `fetchWeekActivity`, `fetchLast4WeeksActivity`, `fetchAllActivity`) follows the same shape:
1. Check an in-memory `Map` cache keyed by a data-specific key (e.g. `week:${offset}`) — one call per session per key, cleared on logout via `clearCache()`.
2. If `USE_MOCK` is true, return canned data from `frontend/app/data/mockData.ts` after an artificial delay instead of calling the backend.
3. Otherwise call the real Express backend at `VITE_API_URL`, attaching the JWT via `authHeaders()`.

`USE_MOCK` (in `mockData.ts`) is driven by the `VITE_USE_MOCK` env var (`"true"` to mock), not hardcoded — this lets the same build run against the real backend locally and fully mocked on deployments (e.g. Vercel) where no backend is reachable. `mockData.ts` also mirrors the backend's exact response shapes (`UserInfo`, `UserActivity`, etc.) and holds 3 demo users (`user123`/Sophie, `user789`/Emma, `user456`/Marc) used both for `USE_MOCK` and for `LoginForm`'s demo-account shortcut.

### Auth

JWT + userId are stored in cookies via `frontend/app/auth/authCookie.ts` (`saveAuth`, `getToken`, `getUserId`, `isAuthenticated`, `clearAuth`) — no server-side session, no localStorage. `frontend/app/components/ProtectedRoute.tsx` is a layout route that redirects to `/login` when `!isAuthenticated()`, **except when `USE_MOCK` is true**, in which case the dashboard is reachable without logging in (data falls back to `user123`/Sophie via `getUserId() ?? "user123"` in `apiService.ts`). Logging out (`Navbar`) calls `clearAuth()` + `clearCache()` and always redirects to `/login`, so the login page/demo accounts stay reachable even in mock mode.

### Routing (`frontend/app/routes.ts`)

React Router v7 config-based routing:
- `/login` — public.
- `layout(ProtectedRoute)` wraps `/` (dashboard, index route) and `/profile` — both require auth unless mocked (see above).
- `*` — 404 page.

`react-router.config.ts` currently has `ssr: false` (SPA mode) so the app builds to a fully static `build/client` bundle — no Node server is required at runtime. Deploying elsewhere with SSR needs re-enabling `ssr: true` and provisioning a server/adapter.

### State/data layer

- `frontend/app/context/AppContext.tsx` — global context wrapping the app in `root.tsx`, backed by `useUserInfo` hook; exposes `userInfo`, `isLoading`, `error`, `refreshUserInfo`.
- `frontend/app/hooks/useUserInfo.ts` — loads `/api/user-info` once on mount, exposes `refresh()` (called after login to repopulate the context without a full reload).
- `frontend/app/hooks/useUserActivity.ts` — parametrized by `mode: "dashboard" | "profile"`: dashboard mode fetches current-week + last-4-weeks activity in parallel; profile mode fetches all activity since `createdAt`. Backing charts (`components/charts/*`) do their own aggregation (e.g. `groupByWeek`, `computeWeeklyStats`, `computeAllTimeStats` in `mockData.ts`) rather than expecting the API to pre-aggregate.
- Backend has no `weeklyGoal` persistence quirk to note beyond: `fetchUserInfo` patches in a default `weeklyGoal = 5` when the API omits it, and gender is inferred client-side from the profile picture filename (`inferGenderFromPicture`) since the API doesn't return it.

### Deployment

Static/mocked deployment (e.g. Vercel) relies on:
- `VITE_USE_MOCK=true` env var so the whole app runs off `mockData.ts` with no backend.
- `frontend/vercel.json` — sets build command/output dir and rewrites all paths to `index.html` so client-side routing survives direct loads/refreshes of `/profile` etc. (required because there's no server in SPA mode).
- Root Directory must be set to `frontend` in Vercel project settings — the repo root has no build config of its own.
