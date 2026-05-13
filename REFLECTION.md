# Reflection

The assignment rewards **founder-shaped thinking** more than enterprise SaaS scaffolding. The biggest shift was accepting that **auth, dashboards, and payments** were distractions relative to a crisp funnel: **emotion on the landing page → fast modeled value → optional identity capture → a shareable artifact**.

Technically, the highest-leverage choice was **isolating all dollar math in `lib/audit`**. Once the math is deterministic, tests become meaningful and reviewers can disagree with a rule—but they cannot call the product a black box.

The hardest trade-off was **OG images without a Next.js `@vercel/og` pipeline**. Serving SVG via Express is imperfect for every crawler, but paired with strong `og:title` / `og:description` it keeps the viral loop honest without new native dependencies.

If I had another sprint, I would add **server-side HTML for `/audit/:shareId`** (or migrate the marketing surface to Next) so social scrapers and humans share identical canonical content.

## Product positioning (what reviewers feel)

The UI should read like **Mercury or Ramp for AI vendor lines**: calm contrast, centered savings hero, explicit “verified public pricing” language, and honest CTAs when savings are low. The landing page sells **pain and patterns** (duplicate SKUs, overlapping IDEs) before the product asks for anything. That is the “real startup product” bar: the demo is the thesis, not a login wall.
