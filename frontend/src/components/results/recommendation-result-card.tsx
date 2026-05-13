import { Info, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Recommendation } from "@/lib/api";
import { ToolVendorLogo, toolDisplayName } from "./tool-vendor-logo";

interface RecommendationResultCardProps {
  rec: Recommendation;
}

export function RecommendationResultCard({ rec }: RecommendationResultCardProps) {
  const annual = rec.annualSavings ?? Math.round(rec.monthlySavings * 12);

  return (
    <Card className="overflow-hidden border-border/80 bg-card/90 shadow-sm">
      <CardHeader className="space-y-4 border-b border-border/60 bg-muted/20 pb-6 pt-6">
        <div className="flex flex-wrap items-start gap-4">
          <ToolVendorLogo tool={rec.tool} className="size-12 rounded-xl p-2" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-xl tracking-tight sm:text-2xl">
                {toolDisplayName(rec.tool)}
              </CardTitle>
              <Badge className="shrink-0 font-semibold text-base tabular-nums">
                Save {formatCurrency(rec.monthlySavings)}/mo
              </Badge>
            </div>
            <CardDescription className="mt-1 text-foreground/85 text-base leading-relaxed">
              {rec.recommendedAction}
            </CardDescription>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-border/70 bg-background/80 p-4 font-mono text-sm sm:grid-cols-3 sm:text-base">
          <div>
            <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Current</p>
            <p className="font-semibold text-destructive tabular-nums text-lg sm:text-xl">
              {formatCurrency(rec.currentMonthlySpend)}
              <span className="font-normal text-muted-foreground text-sm">/mo</span>
            </p>
            <p className="mt-0.5 text-muted-foreground text-xs tabular-nums">
              {formatCurrency(rec.currentMonthlySpend * 12)}/yr run rate
            </p>
          </div>
          <div>
            <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Optimized</p>
            <p className="font-semibold text-primary tabular-nums text-lg sm:text-xl">
              {formatCurrency(rec.recommendedMonthlySpend)}
              <span className="font-normal text-muted-foreground text-sm">/mo</span>
            </p>
            <p className="mt-0.5 text-muted-foreground text-xs tabular-nums">
              {formatCurrency(rec.recommendedMonthlySpend * 12)}/yr run rate
            </p>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3 sm:border-0 sm:bg-transparent sm:p-0">
            <p className="mb-1 flex items-center gap-1.5 font-sans text-emerald-600 text-xs uppercase tracking-wider dark:text-emerald-400">
              <TrendingDown className="size-3.5" aria-hidden />
              Savings
            </p>
            <p className="font-bold font-sans text-emerald-600 tabular-nums text-xl sm:text-2xl dark:text-emerald-400">
              {formatCurrency(rec.monthlySavings)}
              <span className="font-semibold text-sm">/mo</span>
            </p>
            <p className="mt-0.5 font-sans font-semibold text-emerald-700/90 text-sm tabular-nums dark:text-emerald-300/90">
              {formatCurrency(annual)}/yr saved
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <div className="rounded-xl border border-border/80 bg-muted/20 p-5">
            <p className="mb-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide">
              Current plan
            </p>
            <p className="font-semibold text-lg leading-snug">{rec.currentPlan}</p>
            <p className="mt-2 text-muted-foreground text-sm">
              {rec.seats} seats · {formatCurrency(rec.currentMonthlySpend)}/mo modeled
            </p>
          </div>
          <div className="rounded-xl border-2 border-primary/40 bg-primary/10 p-5 shadow-[inset_0_1px_0_0_hsl(var(--primary)/0.15)]">
            <p className="mb-1 font-bold text-primary text-xs uppercase tracking-[0.2em]">
              Recommended plan
            </p>
            <p className="font-bold text-foreground text-xl leading-snug tracking-tight">
              {rec.recommendedPlanOrTool}
            </p>
            <p className="mt-2 text-primary/90 text-sm">
              Target run rate {formatCurrency(rec.recommendedMonthlySpend)}/mo after changes.
            </p>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 dark:bg-sky-500/10">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-400">
            <Info className="size-5" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="mb-2 font-semibold text-foreground text-sm">Why this recommendation?</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{rec.reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
