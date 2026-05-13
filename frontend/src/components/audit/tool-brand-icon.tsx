import type { SVGProps } from "react";
import {
  SiAnthropic,
  SiClaude,
  SiGithubcopilot,
  SiGooglegemini,
  SiOpenai,
} from "react-icons/si";
import { CodeXml, Wind } from "lucide-react";

import { cn } from "@/lib/utils";

/** Cursor brand mark (Simple Icons, CC0). */
const CURSOR_SVG_PATH =
  "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function CursorBrandIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-hidden {...props}>
      <path fill="currentColor" d={CURSOR_SVG_PATH} />
    </svg>
  );
}

const FALLBACK = CodeXml;

/**
 * Brand marks for audit tools (SVG via Simple Icons / react-icons). Falls back to Lucide for unknown IDs.
 */
export function ToolBrandIcon({
  toolId,
  className,
  ...rest
}: IconProps & { toolId: string }) {
  const cls = cn("shrink-0", className);

  switch (toolId) {
    case "cursor":
      return <CursorBrandIcon className={cls} {...rest} />;
    case "github_copilot":
      return <SiGithubcopilot className={cls} {...rest} />;
    case "claude":
      return <SiClaude className={cls} {...rest} />;
    case "chatgpt":
      return <SiOpenai className={cls} {...rest} />;
    case "anthropic_api":
      return <SiAnthropic className={cls} {...rest} />;
    case "openai_api":
      return <SiOpenai className={cls} {...rest} />;
    case "gemini":
      return <SiGooglegemini className={cls} {...rest} />;
    case "windsurf":
      return <Wind className={cls} strokeWidth={1.75} {...rest} />;
    default:
      return <FALLBACK className={cls} strokeWidth={1.75} {...rest} />;
  }
}
