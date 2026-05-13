# Tests

## Audit engine (required coverage)

Deterministic savings logic lives in `backend/src/lib/audit/`. Vitest specs:

- File: `backend/src/lib/audit/audit.engine.test.ts`
- Run: `cd backend && npx vitest run src/lib/audit/audit.engine.test.ts`

### What is covered

1. Cursor Business → Pro recommendation for tiny teams / seat counts.
2. ChatGPT Team → Plus for appropriately small footprints.
3. Annualization consistency from `runAudit`.
4. Already-optimized single-tool stacks returning zero savings.
5. Fallback summary string contract (plain English dollar figure).

## What is intentionally not covered here

- Heavy UI testing (assignment explicitly de-prioritizes this).
- End-to-end browser flows (would add Playwright in a longer program).
