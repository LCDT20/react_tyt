# Take Your Trade – Frontend

An end‑to‑end React application for managing the Take Your Trade marketplace: search Magic: The Gathering cards, maintain personal collections, connect external marketplaces, and run the full user dashboard. This README documents the architecture, authentication model (RS256 JWT), API contracts, deployment workflow, and how to get a clean production build from scratch.

---

## 1. System Overview

| Topic                | Details                                                                 |
|----------------------|-------------------------------------------------------------------------|
| Frontend Stack       | React 18, TypeScript, Vite 5                                            |
| Styling              | Tailwind CSS + custom Apple‑style components                           |
| Animations & Icons   | Framer Motion, Lucide                                                   |
| State Management     | Zustand with persistence (localStorage)                                 |
| HTTP Clients         | Axios instances (`authApi`, `api`) with interceptors                    |
| Routing              | React Router DOM 6                                                      |
| Node compatibility   | Node.js 18+                                                             |

Project layout (non exhaustive):

```
src/
├── app/                    MainLayout, Router configuration
├── components/             Reusable UI (header, collection modals, etc.)
├── hooks/                  Custom hooks (card detail, search, language, …)
├── lib/                    Axios clients, config, helpers
├── pages/                  Route-level components (Auth, Account, Cards…)
├── services/               Business wrappers around API clients
├── store/                  Zustand stores (auth, collection, activity)
└── styles/                 Tailwind global stylesheet
```

Removed assets: all legacy test HTML files and debug scripts were deleted from the repository to keep production builds clean.

---

## 2. Installation & Local Development

```bash
# install dependencies
npm install

# run the Vite dev server (http://localhost:5173 by default)
npm run dev

# lint sources (optional – configure .eslintrc as needed)
npm run lint
```

Environment variables:

| File               | Purpose                                             |
|--------------------|-----------------------------------------------------|
| `.env.production`  | Production API URLs and credentials (committed)     |
| `env.production`   | Hostinger deploy helper (if required by infra team) |

The Vite dev server proxies `/api` to the remote backend (`vite.config.ts`), so the frontend works with live APIs without CORS issues.

---

## 3. Building for Production

```bash
npm run build          # runs `tsc` then `vite build`
npm run preview        # locally serve the generated dist/ (optional)
```

The command produces a minified bundle in `dist/`:

- `dist/index.html`
- `dist/assets/*.js` + `*.css`
- hashed chunks split into `vendor`, `router`, `ui`, `store`, etc., via Rollup manual chunks (see `vite.config.ts`).

Upload the entire `dist/` directory to Hostinger (or your CDN). No debug/test files are shipped.

---

## 4. Authentication in Depth (RS256 JWT)

The backend issues RS256-signed JWTs. The frontend never signs tokens; it stores and forwards the signed payloads, allowing the backend to validate with its public key.

### 4.1 Token Storage Keys

| Key                         | Description                           |
|-----------------------------|---------------------------------------|
| `tyt_access_token`          | Short-lived access token              |
| `tyt_refresh_token`         | Long-lived refresh token              |
| `tyt_user`                  | Serialized user object                |

All are persisted in `localStorage`.

### 4.2 Axios Clients

- `src/lib/authApi.ts`: dedicated to `/auth/*` routes (login, register, refresh, logout).
- `src/lib/api.ts`: generic client for all other endpoints.

Both share base URL and timeouts defined in `src/lib/config.ts`.

### 4.3 Request Interceptor (authApi)

```ts
this.instance.interceptors.request.use((cfg) => {
  if (!this.token) this.token = localStorage.getItem(config.auth.tokenKey)
  if (this.token && cfg.headers) {
    cfg.headers.Authorization = `Bearer ${this.token}`
  }
  cfg.headers.Accept = 'application/json'
  cfg.headers['Content-Type'] = 'application/json'
  return cfg
})
```

This ensures every outgoing request carries `Authorization: Bearer <access_token>` and consistent headers.

### 4.4 Response Interceptor (Refresh Handling)

Simplified flow when a 401 response occurs:

1. Skip refresh for login/register/refresh endpoints and if `_retry` flag is set.
2. Fetch `tyt_refresh_token` from localStorage.
3. If missing, call `forceLogout()` (clears storage and redirects to `/login`).
4. If another refresh is already in progress → queue the original request and run it after success.
5. POST `/auth/refresh` with `refresh_token`.
6. On success, store new tokens, replay queued requests with updated headers.
7. On error, clear session and redirect to `/login`.

All tokens are signed RS256 by the backend. The frontend trusts the backend for signature verification; it never decodes or verifies the signature locally beyond storing payloads.

### 4.5 Zustand Auth Store (`src/store/authStore.ts`)

- `initializeAuth()` runs at app startup (`src/main.tsx`) to hydrate tokens, call `/auth/me`, and refresh if needed.
- `login(credentials)` calls `authApi.post('/auth/login')`, stores access/refresh tokens and user.
- `logout()` hits `/auth/logout` (if logged in), then clears local storage, Zustand state, and tokens in `authApi`.
- `setToken()` allows manual override (used after refresh).

### 4.6 Protected Routes

```tsx
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}
```

All account/dashboard/etc. routes are wrapped in `ProtectedRoute` via `src/app/Router.tsx`.

---

## 5. API Usage and Networking

### 5.1 Base URLs (`src/lib/config.ts`)

```ts
const apiBaseURL = import.meta.env.DEV
  ? '/api'   // proxied to https://enter.takeyourtrade.com/api in dev
  : 'https://enter.takeyourtrade.com/api'
```

So production and development share the same code path, with Vite rewriting requests as necessary.

### 5.2 Common Endpoints

| Area             | Methods (examples)                                                   |
|------------------|----------------------------------------------------------------------|
| Auth             | `POST /auth/login`, `POST /auth/register`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me` |
| Profile          | `GET /api/profile/settings`, `PUT /api/profile/settings/language`    |
| Cards & Search   | `GET /api/cards/search`, `GET /api/cards/:oracle_id`, `GET /api/cards/:oracle_id/printings` |
| Collection       | `GET /api/collection`, `POST /api/collection` (future wiring)        |

Hooks like `useCardDetail`, `useCardPrintings`, and services like `collectionService.ts` wrap these endpoints and unify error handling.

---

## 6. Feature Highlights

### 6.1 Search Experience (`src/pages/SearchPage.tsx`)
- Toggle between **table** and **card** view; default is table.
- Filters by set (with keyboard navigation), language, and pagination UI (logic ready for real backend).
- Each card row includes quick actions (view details).
- Always shows English fallback name beneath localized name.

### 6.2 Card Detail (`src/pages/Cards/CardDetailPage.tsx`)
- Card image with hover zoom preview.
- Language selector limited to languages available in the selected set.
- Central column lists rarity, set, number, total listings, etc.
- Buttons to “View printings” or “View complete set.”
- Collection modal:
  - Fields: condition (NM/SP/MP/PL/PO), language, quantity, price, foil yes/no, optional notes, photo placeholder.
  - Italian copy (requested by stakeholders).

### 6.3 Account Synchronization (`src/pages/Account/Synchronization`)
- UI for CardTrader integration: configure JWT token, copy webhook, view active sync status.
- Terms page (`SynchronizationTermsPage.tsx`) explains data flow, security guidelines, and user responsibilities.

### 6.4 Language Preference
- `LanguageContext` stores UI language, defaulting to user preference from `/api/profile/settings`. Changing language triggers both context update and REST call to persist selection.

---

## 7. State & Persistence

| Store                    | Purpose                                        |
|--------------------------|------------------------------------------------|
| `authStore.ts`           | Tokens, user, login/logout/refresh             |
| `activityStatusStore.ts` | Tracks overall account activity status         |
| `collectionStore.ts`     | Planned collection management                  |
| `registerStore.ts`       | Multi-step registration wizard state           |

All stores use Zustand’s `persist` middleware for safe rehydration across reloads.

---

## 8. Deployment Checklist

1. Clean workspace (optional): `git clean -fdx` or manual removal of `dist/`.
2. Install dependencies: `npm install`.
3. Build production bundle: `npm run build`.
4. Inspect `dist/` for expected assets.
5. Upload `dist/` to hosting environment (Hostinger) or serve statically via CDN.
6. Ensure backend endpoint `https://enter.takeyourtrade.com/api` is reachable over HTTPS.
7. Invalidate CDN cache if necessary so clients receive the latest bundle.

---

## 9. Contributing & Support

- Repository: <https://github.com/LCDT20/react_tyt>
- Create feature branches and open PRs targeting `main`.
- Report bugs through GitHub issues.
- For operational questions or API access, contact `support@takeyourtrade.com`.
- Related docs in root: `API_LANGUAGE_PREFERENCE.md`, `DEPLOY_INSTRUCTIONS.md`, `FORCE_REFRESH_GUIDE.md`, etc.

---

© 2025 TakeYourTrade. All rights reserved.