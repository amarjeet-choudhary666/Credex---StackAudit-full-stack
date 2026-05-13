# Credex — Implemented routes & functionality

Base URLs in local development:

| Layer    | URL |
|----------|-----|
| Frontend | `http://localhost:5173` (Vite) |
| API      | `http://localhost:3000` — JSON routes under **`/api/v1`** |
| API root | `GET http://localhost:3000/` → API health JSON |

Frontend API calls use `resolveApiBaseUrl()` in `frontend/src/lib/api.ts`: in dev, relative **`/api/v1`** (Vite proxies `/api` → `:3000`) unless `VITE_API_URL` overrides.

---

## Backend — HTTP routes

All listed paths are prefixed with **`/api/v1`** unless noted.

### Auth (`backend/src/app.ts` + `modules/auth/auth.routes.ts`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register` | No | Email/password signup (bcrypt + HS256 token). |
| POST | `/auth/login` | No | Email/password login (HS256 token). |
| GET | `/auth/ping` | No | Sanity check that auth wiring is reachable. |
| GET | `/auth/me` | Bearer | Current user profile; JIT-provisions Supabase users into `users` when needed. |
| PATCH | `/auth/me` | Bearer | Update profile (`name`, optional — omit field for no change). |
| POST | `/auth/me/password` | Bearer | Change password (`currentPassword`, `newPassword`) — email/password accounts only. |

**Tokens:** Bearer JWT — Credex HS256 (`JWT_SECRET`) or Supabase access token verified via JWKS when `SUPABASE_URL` is set (`jose`, see `utils/token.ts`, `utils/supabaseJwt.ts`).

### Audits (`routes/audit.routes.ts` → `/audits`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/audits` | **required** | Create audit + tools + recommendation rows; attaches `user_id` from JWT. |
| GET | `/audits` | **required** | List audits for the authenticated user. |
| GET | `/audits/share/:shareId` | No | Public-ish fetch by share link (validate length). |
| GET | `/audits/:auditId/recommendations` | No | Recommendation rows + parsed `engine` JSON for that audit. |
| POST | `/audits/:auditId/insights` | **required** | Gemini narrative insights (needs `GEMINI_API_KEY` on server). |
| GET | `/audits/:auditId` | No | Audit detail by UUID. |
| DELETE | `/audits/:auditId` | **required** | Delete if owned by user. |

### Organizations (`/organizations`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/organizations` | **required** | Create organization. |
| GET | `/organizations/:id` | **required** | Get org by UUID. |
| PATCH | `/organizations/:id` | **required** | Update org. |

### Audit tools (`/audit-tools`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/audit-tools` | **required** | Create audit-tool row. |
| PATCH | `/audit-tools/:id` | **required** | Update. |
| DELETE | `/audit-tools/:id` | **required** | Delete. |

### Recommendations module (`/recommendations`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| PATCH | `/recommendations/:id` | **required** | Patch recommendation metadata / implemented flag. |

> Per-audit listing is on **`GET /audits/:auditId/recommendations`**, not under this router.

### Leads (`routes/lead.routes.ts` → `/leads`)

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/leads` | No | Create lead. |
| GET | `/leads/stats` | No | Lead stats (controller-defined). |

### Benchmarks & health

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/benchmarks` | No | Benchmark payload (controller). |
| GET | `/health` | No | Health check. |

### Analytics (`modules/analytics` → `/analytics`)

All endpoints require **Bearer** auth and aggregate **your** audits only.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/analytics/overview` | Audit count, total spend/savings, avg efficiency. |
| GET | `/analytics/spend-trends` | Monthly buckets: spend, savings, audit count. |
| GET | `/analytics/tool-distribution` | Sum of tool spend across audits (join `audit_tools`). |
| GET | `/analytics/savings` | Totals + per-audit savings rows. |
| GET | `/analytics/efficiency` | Average score + score timeline. |

### Intelligence layer (services)

| Module | File | Role |
|--------|------|------|
| Audit engine | `modules/audits/services/audit-engine.service.ts` | Totals, license-waste heuristic, duplicate-tool detection, overlap clusters (coding / chat / API stacks), **BenchmarkInsight** (cohort ratio + overspending %). |
| Recommendation engine | `modules/recommendations/services/recommendation-engine.service.ts` | Wraps legacy per-tool rules + **stack consolidation** recommendations (parallel coding assistants, chat LLMs, API vendors). |
| Benchmarks | `services/benchmark.service.ts` | `getBenchmarkInsight()` extends cohort benchmarks with `spendVsBenchmarkRatio` and `overspendingVsCohortPercent`. |
| Audit orchestration | `services/audit.service.ts` | `createAudit` runs audit engine + recommendation engine; API response `benchmark` includes overlap/utilization metadata for clients. |
| Gemini (optional) | `services/gemini.service.ts` | Uses `@google/generative-ai` with **`gemini-2.5-flash`** by default (Google AI Studio free-tier friendly; bare `gemini-1.5-flash` is remapped). |

### Root

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/` | No | API alive + version JSON. |

---

## Frontend — React routes (`frontend/src/App.tsx`)

| Path | Guard | Screen / behavior |
|------|-------|---------------------|
| `/` | Public | Landing (marketing + nav to auth). |
| `/auth` | Public | Login / register (Credex API or Supabase per env). |
| `/audit` | **ProtectedRoute** | Multi-step audit wizard → `POST /audits` with Bearer token. |
| `/results/:auditId` | **ProtectedRoute** | Results after audit. |
| `/report/:shareId` | Public | Public report by share id. |
| `/dashboard` | **ProtectedRoute** | Shell + sidebar. |
| `/dashboard` (index) | Protected | Overview — `GET /audits`. |
| `/dashboard/audits` | Protected | Audit list — `GET /audits`. |
| `/dashboard/audits/:auditId` | Protected | Audit detail — uses audit APIs. |
| `/dashboard/recommendations` | Protected | Loads audits + `GET /audits/:id/recommendations` per audit. |
| `/dashboard/settings` | Protected | Settings placeholder / UI. |
| `/dashboard/billing` | Protected | **UI only** — no billing backend or Stripe yet. |
| `*` | Redirect | → `/` |

**Auth UX:** `AuthProvider` + `SupabaseSessionSync` keep `credex_access_token` aligned with Supabase; `ProtectedRoute` waits for session then requires `useAuth().user` (`GET /auth/me`). After login, redirect uses `location.state.from` when present (e.g. return to `/audit`).

---

## Core behaviors implemented

- **DB:** Drizzle + Postgres (`DATABASE_URL`); schema includes users, organizations, audits, audit_tools, recommendations, leads, enums.
- **Dashboard data:** Audits and recommendations appear only for audits **created while authenticated** (`POST /audits` requires auth so `user_id` is set).
- **Billing:** No subscription APIs — intentional placeholder until Stripe (or similar) is integrated.

---

## Env configuration

- **Backend:** see `backend/.env.example` (`DATABASE_URL`, `JWT_SECRET`, `SUPABASE_URL`, optional JWKS tuning).
- **Frontend:** see `frontend/.env.example` (`VITE_SUPABASE_*`, optional `VITE_API_URL`).

---

## Related files (quick map)

| Area | Location |
|------|----------|
| API entry | `backend/src/index.ts`, `backend/src/app.ts` |
| Route aggregation | `backend/src/routes/index.ts` |
| Frontend router | `frontend/src/App.tsx` |
| HTTP client | `frontend/src/lib/api.ts` |
| Auth context | `frontend/src/context/auth-context.tsx` |
