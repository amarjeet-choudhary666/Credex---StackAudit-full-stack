import { motion } from "framer-motion";
import { Check, Lightbulb, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToolBrandIcon } from "@/components/audit/tool-brand-icon";
import {
  SUPPORTED_TOOLS,
  TOOL_AUDIT_GROUPS,
  startingPriceLabel,
} from "../../lib/constants";
import { cn } from "../../lib/utils";

interface ToolSelectorProps {
  selectedTools: string[];
  onToggleTool: (toolId: string) => void;
}

export function ToolSelector({ selectedTools, onToggleTool }: ToolSelectorProps) {
  return (
    <div className="space-y-10 md:space-y-12">
      <header className="space-y-4">
        <p className="text-primary font-semibold text-xs uppercase tracking-wider">
          Step 2 · Tool catalog
        </p>
        <div className="max-w-3xl space-y-3">
          <h2 className="text-balance text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            Select your AI stack
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Toggle only vendors your company <span className="font-medium text-foreground/90">actively pays monthly</span>{" "}
            today. You will configure plans or API spend next — nothing leaves this browser until you run the audit.
          </p>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/25 px-4 py-3 md:flex md:items-start md:gap-3 md:px-5 md:py-4">
          <Lightbulb
            className="mx-auto mb-2 size-5 shrink-0 text-amber-600/90 md:mx-0 md:mb-0 dark:text-amber-400/90"
            aria-hidden
          />
          <p className="text-center text-muted-foreground text-sm leading-relaxed md:text-left">
            <span className="font-medium text-foreground">Smart selection:</span> most engineering
            teams standardize on <span className="tabular-nums">2–4</span> core AI surfaces. If you
            are unsure, start with billing owners (IDE + default chat + primary API).
          </p>
        </div>
      </header>

      <div className="space-y-12 md:space-y-14">
        {TOOL_AUDIT_GROUPS.map((group) => (
          <section key={group.id} className="space-y-5">
            <div className="border-border/60 border-b pb-2">
              <h3 className="font-semibold text-foreground text-lg tracking-tight md:text-xl">
                {group.title}
              </h3>
              <p className="text-muted-foreground text-sm">{group.subtitle}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.toolIds.map((toolId, index) => {
                const tool = SUPPORTED_TOOLS[toolId];
                const isSelected = selectedTools.includes(toolId);
                const hint = startingPriceLabel(tool);

                return (
                  <motion.div
                    key={toolId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                  >
                    <Card
                      className={cn(
                        "group relative h-full cursor-pointer overflow-hidden border-border/80 transition-all duration-200",
                        "hover:border-primary/30 hover:shadow-md",
                        isSelected &&
                          "border-primary/45 shadow-md ring-2 ring-primary/20",
                      )}
                      onClick={() => onToggleTool(toolId)}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-primary shadow-sm sm:size-9"
                        >
                          <Check className="size-4 text-primary-foreground" strokeWidth={2.5} />
                        </motion.div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/40 sm:size-14">
                          <ToolBrandIcon
                            toolId={toolId}
                            className="size-7 text-foreground sm:size-8"
                            aria-hidden
                          />
                        </div>
                        <CardTitle className="text-lg font-semibold">{tool.displayName}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0">
                        <p className="text-muted-foreground text-xs leading-snug">{hint}</p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-muted-foreground text-xs">
                            {tool.plans.length} option{tool.plans.length > 1 ? "s" : ""}
                          </span>
                          <Badge variant="outline" className="font-normal capitalize">
                            {group.id === "coding"
                              ? "Coding"
                              : group.id === "chat"
                                ? "Chat"
                                : "API"}
                          </Badge>
                        </div>

                        {!isSelected && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="w-full border border-transparent group-hover:border-primary/20"
                          >
                            <Plus className="mr-2 size-4" />
                            Add to stack
                          </Button>
                        )}
                      </CardContent>

                      {isSelected && (
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/6 to-transparent" />
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {selectedTools.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-center sm:px-5"
        >
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground tabular-nums">
              {selectedTools.length}
            </span>{" "}
            vendor{selectedTools.length !== 1 ? "s" : ""} selected — continue to plans & usage.
          </p>
        </motion.div>
      )}
    </div>
  );
}
