export const API_TOOL_IDS = new Set(["openai_api", "anthropic_api"]);

export function isApiTool(toolId: string): boolean {
  return API_TOOL_IDS.has(toolId);
}

/** Grouped for audit UI (assignment-aligned catalog). */
export const TOOL_AUDIT_GROUPS = [
  {
    id: "coding",
    title: "Coding tools",
    subtitle: "IDE assistants & coding surfaces",
    toolIds: ["cursor", "github_copilot", "windsurf"] as const,
  },
  {
    id: "chat",
    title: "Chat assistants",
    subtitle: "Team chat SKUs & general LLM apps",
    toolIds: ["chatgpt", "claude", "gemini"] as const,
  },
  {
    id: "api",
    title: "API infrastructure",
    subtitle: "Usage-based — no per-seat math",
    toolIds: ["openai_api", "anthropic_api"] as const,
  },
] as const;

export const SUPPORTED_TOOLS = {
  cursor: {
    name: "cursor",
    displayName: "Cursor",
    description: "AI-first code editor",
    category: "editor",
    plans: [
      { name: "Free", pricePerSeat: 0, features: ["Limited AI requests"] },
      { name: "Pro", pricePerSeat: 20, features: ["Unlimited AI", "Advanced features"] },
      { name: "Business", pricePerSeat: 40, features: ["Team features", "Admin controls"] },
    ],
  },
  github_copilot: {
    name: "github_copilot",
    displayName: "GitHub Copilot",
    description: "AI pair programmer",
    category: "editor",
    plans: [
      { name: "Individual", pricePerSeat: 10, features: ["Code suggestions"] },
      { name: "Business", pricePerSeat: 19, features: ["Team features"] },
      { name: "Enterprise", pricePerSeat: 39, features: ["Advanced security"] },
    ],
  },
  claude: {
    name: "claude",
    displayName: "Claude",
    description: "Anthropic's AI assistant",
    category: "chat",
    plans: [
      { name: "Free", pricePerSeat: 0, features: ["Limited messages"] },
      { name: "Pro", pricePerSeat: 20, features: ["5x more usage"] },
      { name: "Team", pricePerSeat: 30, features: ["Team workspace"] },
    ],
  },
  chatgpt: {
    name: "chatgpt",
    displayName: "ChatGPT",
    description: "OpenAI's conversational AI",
    category: "chat",
    plans: [
      { name: "Free", pricePerSeat: 0, features: ["GPT-3.5"] },
      { name: "Plus", pricePerSeat: 20, features: ["GPT-4", "DALL-E"] },
      { name: "Team", pricePerSeat: 30, features: ["Team workspace"] },
    ],
  },
  anthropic_api: {
    name: "anthropic_api",
    displayName: "Anthropic API",
    description: "Claude via API (usage-based)",
    category: "api",
    plans: [
      {
        name: "Claude Sonnet–heavy mix",
        pricePerSeat: 0,
        features: ["Reported monthly below reflects API invoices"],
      },
      {
        name: "Claude Opus / mixed routing",
        pricePerSeat: 0,
        features: ["Higher per-token list rates on premium models"],
      },
      {
        name: "Committed tier (reported)",
        pricePerSeat: 0,
        features: ["Annual / committed minimums modeled as flat monthly"],
      },
    ],
  },
  openai_api: {
    name: "openai_api",
    displayName: "OpenAI API",
    description: "GPT models via API (usage-based)",
    category: "api",
    plans: [
      {
        name: "GPT-4o heavy",
        pricePerSeat: 0,
        features: ["Most calls on frontier multimodal models"],
      },
      {
        name: "GPT-4o mini / mixed",
        pricePerSeat: 0,
        features: ["Cost-optimized routing for bulk workloads"],
      },
      {
        name: "GPT-4.1 + tools",
        pricePerSeat: 0,
        features: ["Agentic / tool-heavy workloads"],
      },
    ],
  },
  gemini: {
    name: "gemini",
    displayName: "Gemini",
    description: "Google's AI model",
    category: "chat",
    plans: [
      { name: "Free", pricePerSeat: 0, features: ["Limited requests"] },
      { name: "Advanced", pricePerSeat: 20, features: ["Unlimited access"] },
    ],
  },
  windsurf: {
    name: "windsurf",
    displayName: "Windsurf",
    description: "AI coding assistant (Codeium)",
    category: "editor",
    plans: [
      { name: "Free", pricePerSeat: 0, features: ["Basic features"] },
      { name: "Pro", pricePerSeat: 15, features: ["Unlimited AI"] },
      { name: "Team", pricePerSeat: 25, features: ["Team billing & admin"] },
    ],
  },
} as const;

export const USE_CASES = [
  { value: "coding", label: "Coding", description: "Software development and programming" },
  { value: "writing", label: "Writing", description: "Content creation and copywriting" },
  { value: "data", label: "Data Analysis", description: "Data science and analytics" },
  { value: "research", label: "Research", description: "Information gathering and analysis" },
  { value: "mixed", label: "Mixed", description: "Multiple use cases" },
] as const;

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function startingPriceLabel(
  tool: (typeof SUPPORTED_TOOLS)[keyof typeof SUPPORTED_TOOLS]
): string {
  const prices = tool.plans.map((p) => p.pricePerSeat).filter((n) => n > 0);
  if (prices.length === 0) return "Usage-based — enter monthly spend";
  const min = Math.min(...prices);
  return `From ${formatUsd(min)}/user/mo list`;
}
