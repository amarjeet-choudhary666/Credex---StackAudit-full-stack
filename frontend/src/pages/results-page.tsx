import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, Download, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { PageLoading } from "@/components/page-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SavingsHero, type SavingsImpactLevel } from "../components/results/savings-hero";
import { SpendComparisonChart } from "../components/results/spend-comparison-chart";
import { BenchmarkStrip } from "../components/results/benchmark-strip";
import { RecommendationResultCard } from "../components/results/recommendation-result-card";
import { useAuditStore } from "../store/audit-store";
import { apiClient, type AuditResult, type Recommendation } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

function scrollToCredexLead() {
  document.getElementById("credex-lead")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function savingsImpactLevel(monthlySavings: number): SavingsImpactLevel {
  if (monthlySavings >= 500) return "high";
  if (monthlySavings < 100) return "optimized";
  return "moderate";
}

export function ResultsPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { auditResult, setAuditResult, teamSize, primaryUseCase } = useAuditStore();
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!shareId) {
        setLoading(false);
        return;
      }
      if (
        auditResult &&
        auditResult.shareId === shareId &&
        auditResult.recommendations?.length
      ) {
        setLoading(false);
      } else {
        try {
          const data = await apiClient.getAuditByShareId(shareId);
          if (cancelled) return;
          const merged: AuditResult = {
            auditId: data.auditId,
            shareId: data.shareId,
            monthlySavings: data.monthlySavings,
            annualSavings: data.annualSavings,
            efficiencyScore: data.efficiencyScore,
            recommendations: data.recommendations,
            summary: data.summary,
            aiSummary: data.aiSummary ?? null,
            teamSize: data.teamSize,
            primaryUseCase: data.primaryUseCase,
            createdAt: data.createdAt,
            benchmark: data.benchmark,
          };
          setAuditResult(merged);
        } catch {
          if (!cancelled) {
            toast({
              variant: "destructive",
              title: "Could not load audit",
              description: "Check the link or start a new audit.",
            });
            navigate("/");
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [shareId, auditResult, setAuditResult, navigate]);

  useEffect(() => {
    if (!shareId || loading) return;
    const sid = shareId;
    let cancelled = false;
    async function runAi() {
      setAiLoading(true);
      try {
        const { aiSummary: text } = await apiClient.requestAiSummary(sid);
        if (!cancelled) setAiSummary(text);
      } catch {
        if (!cancelled) {
          const m = auditResult?.monthlySavings ?? 0;
          setAiSummary(
            `You could save approximately $${Math.round(m)}/month by optimizing your AI stack.`
          );
        }
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    }
    void runAi();
    return () => {
      cancelled = true;
    };
  }, [shareId, loading, auditResult?.monthlySavings]);

  const handleShare = async () => {
    if (!shareId) return;
    const url = `${window.location.origin}/audit/${shareId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied", description: "Share URL is on your clipboard." });
    } catch {
      toast({ variant: "destructive", title: "Copy failed" });
    }
  };

  const handleDownload = async () => {
    if (!auditResult) return;
    try {
      const { downloadAuditPdf } = await import("@/lib/generate-audit-pdf");
      const auditForPdf: AuditResult = {
        ...auditResult,
        aiSummary: aiSummary ?? auditResult.aiSummary ?? null,
      };
      downloadAuditPdf(auditForPdf, {
        currentMonthlySpend:
          auditResult.recommendations?.reduce(
            (sum: number, rec: Recommendation) => sum + rec.currentMonthlySpend,
            0
          ) ?? 0,
        optimizedMonthlySpend:
          auditResult.recommendations?.reduce(
            (sum: number, rec: Recommendation) =>
              sum + rec.recommendedMonthlySpend,
            0
          ) ?? 0,
        isPublic: false,
        teamSize: auditResult.teamSize ?? teamSize,
        primaryUseCase: (auditResult.primaryUseCase ?? primaryUseCase) || undefined,
        generatedAt: new Date(),
      });
      toast({ title: "PDF downloaded" });
    } catch {
      toast({ variant: "destructive", title: "PDF failed" });
    }
  };

  if (loading) {
    return <PageLoading message="Loading your audit results…" />;
  }

  if (!auditResult || !shareId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Audit not found</CardTitle>
            <CardDescription>Start a new audit from the home page.</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentSpend =
    auditResult.recommendations?.reduce(
      (sum: number, rec: Recommendation) => sum + rec.currentMonthlySpend,
      0
    ) || 0;
  const optimizedSpend =
    auditResult.recommendations?.reduce(
      (sum: number, rec: Recommendation) => sum + rec.recommendedMonthlySpend,
      0
    ) || 0;

  const highSavings = auditResult.monthlySavings >= 500;
  const lowSavings = auditResult.monthlySavings < 100;
  const midSavings = !highSavings && !lowSavings;
  const savingsBand = highSavings ? "high" : lowSavings ? "low" : "mid";
  const impactLevel = savingsImpactLevel(auditResult.monthlySavings);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50 border-b border-border/70 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:py-5">
          <div className="flex min-w-0 items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="shrink-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                Shareable audit
              </h1>
              <p className="truncate text-muted-foreground text-xs sm:text-sm">
                Built for screenshots — modeled savings, not a billing dashboard
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={handleShare} className="md:size-default">
              <Share2 className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="md:size-default">
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl space-y-16 px-4 py-14 md:space-y-24 md:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <SavingsHero
            monthlySavings={auditResult.monthlySavings}
            annualSavings={auditResult.annualSavings}
            efficiencyScore={auditResult.efficiencyScore}
            currentSpend={currentSpend}
            optimizedSpend={optimizedSpend}
            impactLevel={impactLevel}
          />
        </motion.div>

        <Card className="border-border/80 bg-muted/20 py-2 shadow-sm">
          <CardContent className="flex flex-col gap-3 px-5 py-5 text-center sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-6 sm:gap-y-2 sm:px-6 sm:text-left">
            <Badge variant="outline" className="mx-auto font-normal sm:mx-0">
              Verified public pricing
            </Badge>
            <span className="text-muted-foreground text-sm leading-relaxed sm:max-w-none">
              <span className="font-medium text-foreground/90">Finance-style engine</span> — every
              dollar ties to published vendor tiers. List prices move; treat outputs as directional,
              not a quote.
            </span>
            <span className="w-full font-medium text-muted-foreground text-xs uppercase tracking-wider sm:w-auto sm:text-right">
              Data cut · May 2026
            </span>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
        >
          <Card className="overflow-hidden border-primary/25 bg-linear-to-b from-primary/8 via-card to-card py-2 shadow-md">
            <CardHeader className="space-y-2 px-6 pb-2 pt-8 sm:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <Sparkles className="size-5 text-primary" aria-hidden />
                <CardTitle className="text-2xl tracking-tight">Executive read</CardTitle>
                <Badge variant="secondary" className="font-normal">
                  AI narrative
                </Badge>
              </div>
              <CardDescription className="text-base">
                Short story on top of the math — share this paragraph when you forward the link.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-2 sm:px-8">
              <p className="whitespace-pre-wrap text-foreground/95 text-base leading-relaxed sm:text-lg">
                {aiLoading
                  ? "Generating a tight founder summary…"
                  : (aiSummary ??
                    auditResult.aiSummary ??
                    `You could save approximately $${Math.round(auditResult.monthlySavings)}/month by optimizing your AI stack.`)}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {auditResult.benchmark ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
          >
            <BenchmarkStrip
              teamSize={auditResult.teamSize ?? teamSize}
              userSpendPerDeveloper={auditResult.benchmark.userSpendPerDeveloper}
              averageSpendPerDeveloper={auditResult.benchmark.averageSpendPerDeveloper}
              percentile={auditResult.benchmark.percentile}
              teamSizeCategory={auditResult.benchmark.teamSizeCategory}
              overspendingVsCohortPercent={auditResult.benchmark.overspendingVsCohortPercent}
            />
          </motion.div>
        ) : null}

        <section className="space-y-6">
          <div className="space-y-2 px-1">
            <h2 className="font-bold text-2xl tracking-tight md:text-3xl">Per-tool breakdown</h2>
            <p className="max-w-3xl text-muted-foreground text-base leading-relaxed">
              Finance-style deltas per vendor — current plan, recommended plan, and defensible
              rationale (not generic LLM fluff).
            </p>
          </div>
          <div className="flex flex-col gap-8">
            {auditResult.recommendations?.map((rec: Recommendation, index: number) => (
              <RecommendationResultCard key={`${rec.tool}-${index}`} rec={rec} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          <SpendComparisonChart currentSpend={currentSpend} optimizedSpend={optimizedSpend} />
          <Card className="border-border/80 bg-card/90 py-2 shadow-sm">
            <CardHeader className="space-y-1 px-6 pt-8">
              <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
                <Badge variant="secondary">Efficiency</Badge>
                <span className="tabular-nums">Score {auditResult.efficiencyScore}/100</span>
              </CardTitle>
              <CardDescription>How tightly your modeled stack matches typical “right-sized” usage.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Progress value={auditResult.efficiencyScore} className="h-3" />
            </CardContent>
          </Card>
        </div>

        <Card
          className={
            highSavings
              ? "border-primary border-2 bg-primary/8 py-2 shadow-md"
              : lowSavings
                ? "border-emerald-500/35 bg-emerald-500/8 py-2 shadow-sm"
                : midSavings
                  ? "border-border/90 bg-muted/20 py-2 shadow-sm"
                  : "py-2 shadow-sm"
          }
        >
          <CardHeader className="space-y-3 px-6 pt-8 sm:px-8">
            <CardTitle className="text-xl md:text-2xl">
              {highSavings
                ? "You may be significantly overspending on AI tooling"
                : lowSavings
                  ? "Your current AI tooling spend appears reasonably efficient"
                  : "Your stack has moderate optimization opportunities"}
            </CardTitle>
            <CardDescription className="text-base leading-relaxed md:text-[1.05rem]">
              {highSavings
                ? "A Credex optimization review could help validate these modeled cuts against your contracts, seats, and usage — and surface further infrastructure savings where they exist."
                : lowSavings
                  ? "Modeled waste under $100/mo usually means you are already in a healthy spending range for your inputs. We will only nudge you if pricing or overlap shifts materially."
                  : "There is material runway without a crisis-level leak. Export the PDF for finance, share this link with your cofounder, or request a short Credex read-through on the deltas."}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap gap-3 px-6 pb-8 sm:px-8">
            {highSavings ? (
              <>
                <Button asChild size="lg">
                  <a
                    href={`mailto:${import.meta.env.VITE_CONSULT_EMAIL ?? "hello@credex.ai"}?subject=${encodeURIComponent("Credex — Book consultation (high savings audit)")}&body=${encodeURIComponent(`I'd like to book a Credex consultation.\n\nAudit share ID: ${shareId}\nModeled monthly savings: ~$${Math.round(auditResult.monthlySavings)}\n`)}`}
                  >
                    Talk to Credex
                  </a>
                </Button>
                <Button variant="outline" size="lg" onClick={scrollToCredexLead}>
                  Send details below
                </Button>
              </>
            ) : midSavings ? (
              <>
                <Button asChild variant="default" size="lg">
                  <a
                    href={`mailto:${import.meta.env.VITE_CONSULT_EMAIL ?? "hello@credex.ai"}?subject=${encodeURIComponent("Credex — Get optimization review")}&body=${encodeURIComponent(`I'd like an optimization review of this audit.\n\nAudit share ID: ${shareId}\nModeled monthly savings: ~$${Math.round(auditResult.monthlySavings)}\n`)}`}
                  >
                    Get optimization review
                  </a>
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/audit")}>
                  Run another audit
                </Button>
              </>
            ) : (
              <>
                <Button variant="default" size="lg" onClick={scrollToCredexLead}>
                  Notify me about future savings
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate("/audit")}>
                  Run another audit
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <LeadCaptureSection
          auditId={auditResult.auditId}
          teamSize={teamSize}
          savingsBand={savingsBand}
          audit={auditResult}
          aiSummary={aiSummary ?? auditResult.aiSummary ?? null}
          primaryUseCase={primaryUseCase}
          currentSpend={currentSpend}
          optimizedSpend={optimizedSpend}
        />
      </div>
    </div>
  );
}

function LeadCaptureSection(props: {
  auditId: string;
  teamSize: number;
  savingsBand: "high" | "mid" | "low";
  audit: AuditResult;
  aiSummary: string | null;
  primaryUseCase: string;
  currentSpend: number;
  optimizedSpend: number;
}) {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const auditForPdf: AuditResult = {
        ...props.audit,
        aiSummary: props.aiSummary ?? props.audit.aiSummary ?? null,
      };

      const pdfMod = await import("@/lib/generate-audit-pdf");
      const { base64: auditPdfBase64, filename: auditPdfFilename } =
        pdfMod.getAuditPdfBase64(auditForPdf, {
          currentMonthlySpend: props.currentSpend,
          optimizedMonthlySpend: props.optimizedSpend,
          isPublic: false,
          teamSize: props.teamSize,
          primaryUseCase: props.primaryUseCase || undefined,
          generatedAt: new Date(),
        });

      await apiClient.createLead({
        auditId: props.auditId,
        email,
        companyName: companyName || undefined,
        role: role || undefined,
        teamSize: props.teamSize,
        companyWebsite: honeypot,
        auditPdfBase64,
        auditPdfFilename,
      });
      toast({
        title: "You are on the list",
        description: "We saved your details and queued a follow-up email with your audit context.",
      });
      setLeadSuccess(true);
      setEmail("");
      setCompanyName("");
      setRole("");
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Could not save",
        description: err instanceof Error ? err.message : "Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const leadTitle =
    props.savingsBand === "high"
      ? "Get the detailed playbook"
      : props.savingsBand === "mid"
        ? "Request a Credex read-through"
        : "Notify me about future savings";

  if (leadSuccess) {
    return (
      <Card id="credex-lead" className="scroll-mt-28 border-emerald-500/30 bg-emerald-500/5 py-2 shadow-md">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-8">
          <div className="flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-8" aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-lg text-foreground">Thanks — you are all set</p>
            <p className="mt-2 max-w-md text-muted-foreground text-sm leading-relaxed">
              We stored your lead and sent a confirmation path through our email provider (when
              configured). Share this audit from the header if your cofounder should see the same
              numbers.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setLeadSuccess(false)}>
            Submit another email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="credex-lead" className="scroll-mt-28 border-border/90 bg-card/95 py-2 shadow-md">
      <CardHeader className="space-y-2 px-6 pt-8 sm:px-8">
        <CardTitle className="text-xl md:text-2xl">{leadTitle}</CardTitle>
        <CardDescription className="text-base">
          Optional — after you have seen the numbers. No account or calendar required; we follow up by
          email.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-8 sm:px-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="text"
            name="companyWebsite"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-email">Work email</Label>
              <Input
                id="lead-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-role">Role</Label>
              <Input
                id="lead-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="min-h-11"
              />
            </div>
            <div className="space-y-2">
              <Label>Team size</Label>
              <Input value={props.teamSize} readOnly className="min-h-11 bg-muted/50" />
            </div>
          </div>
          <Button type="submit" size="lg" className="min-h-12 w-full sm:w-auto" disabled={submitting}>
            {submitting
              ? "Sending…"
              : props.savingsBand === "low"
                ? "Notify me"
                : "Send to Credex"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
