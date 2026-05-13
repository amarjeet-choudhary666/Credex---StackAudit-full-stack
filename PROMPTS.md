# Prompts

## AI spend summary (post-audit)

**Model:** Google Gemini (`GEMINI_MODEL`, default `gemini-2.5-flash`) via the Generative Language API.

**Prompt:** Short founder-facing paragraph (≤100 words) built in `AiAuditSummaryService` from savings, team size, use case, and top recommendation lines. Plain text, no markdown.

**Fallback:** `"You could save approximately $X/month by optimizing your AI stack."` when `GEMINI_API_KEY` is missing or the request fails.

## Legacy Gemini “insights” prompt

Still documented in `backend/src/services/gemini.service.ts` for the optional `/audits/:id/insights` path (auth-gated in routes). Uses a longer JSON payload and multi-section response.
