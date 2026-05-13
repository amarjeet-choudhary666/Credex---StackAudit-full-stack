# Architecture

This repository ships a **viral AI spend audit** for Credex: anonymous intake, a **deterministic rule engine** for savings math, a short **LLM summary** layered on top, and **shareable public URLs** for acquisition.

## System overview

- **Frontend** (`frontend/`): Vite + React + TypeScript, Tailwind v4, shadcn-style UI, React Hook Form + Zod on the audit path, Zustand with `persist` for form state across reloads, Framer Motion for polish, TanStack Query provider for future data hooks.
- **Backend** (`backend/`): Express 5 + TypeScript, Drizzle ORM, PostgreSQL. REST base path `/api/v1`.
- **Audit engine** (`backend/src/lib/audit/`): Single source of truth for list-pricing assumptions, seat/plan rules, overlap heuristics, and aggregate savings. **No LLM** participates in dollar math.
- **AI summary** (`backend/src/services/ai-audit-summary.service.ts`): **Google Gemini** (`GEMINI_API_KEY`) for short share-page narratives; deterministic one-line fallback if the API is unavailable. Summaries are persisted on `audits.ai_summary`.
- **Persistence**: `audits` stores numerics, markdown-style `summary`, JSON `tools_snapshot`, and recommendations rows. `leads` captures optional email after value, with `team_size` denormalized from the audit flow.
- **Viral surface**: `GET /api/v1/audits/share/:shareId/open` returns crawler-friendly HTML with Open Graph + Twitter Card tags; `GET .../og.svg` serves a lightweight dynamic SVG for `og:image`.
- **Rate limiting**: In-memory per-IP windows (`backend/src/middleware/rateLimit.ts`) — see below.

## Rate limiting & abuse protection

The API uses a small **in-memory sliding window** limiter (per client IP, honoring `X-Forwarded-For` when present). It is appropriate for demos and small deploys; swap for Redis / edge limits in production.

| Route | Limit | Window | Purpose |
|-------|-------|--------|---------|
| `POST /api/v1/audits` | 30 requests | 60s | Prevent audit spam / DB abuse |
| `POST /api/v1/audits/share/:shareId/ai-summary` | 20 requests | 60s | Cap expensive Gemini calls |

On exceed, the API returns **429** with a plain message. Limits are defined in `backend/src/routes/audit.routes.ts` next to each handler.

## Request flow (happy path)

1. User completes `/audit` → `POST /api/v1/audits` (**no login**; anonymous audits only).
2. Engine runs → audit row + tool rows + recommendation rows inserted; response includes `auditId`, `shareId`, savings, benchmark snapshot fields where applicable.
3. Client navigates to `/results/:shareId`, hydrates from `GET /audits/share/:shareId` (includes modeled **benchmark** vs peer spend), then `POST /audits/share/:shareId/ai-summary` for the narrative.
4. Lead form → `POST /api/v1/leads` with honeypot field `companyWebsite` (must remain empty); optional base64 **PDF** attachment (same bytes as in-app download) is sent with the lead and attached to the Resend confirmation email when configured.

## Deployment notes

- Frontend expects `VITE_API_URL` (or dev proxy) pointing at `/api/v1`.
- Backend should set `FRONTEND_URL` for OG `og:url` and redirects in the HTML shim.
- Run SQL in `backend/drizzle/0005_audit_product.sql` (or `drizzle-kit push`) before relying on `tools_snapshot` / `ai_summary` / `team_size` / `pricing_snapshots`.
