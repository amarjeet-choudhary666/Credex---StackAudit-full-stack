import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export interface BenchmarkStripProps {
  teamSize: number;
  userSpendPerDeveloper: number;
  averageSpendPerDeveloper: number;
  percentile: number;
  teamSizeCategory: string;
  overspendingVsCohortPercent: number;
}

export function BenchmarkStrip(props: BenchmarkStripProps) {
  const above =
    props.overspendingVsCohortPercent > 0
      ? `About ${props.overspendingVsCohortPercent}% above similar teams.`
      : "At or below the modeled cohort average.";

  return (
    <Card className="border-primary/15 bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
          Benchmark (modeled)
        </CardTitle>
        <CardDescription>
          Anonymous cohort curve for {props.teamSizeCategory} teams (~{props.teamSize}{" "}
          seats) — not a live billing pull.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Your AI spend / developer
          </p>
          <p className="font-semibold text-2xl tabular-nums">
            {formatCurrency(props.userSpendPerDeveloper)}
            <span className="text-muted-foreground text-sm font-normal">/mo</span>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Modeled peer average
          </p>
          <p className="font-semibold text-2xl tabular-nums text-muted-foreground">
            {formatCurrency(props.averageSpendPerDeveloper)}
            <span className="text-muted-foreground text-sm font-normal">/mo</span>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Percentile vs cohort
          </p>
          <p className="font-semibold text-2xl tabular-nums">{props.percentile}th</p>
          <p className="text-muted-foreground text-sm">{above}</p>
        </div>
      </CardContent>
    </Card>
  );
}
