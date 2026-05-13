import { motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolBrandIcon } from "@/components/audit/tool-brand-icon";
import { SUPPORTED_TOOLS, isApiTool } from "../../lib/constants";
import type { ToolSelection } from "@/store/audit-store";
import { formatCurrency } from "../../lib/utils";

interface ToolConfigurationProps {
  tools: ToolSelection[];
  onUpdateTool: (index: number, updates: Partial<ToolSelection>) => void;
  onRemoveTool: (index: number) => void;
}

export function ToolConfiguration({ tools, onUpdateTool, onRemoveTool }: ToolConfigurationProps) {
  const totalSpend = tools.reduce((sum, tool) => sum + tool.monthlySpend, 0);

  const calculateSpend = (toolId: string, planName: string, seats: number): number => {
    if (isApiTool(toolId)) return 0;
    const tool = SUPPORTED_TOOLS[toolId as keyof typeof SUPPORTED_TOOLS];
    const plan = tool.plans.find((p) => p.name === planName);
    return (plan?.pricePerSeat || 0) * seats;
  };

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <header className="max-w-2xl space-y-3">
          <p className="text-primary font-semibold text-xs uppercase tracking-wider">
            Step 3 · Plans & usage
          </p>
          <h2 className="text-balance text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            Configure billing
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
            Seat-based tools use plan × seats. API tools use your <span className="font-medium text-foreground/90">monthly invoice / burn estimate</span> and a usage profile — no seat step.
          </p>
        </header>
        <div className="flex shrink-0 flex-col gap-1 rounded-2xl border border-border/80 bg-card px-5 py-4 text-center shadow-sm lg:text-right">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Estimated monthly spend
          </span>
          <span className="font-semibold text-3xl text-foreground tabular-nums tracking-tight">
            {formatCurrency(totalSpend)}
          </span>
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        {tools.map((tool, index) => {
          const toolConfig = SUPPORTED_TOOLS[tool.tool as keyof typeof SUPPORTED_TOOLS];
          const api = isApiTool(tool.tool);

          return (
            <motion.div
              key={`${tool.tool}-${index}`}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="overflow-hidden border-border/80 shadow-sm">
                <CardHeader className="space-y-4 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/50 sm:size-14">
                        <ToolBrandIcon
                          toolId={tool.tool}
                          className="size-7 text-foreground sm:size-9"
                          aria-hidden
                        />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg font-semibold sm:text-xl">
                          {toolConfig.displayName}
                        </CardTitle>
                        <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                          {toolConfig.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-10 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onRemoveTool(index)}
                      aria-label={`Remove ${toolConfig.displayName}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-6">
                  {api ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`usage-${index}`}>Usage / commit profile</Label>
                        <Select
                          value={tool.plan}
                          onValueChange={(value) => {
                            onUpdateTool(index, { plan: value, seats: 1 });
                          }}
                        >
                          <SelectTrigger id={`usage-${index}`} className="min-h-11 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {toolConfig.plans.map((plan) => (
                              <SelectItem key={plan.name} value={plan.name}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`api-spend-${index}`}>Monthly API spend (USD)</Label>
                        <Input
                          id={`api-spend-${index}`}
                          type="number"
                          inputMode="decimal"
                          min={0}
                          step={25}
                          className="min-h-11 font-medium tabular-nums"
                          value={Number.isFinite(tool.monthlySpend) ? tool.monthlySpend : 0}
                          onChange={(e) => {
                            const raw = parseFloat(e.target.value);
                            const v = Number.isFinite(raw) ? Math.max(0, raw) : 0;
                            onUpdateTool(index, { monthlySpend: v, seats: 1 });
                          }}
                        />
                        <p className="text-muted-foreground text-xs leading-relaxed">
                          Approximate monthly from invoices or cloud console — we do not pull live
                          usage.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`plan-${index}`}>Plan</Label>
                        <Select
                          value={tool.plan}
                          onValueChange={(value) => {
                            const newSpend = calculateSpend(tool.tool, value, tool.seats);
                            onUpdateTool(index, { plan: value, monthlySpend: newSpend });
                          }}
                        >
                          <SelectTrigger id={`plan-${index}`} className="min-h-11 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {toolConfig.plans.map((plan) => (
                              <SelectItem key={plan.name} value={plan.name}>
                                <div className="flex w-full items-center justify-between gap-3">
                                  <span>{plan.name}</span>
                                  {plan.pricePerSeat > 0 && (
                                    <span className="text-muted-foreground text-xs tabular-nums">
                                      {formatCurrency(plan.pricePerSeat)}/seat
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`seats-${index}`}>Seats</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-11 shrink-0"
                            onClick={() => {
                              const newSeats = Math.max(1, tool.seats - 1);
                              const newSpend = calculateSpend(tool.tool, tool.plan, newSeats);
                              onUpdateTool(index, { seats: newSeats, monthlySpend: newSpend });
                            }}
                          >
                            <Minus className="size-4" />
                          </Button>
                          <Input
                            id={`seats-${index}`}
                            type="number"
                            min={1}
                            className="min-h-11 text-center font-medium tabular-nums"
                            value={tool.seats}
                            onChange={(e) => {
                              const newSeats = Math.max(1, parseInt(e.target.value, 10) || 1);
                              const newSpend = calculateSpend(tool.tool, tool.plan, newSeats);
                              onUpdateTool(index, { seats: newSeats, monthlySpend: newSpend });
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-11 shrink-0"
                            onClick={() => {
                              const newSeats = tool.seats + 1;
                              const newSpend = calculateSpend(tool.tool, tool.plan, newSeats);
                              onUpdateTool(index, { seats: newSeats, monthlySpend: newSpend });
                            }}
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Monthly cost (modeled)</Label>
                        <div className="flex min-h-11 items-center rounded-lg border border-border/80 bg-muted/30 px-3">
                          <span className="font-semibold text-lg text-foreground tabular-nums">
                            {formatCurrency(tool.monthlySpend)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-border/60 border-t pt-4">
                    <div className="mb-2 text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      {api ? "Profile notes" : "Included with this plan"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {toolConfig.plans
                        .find((p) => p.name === tool.plan)
                        ?.features.map((feature, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="font-normal text-muted-foreground"
                          >
                            {feature}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
