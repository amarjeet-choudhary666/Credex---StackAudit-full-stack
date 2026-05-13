# AI Spend Audit Tool

Anonymous **AI stack audit** for startups: deterministic savings rules, optional **Gemini** narrative, shareable URLs, and Credex lead capture after value.

## Screenshots

![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page+Screenshot)
![Audit Form](https://via.placeholder.com/800x400?text=Multi-Step+Audit+Form)
![Results Dashboard](https://via.placeholder.com/800x400?text=Results+Dashboard+with+Savings)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Optional: `GEMINI_API_KEY` (Google AI Studio) for AI summaries and insights

### Install & Run Locally

```bash
git clone <your-repo-url>
cd credex-project

# Backend
cd backend
npm install
cp .env.example .env
# Apply schema additions (tools_snapshot, ai_summary, leads.team_size, pricing_snapshots)
# e.g. psql $DATABASE_URL -f drizzle/0005_audit_product.sql
npm run dev

# Frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:5173`.

## Quality bar (Lighthouse)

Target scores for the **production** build (Chrome Lighthouse, mobile):

- **Performance** ≥ 85  
- **Accessibility** ≥ 90  
- **Best Practices** ≥ 90  

Practices in this repo: route-level code-splitting for the PDF module, icon-only “trusted by” strip (no heavy image logos), semantic headings on landing/results, and Framer Motion scoped to above-the-fold sections. If scores slip, profile the main JS bundle and trim unused dependencies.

## Deploy

- **Frontend:** Vercel / Netlify / Cloudflare Pages (`VITE_API_URL` → `/api/v1`).
- **Backend:** Railway / Render / Fly + Neon Postgres. Set `FRONTEND_URL` for OG tags.

## Product docs (assignment bundle)

| File | Purpose |
|------|---------|
| `ARCHITECTURE.md` | System map |
| `DEVLOG.md` | Chronological decisions |
| `REFLECTION.md` | Founder/engineer synthesis |
| `TESTS.md` | How to run audit engine tests |
| `PRICING_DATA.md` | Where list prices live |
| `PROMPTS.md` | LLM prompt contracts |
| `GTM.md` | Positioning + loops |
| `ECONOMICS.md` | Unit economics framing |
| `USER_INTERVIEWS.md` | Discovery backlog |
| `LANDING_COPY.md` | On-page narrative |
| `METRICS.md` | Instrumentation plan |

## Decisions (short)

1. **Anonymous-first audits** — `POST /api/v1/audits` is fully public; no login required to deliver value.
2. **Deterministic math** — all dollar logic in `backend/src/lib/audit/`; LLMs only narrate.
3. **Postgres + Drizzle** — durable audits/leads with JSON snapshots for replay.
4. **Viral mechanics** — `/audit/:shareId` public view + OG HTML/SVG shim served by Express.
5. **Rate limits** — lightweight in-memory limiter (`backend/src/middleware/rateLimit.ts`) until a hosted limiter is justified.

## Live Demo

🚀 **[View Live Application](https://your-deployed-url.vercel.app)**

---

Built for the Credex Web Development Intern Assignment — Round 1.
