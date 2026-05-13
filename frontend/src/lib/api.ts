/**
 * Backend serves under `/api/v1`. Misconfigured `VITE_API_URL` is normalized here.
 */
export function resolveApiBaseUrl(): string {
  const fallback = "http://localhost:3000/api/v1";
  const raw = import.meta.env.VITE_API_URL?.trim();

  if (!raw) {
    return import.meta.env.DEV ? "/api/v1" : fallback;
  }

  if (raw.startsWith("/")) {
    const p = raw.replace(/\/+$/, "") || "/";
    if (/\/api\/v1$/i.test(p)) return p;
    if (p === "/" || p.toLowerCase() === "/api") return "/api/v1";
    return `${p}/api/v1`.replace(/\/+/g, "/");
  }

  try {
    const u = new URL(raw);
    let pathname = u.pathname.replace(/\/+$/, "") || "";
    if (pathname === "" || pathname === "/") {
      pathname = "/api/v1";
    } else if (pathname.toLowerCase() === "/api") {
      pathname = "/api/v1";
    } else if (!/\/api\/v1$/i.test(pathname)) {
      pathname = `${pathname}/api/v1`.replace(/\/+/g, "/");
    }
    u.pathname = pathname;
    return u.href.replace(/\/+$/, "");
  } catch {
    return import.meta.env.DEV ? "/api/v1" : fallback;
  }
}

const API_BASE_URL = resolveApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateAuditRequest {
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  tools: {
    tool: string;
    plan: string;
    monthlySpend: number;
    seats: number;
  }[];
  organizationId?: string;
}

export interface Recommendation {
  tool: string;
  currentPlan: string;
  seats: number;
  currentMonthlySpend: number;
  recommendedAction: string;
  recommendedPlanOrTool: string;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
}

export interface AuditBenchmark {
  averageSpendPerDeveloper: number;
  userSpendPerDeveloper: number;
  percentile: number;
  industryAverage: number;
  teamSizeCategory: string;
  spendVsBenchmarkRatio: number;
  overspendingVsCohortPercent: number;
}

export interface AuditResult {
  auditId: string;
  shareId: string;
  monthlySavings: number;
  annualSavings: number;
  efficiencyScore: number;
  recommendations: Recommendation[];
  summary: string;
  aiSummary?: string | null;
  teamSize?: number;
  primaryUseCase?: string;
  createdAt?: string;
  benchmark?: AuditBenchmark;
}

export interface CreateLeadRequest {
  auditId?: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  companyWebsite?: string;
  /** Base64 PDF from the same generator as the Download PDF button. */
  auditPdfBase64?: string;
  auditPdfFilename?: string;
}

class ApiClient {
  private headers(base?: HeadersInit): HeadersInit {
    const h: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (base && typeof base === "object" && !(base instanceof Headers)) {
      Object.assign(h, base as Record<string, string>);
    }
    return h;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: this.headers(options?.headers),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Network error occurred",
      }));
      throw new Error(
        (error as { message?: string }).message || `HTTP ${response.status}`
      );
    }

    return response.json();
  }

  async createAudit(data: CreateAuditRequest): Promise<AuditResult> {
    const response = await this.request<AuditResult>("/audits", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async getAuditByShareId(shareId: string): Promise<
    AuditResult & {
      teamSize: number;
      primaryUseCase: string;
      createdAt: string;
      benchmark?: AuditBenchmark;
    }
  > {
    const response = await this.request<
      AuditResult & {
        teamSize: number;
        primaryUseCase: string;
        createdAt: string;
        benchmark?: AuditBenchmark;
      }
    >(`/audits/share/${encodeURIComponent(shareId)}`);
    return response.data;
  }

  async requestAiSummary(shareId: string): Promise<{ aiSummary: string }> {
    const response = await this.request<{ aiSummary: string }>(
      `/audits/share/${encodeURIComponent(shareId)}/ai-summary`,
      { method: "POST" }
    );
    return response.data;
  }

  async createLead(data: CreateLeadRequest) {
    const response = await this.request("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async healthCheck() {
    const response = await this.request("/health");
    return response.data;
  }
}

export const apiClient = new ApiClient();
