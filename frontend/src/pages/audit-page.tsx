import { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolSelector } from "../components/audit/tool-selector";
import { ToolConfiguration } from "../components/audit/tool-configuration";
import { useAuditStore } from "../store/audit-store";
import { SUPPORTED_TOOLS, USE_CASES, isApiTool } from "../lib/constants";
import { apiClient, type CreateAuditRequest } from "../lib/api";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Team", description: "Size & primary use case" },
  { id: 2, title: "Tools", description: "What you pay for" },
  { id: 3, title: "Plans", description: "Plans, seats & API spend" },
];

export function AuditPage() {
  const navigate = useNavigate();
  const {
    teamSize,
    primaryUseCase,
    selectedTools,
    currentStep,
    isLoading,
    setTeamSize,
    setPrimaryUseCase,
    addTool,
    updateTool,
    removeTool,
    setCurrentStep,
    setLoading,
    setAuditResult,
  } = useAuditStore();

  const [localSelectedToolIds, setLocalSelectedToolIds] = useState<string[]>([]);

  useEffect(() => {
    setLocalSelectedToolIds(selectedTools.map((t) => t.tool));
  }, [selectedTools]);

  const handleToolToggle = (toolId: string) => {
    if (localSelectedToolIds.includes(toolId)) {
      setLocalSelectedToolIds((prev) => prev.filter((id) => id !== toolId));
      const index = selectedTools.findIndex((t) => t.tool === toolId);
      if (index !== -1) {
        removeTool(index);
      }
    } else {
      setLocalSelectedToolIds((prev) => [...prev, toolId]);
      const toolConfig = SUPPORTED_TOOLS[toolId as keyof typeof SUPPORTED_TOOLS];
      const defaultPlan = toolConfig.plans[0];
      if (isApiTool(toolId)) {
        const defaultSpend = toolId === "openai_api" ? 300 : 200;
        addTool({
          tool: toolId,
          plan: defaultPlan.name,
          seats: 1,
          monthlySpend: defaultSpend,
        });
      } else {
        addTool({
          tool: toolId,
          plan: defaultPlan.name,
          seats: teamSize,
          monthlySpend: defaultPlan.pricePerSeat * teamSize,
        });
      }
    }
  };

  const canProceedFromStep1 = teamSize > 0 && Boolean(primaryUseCase);
  const canProceedFromStep2 = selectedTools.length > 0;
  const canSubmit = selectedTools.length > 0 && Boolean(primaryUseCase);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/");
    }
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      const result = await apiClient.createAudit({
        teamSize,
        primaryUseCase: primaryUseCase as CreateAuditRequest["primaryUseCase"],
        tools: selectedTools,
      });

      setAuditResult(result);
      navigate(`/results/${result.shareId}`);
      toast({
        title: "Audit completed",
        description: "Your spend audit is ready.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Audit failed",
        description:
          error instanceof Error ? error.message : "Failed to create audit",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentMeta = STEPS[currentStep - 1];

  return (
    <div className="relative flex min-h-screen flex-col bg-muted/25">
      {/* Ambient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(480px,45vh)] bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,color-mix(in_oklab,var(--primary)_9%,transparent),transparent)]"
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-border/60 border-b bg-card/80 backdrop-blur-xl supports-backdrop-filter:bg-card/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:py-4">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="bg-border hidden h-8 w-px shrink-0 md:block" aria-hidden />
            <div className="min-w-0">
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-wider">
                <Link to="/" className="hover:text-foreground transition-colors">
                  Credex
                </Link>
                <span aria-hidden className="text-border">
                  /
                </span>
                <span>Spend audit</span>
              </div>
              <p className="text-foreground truncate pt-0.5 font-semibold leading-tight">
                {currentMeta.title} · {currentMeta.description}
              </p>
            </div>
          </div>

          {/* Desktop stepper */}
          <nav
            aria-label="Audit steps"
            className="hidden shrink-0 items-center md:flex md:gap-0"
          >
            {STEPS.map((step, index) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2 px-1">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                        done &&
                          "border-primary bg-primary text-primary-foreground shadow-sm",
                        active &&
                          !done &&
                          "border-primary bg-background text-primary ring-4 ring-primary/15",
                        !done &&
                          !active &&
                          "border-muted-foreground/20 bg-muted/40 text-muted-foreground",
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span
                      className={cn(
                        "hidden max-w-[4.5rem] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide lg:block",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={cn(
                        "mx-2 mb-7 hidden h-0.5 w-8 shrink-0 rounded-full lg:block xl:w-14",
                        currentStep > step.id ? "bg-primary" : "bg-border",
                      )}
                      aria-hidden
                    />
                  )}
                </Fragment>
              );
            })}
          </nav>

          {/* Mobile step indicator */}
          <div className="flex items-center gap-2 md:hidden">
            <Badge variant="secondary" className="font-normal tabular-nums">
              Step {currentStep} / {STEPS.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="relative flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 md:pb-24 md:pt-12">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mx-auto max-w-xl space-y-8"
            >
              <header className="space-y-2 text-center md:text-left">
                <p className="text-primary font-semibold text-xs uppercase tracking-wider">
                  Step 1 · Team profile
                </p>
                <h1 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
                  Tell us about your team
                </h1>
                <p className="text-muted-foreground mx-auto max-w-md text-sm md:mx-0 md:text-base">
                  We use this to benchmark spend per person and tailor recommendations.
                </p>
              </header>

              <Card className="border-border/80 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">
                    Basics
                  </CardTitle>
                  <CardDescription>
                    Approximate headcount and how your team uses AI most.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-2">
                  <div className="gap-5 grid grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="team-size">Team size</Label>
                      <Input
                        id="team-size"
                        type="number"
                        min={1}
                        max={1000}
                        value={teamSize}
                        onChange={(e) =>
                          setTeamSize(Math.max(1, parseInt(e.target.value, 10) || 1))
                        }
                        placeholder="e.g. 12"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="use-case">Primary use case</Label>
                      <Select
                        value={primaryUseCase || ""}
                        onValueChange={setPrimaryUseCase}
                      >
                        <SelectTrigger id="use-case" className="h-11 w-full">
                          <SelectValue placeholder="Select one" />
                        </SelectTrigger>
                        <SelectContent>
                          {USE_CASES.map((useCase) => (
                            <SelectItem key={useCase.value} value={useCase.value}>
                              <div className="py-0.5">
                                <div className="font-medium">{useCase.label}</div>
                                <div className="text-muted-foreground text-xs">
                                  {useCase.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-muted-foreground flex flex-col items-center justify-between gap-4 border-border/60 border-t pt-8 text-xs sm:flex-row sm:text-sm">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  About 2 minutes to finish
                </span>
                <Button
                  size="lg"
                  className="min-w-[10rem]"
                  onClick={handleNext}
                  disabled={!canProceedFromStep1}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              <ToolSelector
                selectedTools={localSelectedToolIds}
                onToggleTool={handleToolToggle}
              />

              <div className="flex flex-col items-stretch justify-between gap-4 border-border/60 border-t pt-10 sm:flex-row sm:items-center">
                <p className="text-muted-foreground order-2 text-center text-xs sm:order-1 sm:text-left sm:text-sm">
                  {selectedTools.length > 0
                    ? `${selectedTools.length} tool${selectedTools.length !== 1 ? "s" : ""} selected · configure pricing next`
                    : "Select at least one tool to continue"}
                </p>
                <Button
                  size="lg"
                  className="order-1 sm:order-2 sm:min-w-[11rem]"
                  onClick={handleNext}
                  disabled={!canProceedFromStep2}
                >
                  Continue to plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-10"
            >
              <ToolConfiguration
                tools={selectedTools}
                onUpdateTool={updateTool}
                onRemoveTool={(index) => {
                  const tool = selectedTools[index];
                  removeTool(index);
                  setLocalSelectedToolIds((prev) =>
                    prev.filter((id) => id !== tool.tool),
                  );
                }}
              />

              <div className="flex flex-col items-stretch justify-between gap-4 border-border/60 border-t pt-10 sm:flex-row sm:items-center">
                <p className="text-muted-foreground order-2 text-center text-xs sm:order-1 sm:text-left sm:text-sm">
                  We&apos;ll generate savings estimates and a shareable summary.
                </p>
                <Button
                  size="lg"
                  className="order-1 min-h-12 w-full sm:order-2 sm:w-auto sm:min-w-[12rem]"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  loading={isLoading}
                >
                  Analyze My Stack
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
