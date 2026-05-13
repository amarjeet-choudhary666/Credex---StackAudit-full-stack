import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ExternalLink, Share2, TrendingDown } from "lucide-react";
import { PageLoading } from "@/components/page-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpendComparisonChart } from "../components/results/spend-comparison-chart";
import { apiClient, type AuditResult } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

type PublicAuditData = AuditResult & {
  teamSize: number;
  primaryUseCase: string;
  createdAt: string;
  aiSummary?: string | null;
};

export function PublicReportPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [auditData, setAuditData] = useState<PublicAuditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (shareId) {
      fetchPublicAudit(shareId);
    }
  }, [shareId]);

  const fetchPublicAudit = async (id: string) => {
    try {
      const data = await apiClient.getAuditByShareId(id);
      setAuditData(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Report unavailable",
        description: "This link may be invalid or expired.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied",
        description: "Report link is on your clipboard.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Could not copy to clipboard.",
      });
    }
  };

  const handleStartAudit = () => {
    window.open("/audit", "_blank");
  };

  const handleDownloadPdf = async () => {
    if (!auditData) return;
    try {
      const { downloadAuditPdf } = await import("@/lib/generate-audit-pdf");
      downloadAuditPdf(auditData, {
        currentMonthlySpend:
          auditData.recommendations?.reduce(
            (sum, rec) => sum + rec.currentMonthlySpend,
            0
          ) ?? 0,
        optimizedMonthlySpend:
          auditData.recommendations?.reduce(
            (sum, rec) => sum + rec.recommendedMonthlySpend,
            0
          ) ?? 0,
        isPublic: true,
        teamSize: auditData.teamSize,
        primaryUseCase: auditData.primaryUseCase,
        generatedAt: new Date(auditData.createdAt),
      });
      toast({
        title: "PDF downloaded",
        description: "The public report was saved to your device.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "PDF failed",
        description: "Could not generate the PDF. Try again.",
      });
    }
  };

  if (isLoading) {
    return <PageLoading message="Loading public audit report…" />;
  }

  if (!auditData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Report not found</CardTitle>
            <CardDescription>
              This audit report could not be found or may have expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleStartAudit}>
              Create your own audit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSpend = auditData.recommendations?.reduce(
    (sum, rec) => sum + rec.currentMonthlySpend,
    0
  ) || 0;

  const optimizedSpend = auditData.recommendations?.reduce(
    (sum, rec) => sum + rec.recommendedMonthlySpend,
    0
  ) || 0;

  const savingsPercentage = currentSpend > 0 ? Math.round((auditData.monthlySavings / currentSpend) * 100) : 0;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur-sm border-border/50 border-b">
        <div className="mx-auto px-4 py-6 container">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="font-bold text-3xl">AI Spend Audit Report</h1>
              <p className="text-muted-foreground">
                Public report • Generated {new Date(auditData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" onClick={handleDownloadPdf}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button onClick={handleStartAudit}>
                Create Your Audit
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-4 py-12 container">
        <div className="space-y-12 mx-auto max-w-4xl">
          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="relative bg-gradient-to-br from-primary/10 via-background to-background border-primary/20 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
              
              <CardContent className="relative p-8 md:p-12">
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="mb-6 gap-2 border border-primary/30 bg-primary/10 px-4 py-2 font-medium text-primary text-sm hover:bg-primary/15"
                  >
                    <TrendingDown className="h-4 w-4" />
                    This stack shows ~{savingsPercentage}% monthly savings vs. baseline
                  </Badge>

                  <div className="mb-6">
                    <div className="bg-clip-text bg-gradient-to-r from-primary to-primary/60 mb-2 font-bold text-transparent text-6xl md:text-7xl">
                      {formatCurrency(auditData.annualSavings)}
                    </div>
                    <div className="text-muted-foreground text-xl">
                      Annual savings potential
                    </div>
                  </div>

                  <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mx-auto max-w-2xl">
                    <div className="text-center">
                      <div className="font-bold text-destructive text-2xl">
                        {formatCurrency(currentSpend)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Current monthly spend
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary text-2xl">
                        {formatCurrency(optimizedSpend)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Optimized spend
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary text-2xl">
                        {auditData.efficiencyScore}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Efficiency score
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Team Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="gap-6 grid grid-cols-2">
                  <div>
                    <div className="text-muted-foreground text-sm">Team Size</div>
                    <div className="font-bold text-2xl">{auditData.teamSize} people</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-sm">Primary Use Case</div>
                    <div className="font-bold text-2xl capitalize">
                      {auditData.primaryUseCase.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spend Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SpendComparisonChart
              currentSpend={currentSpend}
              optimizedSpend={optimizedSpend}
            />
          </motion.div>

          {/* Key Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Top Optimization Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditData.recommendations
                    ?.filter(rec => rec.monthlySavings > 0)
                    .sort((a, b) => b.monthlySavings - a.monthlySavings)
                    .slice(0, 3)
                    .map((rec, index) => (
                      <Card key={index}>
                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 font-medium capitalize">
                              {rec.tool.replace("_", " ")}
                              <Badge variant="outline" className="font-normal">
                                {formatCurrency(rec.monthlySavings)}/mo
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {rec.recommendedAction}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(rec.monthlySavings)}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              per month
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8">
                <h3 className="mb-4 font-bold text-2xl">
                  Want to optimize your AI spend too?
                </h3>
                <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
                  Get your personalized AI spend audit in under 60 seconds. 
                  See exactly where you're overspending and how to fix it.
                </p>
                <Button size="lg" variant="gradient" onClick={handleStartAudit}>
                  Start Your Free Audit
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}