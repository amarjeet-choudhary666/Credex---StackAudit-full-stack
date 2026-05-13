# Pricing data

Canonical per-seat **monthly USD** assumptions for deterministic audits live in:

`backend/src/lib/audit/pricing.ts`

Tools modeled (aligned with the assignment brief):

| Vendor key        | Example tiers (per seat / month) |
|-------------------|----------------------------------|
| `cursor`          | Pro 20, Business 40, Enterprise 60 |
| `github_copilot`  | Individual 10, Business 19, Enterprise 39 |
| `claude`          | Pro 20, Team 30 |
| `chatgpt`         | Plus 20, Team 30, Enterprise 60 |
| `gemini`          | Advanced 20 |
| `windsurf`        | Pro 15, Team 25 |
| `openai_api` / `anthropic_api` | Pay-as-you-go anchors at 0 in the table; high spend triggers a negotiation heuristic |

> These numbers are **illustrative list prices** for modeling—not live billing API quotes. Finance reviewers should treat them as transparent assumptions that can be swapped in `pricing.ts`. Vendor list pages change; re-check before citing in external materials.

Canonical table lives in `backend/src/lib/audit/pricing.ts` (see file for tier keys used by the engine).
