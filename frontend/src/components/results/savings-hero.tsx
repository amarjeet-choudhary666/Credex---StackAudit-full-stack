import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { formatCurrency } from "../../lib/utils";

export type SavingsImpactLevel = "high" | "moderate" | "optimized";

interface SavingsHeroProps {
  monthlySavings: number;
  annualSavings: number;
  efficiencyScore: number;
  currentSpend: number;
  optimizedSpend: number;
  impactLevel: SavingsImpactLevel;
}

const IMPACT_COPY: Record<
  SavingsImpactLevel,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  high: { label: "High waste", variant: "default" },
  moderate: { label: "Moderate waste", variant: "secondary" },
  optimized: { label: "Optimized", variant: "outline" },
};

/** Screenshot-first hero: centered type, calm contrast (fintech, not gaming). */
export function SavingsHero({
  monthlySavings,
  annualSavings,
  efficiencyScore,
  currentSpend,
  optimizedSpend,
  impactLevel,
}: SavingsHeroProps) {
  const savingsPercentage =
    currentSpend > 0 ? Math.round((monthlySavings / currentSpend) * 100) : 0;
  const impact = IMPACT_COPY[impactLevel];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-muted/20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border" />

      <CardContent className="relative space-y-10 px-5 py-12 text-center sm:space-y-12 sm:px-8 sm:py-16 md:space-y-14 md:px-12 md:py-20 lg:py-24">
        <div className="flex flex-col items-center justify-center gap-4">
          <Badge variant={impact.variant} className="px-3 py-1.5 font-semibold text-sm">
            {impact.label}
          </Badge>
          <p className="max-w-xl text-muted-foreground text-sm leading-relaxed sm:text-base">
            <ShieldCheck className="mb-1 inline size-4 text-foreground/70" aria-hidden />
            Based on <span className="font-medium text-foreground/90">verified public pricing</span>
            . Finance-style recommendation engine — not a generic chat wrapper.
          </p>
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.22em]">
            Shareable snapshot · Updated May 2026
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <motion.p
            id="potential-savings-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-semibold text-muted-foreground text-xs uppercase tracking-[0.35em] sm:text-sm"
          >
            Potential savings
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="font-black leading-[0.92] tracking-tight text-foreground tabular-nums text-7xl sm:text-8xl md:text-9xl lg:text-[7.5rem] xl:text-[8.25rem]"
            aria-labelledby="potential-savings-label"
          >
            {formatCurrency(monthlySavings)}
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06 }}
            className="mt-3 font-semibold text-foreground/80 text-2xl tracking-tight sm:text-3xl md:text-4xl"
          >
            per month
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-black tracking-tight text-foreground tabular-nums text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {formatCurrency(annualSavings)}
            <span className="mt-2 block font-semibold text-muted-foreground text-xl sm:inline sm:mt-0 sm:ml-3 sm:text-2xl md:text-3xl">
              / year
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-8 max-w-xl text-muted-foreground text-base leading-relaxed sm:text-lg"
          >
            Versus your modeled stack today, about a{" "}
            <span className="font-semibold text-foreground">{savingsPercentage}%</span> lower run
            rate — this block is the Product Hunt / board-deck screenshot.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mx-auto max-w-3xl rounded-2xl border border-border/90 bg-muted/25 p-6 sm:p-8"
        >
          <p className="mb-5 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
            Stack-level delta
          </p>
          <div className="grid gap-4 font-mono text-sm sm:grid-cols-3 sm:gap-5 sm:text-base">
            <div className="rounded-xl border border-border/80 bg-background/80 px-4 py-4 sm:py-5">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Current</p>
              <p className="mt-2 font-bold text-foreground tabular-nums text-xl sm:text-2xl">
                {formatCurrency(currentSpend)}
                <span className="font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <div className="rounded-xl border border-border/80 bg-background/80 px-4 py-4 sm:py-5">
              <p className="text-muted-foreground text-xs uppercase tracking-wide">Optimized</p>
              <p className="mt-2 font-bold text-foreground tabular-nums text-xl sm:text-2xl">
                {formatCurrency(optimizedSpend)}
                <span className="font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-4 sm:py-5">
              <p className="text-emerald-800 text-xs uppercase tracking-wide dark:text-emerald-400">
                Savings
              </p>
              <p className="mt-2 font-bold text-emerald-700 tabular-nums text-xl sm:text-2xl dark:text-emerald-400">
                {formatCurrency(monthlySavings)}
                <span className="font-normal text-muted-foreground">/mo</span>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-2 border-t border-border/60 pt-8 sm:flex-row sm:gap-3 sm:pt-10">
          <Sparkles className="size-5 text-muted-foreground" aria-hidden />
          <span className="text-muted-foreground text-sm">Efficiency score</span>
          <span className="font-bold text-foreground text-3xl tabular-nums sm:text-4xl">
            {efficiencyScore}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>
      </CardContent>
    </div>
  );
}
