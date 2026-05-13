import { SiAnthropic, SiGithubcopilot, SiOpenai } from "react-icons/si";
import { cn } from "@/lib/utils";

const CDN = (slug: string, hex: string) =>
  `https://cdn.simpleicons.org/${slug}/${hex.replace("#", "")}`;

const TOOL_LABEL: Record<string, string> = {
  cursor: "Cursor",
  chatgpt: "OpenAI ChatGPT",
  claude: "Anthropic Claude",
  github_copilot: "GitHub Copilot",
  gemini: "Google Gemini",
};

export function toolDisplayName(tool: string): string {
  const key = tool.toLowerCase().replace(/\s+/g, "_");
  return (
    TOOL_LABEL[key] ??
    String(tool)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

interface ToolVendorLogoProps {
  tool: string;
  className?: string;
}

/**
 * Brand marks for scanability (Simple Icons / official CDN where needed).
 */
export function ToolVendorLogo({ tool, className }: ToolVendorLogoProps) {
  const t = tool.toLowerCase().replace(/\s+/g, "_");
  const box = cn("size-10 shrink-0 rounded-lg border border-border/60 bg-card p-1.5 shadow-sm", className);

  if (t === "chatgpt") {
    return (
      <div className={box} title={TOOL_LABEL.chatgpt}>
        <SiOpenai className="size-full text-foreground" aria-hidden />
      </div>
    );
  }
  if (t === "claude") {
    return (
      <div className={box} title={TOOL_LABEL.claude}>
        <SiAnthropic className="size-full text-[#D97757]" aria-hidden />
      </div>
    );
  }
  if (t === "github_copilot") {
    return (
      <div className={box} title={TOOL_LABEL.github_copilot}>
        <SiGithubcopilot className="size-full text-foreground" aria-hidden />
      </div>
    );
  }
  if (t === "cursor") {
    return (
      <div className={box} title={TOOL_LABEL.cursor}>
        <img
          src={CDN("cursor", "EE7F3F")}
          alt=""
          className="size-full object-contain"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  if (t === "gemini") {
    return (
      <div className={box} title={TOOL_LABEL.gemini}>
        <img
          src={CDN("googlegemini", "4285F4")}
          alt=""
          className="size-full object-contain"
          width={32}
          height={32}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  const label = toolDisplayName(tool);
  return (
    <div
      className={cn(box, "flex items-center justify-center font-bold text-muted-foreground text-xs")}
      title={label}
      aria-hidden
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  );
}
