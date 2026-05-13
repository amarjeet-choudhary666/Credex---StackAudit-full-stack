# Metrics

## North-star (proposed)

- **Weekly qualified audits:** Audits with ≥3 tools and non-zero modeled savings.
- **Share rate:** % of audits where `navigator.clipboard` share succeeds / explicit share taps (instrument via analytics endpoint when added).
- **Lead capture rate:** Leads / audits, split by `monthlySavings` bucket (<100, 100–500, >500).

## Technical health

- `POST /audits` p95 latency (target <400ms excluding DB cold start).
- `POST /audits/share/:id/ai-summary` error rate (Gemini vs fallback).
- Rate-limit 429 count (should stay near zero for humans; spikes imply bot traffic).

## Integrity checks

- % audits where `sum(tool.monthlySpend)` matches stored `total_monthly_spend` within rounding tolerance.
- % recommendations deserialized successfully from JSON rows (should be ~100%).
