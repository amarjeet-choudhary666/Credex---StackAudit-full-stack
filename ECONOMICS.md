# Economics

## Unit economics (assumption-driven model)

- **CAC proxy:** Organic + founder-led posts; no paid acquisition modeled in this assignment build.
- **Conversion funnel:** Landing visit → audit completion (~60s) → lead form (optional) → consult booking (high-savings cohort only).
- **Value lever:** Credex monetizes on **consulting / brokerage / managed negotiation**, not on selling PDFs. The audit is a **loss-leader** whose marginal cost is API spend on summaries + Postgres storage.

## Savings model integrity

- Reported savings are **bounded** by self-reported `monthlySpend` inputs; the engine never invents new vendors.
- Overlap packs apply a **45% redundant-stack haircut** on secondary tools in the same category—documented as a heuristic, not ground truth.

## Sensitivity

- If list pricing in `pricing.ts` drifts from street prices, modeled savings will skew. Mitigation: periodic `pricing_snapshots` rows + version tag inside `tools_snapshot.engineVersion`.

## Presentation economics (assignment)

- **Marginal cost per audit:** dominated by optional Gemini summary + Postgres row; PDF generation is client-side in this build (keeps infra simple).  
- **Revenue (if any):** modeled as consult / brokerage on **high-savings** cohorts only — low-savings UX explicitly avoids burning sales cycles.  
- **Trust ROI:** “Verified public pricing” + dated data cut reduces support burden (“where did this number come from?”) in founder demos.
