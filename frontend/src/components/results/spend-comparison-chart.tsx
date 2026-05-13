import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "../../lib/utils";

interface SpendComparisonChartProps {
  currentSpend: number;
  optimizedSpend: number;
}

export function SpendComparisonChart({ currentSpend, optimizedSpend }: SpendComparisonChartProps) {
  const data = [
    {
      name: "Current",
      value: currentSpend,
      color: "hsl(var(--destructive))",
    },
    {
      name: "Optimized",
      value: optimizedSpend,
      color: "hsl(var(--primary))",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="border-border/80 shadow-md">
          <CardHeader className="space-y-1 p-3 pb-1">
            <CardTitle className="font-medium text-sm">{label} spend</CardTitle>
            <CardDescription>
              {formatCurrency(payload[0].value)} / month
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/80 bg-card/90 py-2 shadow-sm">
      <CardHeader className="space-y-1 px-6 pt-8">
        <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
          <Badge variant="outline" className="font-normal">
            Compare
          </Badge>
          Before vs after
        </CardTitle>
        <CardDescription className="text-base">
          Visual delta on total modeled monthly spend.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-8 pt-2 sm:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}