# Credex AI Spend Audit — Implementation Plan & Notes

This document tracks how the **Phase 1–5** backend/frontend plan was applied in this repo, what shipped, and what to do next for production SaaS parity.

> **2026 product note:** The **shipped** Credex assignment build is an **anonymous AI spend audit** (no login, no billing). Tables below still mention legacy auth/dashboard routes for historical context — the live API surface is documented in `ARCHITECTURE.md` (`POST /audits`, public share routes, `POST /leads`, rate limits, Resend email). Auth middleware, JWT utilities, and Stripe setup docs were removed from the codebase to match the brief.

---

## Phase 1 — Core database (Drizzle / PostgreSQL)

Tables are defined in `backend/src/db/schema.ts` **in dependency order**:

| Order | Table             | Notes |
|-------|-------------------|--------|
| 1 | `users` | Email unique; **`password_hash`** added for JWT email/password auth (bcrypt). |
| 2 | `organizations` | Matches spec; org ↔ user ownership can be added later (e.g. `members` join table). |
| 3 | Enums | `use_case`, `supported_tool`, **`audit_status`**. |
| 4 | `audits` | Spec + **`total_monthly_spend`**, **`unused_license_monthly_waste`** for Phase 3 reporting (modeled totals). |
| 5 | `audit_tools` | Per-tool inventory; **`plan_name`** maps wizard `plan` → DB. |
| 6 | `recommendations` | Row per engine recommendation; **`description` stores JSON** of the full legacy recommendation object for lossless API/UI mapping. |
| 7 | `leads` | As specified; linked to `audits` optional FK. |

### Migrations

After schema changes:

```bash
cd backend
npm run db:generate   # drizzle-kit generate
npm run db:migrate    # or npm run db:push for dev
```

---

## Phase 2 — Backend APIs (Express, `/api/v1`)

Mounted in `backend/src/routes/index.ts`:

| Area | Method | Path | Auth |
|------|--------|------|------|
| Auth | POST | `/auth/register` | Public |
| Auth | POST | `/auth/login` | Public |
| Auth | GET | `/auth/me` | Bearer JWT |
| Organizations | POST | `/organizations` | Required |
| Organizations | GET/PATCH | `/organizations/:id` | Required |
| Audits | POST | `/audits` | Optional (`optionalAuth`) — attaches `user_id` when Bearer present |
| Audits | GET | `/audits` | Required — lists audits for `req.user.id` |
| Audits | GET | `/audits/share/:shareId` | Public — viral share |
| Audits | GET | `/audits/:auditId` | Public — detail + tools + parsed recommendations |
| Audits | DELETE | `/audits/:auditId` | Required — only if `audit.user_id` matches |
| Audits | GET | `/audits/:auditId/recommendations` | Public — structured rows + `engine` parse |
| Audit tools | POST/PATCH/DELETE | `/audit-tools` … | Required |
| Recommendations | PATCH | `/recommendations/:id` | Required |
| Leads | POST | `/leads` | Public |
| Benchmarks / Health | GET | `/benchmarks`, `/health` | Public |

### Environment

- **`DATABASE_URL`** — Postgres connection string.  
- **`JWT_SECRET`** — required in production (defaults to dev string only for local).  
- **`FRONTEND_URL`** — CORS (see `backend/src/app.ts`).

### Folder layout (modular)

- `backend/src/modules/auth/` — register, login, me  
- `backend/src/modules/organizations/` — CRUD stubs  
- `backend/src/modules/audit-tools/` — line-item CRUD  
- `backend/src/modules/recommendations/` — list-by-audit + PATCH  
- `backend/src/middlewares/auth.middleware.ts` — `requireAuth`, `optionalAuth`  
- `backend/src/services/audit.service.ts` — transactional create + dashboard payloads  

---

## Phase 3 — Core business logic (audit pipeline)

On **`POST /audits`** the server:

1. Runs the existing **recommendation engine** (`RecommendationService`).  
2. Computes **totals**: current spend, recommended spend, monthly/annual savings.  
3. Computes **unused license waste** (excess seats × implied per-seat rate).  
4. Computes **efficiency score** via `BenchmarkService`.  
5. Generates **summary** via `SummaryService`.  
6. In a **single DB transaction**: insert `audits`, then `audit_tools`, then `recommendations` (with JSON in `description`).

Anonymous audits are supported (`user_id` null). Logged-in requests persist **`user_id`** for dashboard listing.

---

## Phase 4–5 — Frontend (Vite + React + shadcn)

Routes in `frontend/src/App.tsx`:

| Path | Purpose |
|------|---------|
| `/` | Marketing / landing |
| `/auth` | Login & register (stores JWT in `localStorage` key `credex_access_token`) |
| `/audit`, `/results/:auditId`, `/report/:shareId` | Original funnel + public share |
| `/dashboard/*` | **Protected** SaaS shell (`DashboardLayout` + sidebar) |
| `/dashboard/audits`, `/dashboard/audits/:auditId` | List + detail (delete) |
| `/dashboard/recommendations`, `/settings`, `/billing` | Placeholders / stubs for Phase 5 charts & billing |

API client: `frontend/src/lib/api.ts` — attaches `Authorization: Bearer` automatically when token exists. **Public share** uses `GET /audits/share/:shareId` (updated from legacy `/audits/:shareId`).

---

## Known gaps / next steps

1. **Org membership & RBAC** — `organizations` exists but no join table; PATCH is authenticated-only, not org-scoped.  
2. **Dashboard charts** — Phase 5 widgets (spend, projections, tool mix) not built; stub pages point to endpoints.  
3. **Transactional email** — Lead capture still logs placeholder (`LeadService`).  
4. **Migrate anonymous audits to user** — Optional “claim audit” flow after login.  
5. **Rate limiting / honeypot** — Document in API security section when adding production middleware.  
6. **E2E tests** — Add CI coverage for auth + audit transaction.

---

## Quick verification

**Backend**

```bash
cd backend
npm run build
npm run dev
```

**Frontend**

```bash
cd frontend
npm run build
npm run dev
```

Register at `/auth`, then create an audit with the wizard while logged in so `GET /audits` returns rows.

---

## Product stance

- **Marketing site** stays lightweight and public.  
- **Dashboard** is the SaaS shell for authenticated operators and future paid workspaces.  
- **Audit engine** remains deterministic rules + templated/LLM summary service as before; only persistence and APIs expanded.
