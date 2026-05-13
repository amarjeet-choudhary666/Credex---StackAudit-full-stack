# Devlog

## 2026-05-12 — Product pivot to anonymous audit + rule engine

- Re-centered the product on **no-login audits**, **share URLs**, and **deterministic savings** per assignment feedback.
- Introduced `backend/src/lib/audit/` (`pricing`, `rules`, `recommendations`, `calculations`, `index`) and wired `AuditService` to `runAudit()` instead of stacking opaque heuristics only in the recommendation service.
- Opened `POST /api/v1/audits` with rate limits so anonymous founders can ship an audit in one session.
- Added `POST /audits/share/:shareId/ai-summary` with **Gemini**-backed text plus templated fallback; persisted on `audits.ai_summary`.
- Added OG HTML + SVG routes for lightweight social previews.
- Simplified the React app shell: landing → audit wizard → results keyed by `shareId`; legacy `/report/:shareId` redirects to `/audit/:shareId`.
- Expanded landing copy (problem framing + comparison table) and lead capture (email, company, role, team size + honeypot).

## Follow-ups if this ships beyond the assignment

- Replace in-memory rate limits with Arcjet / Upstash for multi-instance fairness.
- Harden `GET /audits/:auditId` ownership checks if accounts return.
- Consider extracting `lib/audit` to a shared package if a future Next.js app router migration happens.
