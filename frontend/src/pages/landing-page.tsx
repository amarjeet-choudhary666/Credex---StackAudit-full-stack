import { useNavigate } from "react-router-dom";
import { HeroSection } from "../components/landing/hero-section";
import { TrustedBySection } from "../components/landing/trusted-by-section";
import { WastePatternsSection } from "../components/landing/waste-patterns-section";
import { FeaturesSection } from "../components/landing/features-section";
import { WorkflowSection } from "../components/landing/workflow-section";

export function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/audit");
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      <WastePatternsSection />
      <section className="border-y border-border/60 bg-muted/15 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-4 text-center font-bold text-3xl tracking-tight md:text-4xl">
            Founder pain: AI sprawl is a silent budget line
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-muted-foreground leading-relaxed">
            Duplicated seats, unused enterprise SKUs, and parallel chat + IDE contracts add up
            before finance gets a clean vendor map — we quantify the overlap in one pass.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Overlapping Cursor + Copilot + Windsurf",
              "ChatGPT Team beside Claude Team",
              "OpenAI API + Anthropic API with duplicate commits",
            ].map((t) => (
              <div
                key={t}
                className="rounded-lg border border-border/80 bg-card/60 p-4 text-sm text-muted-foreground"
              >
                {t}
              </div>
            ))}
          </div>
          <div className="mt-12 overflow-hidden rounded-xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 font-medium">Current</th>
                  <th className="p-4 font-medium">Often better</th>
                  <th className="p-4 font-medium">Typical savings signal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cursor Business (2 seats)", "Cursor Pro", "~$40–120/mo"],
                  ["Claude Team (tiny group)", "Claude Pro", "~$30–90/mo"],
                  ["ChatGPT Enterprise (experiment)", "API usage + guardrails", "~$200+/mo"],
                ].map(([a, b, c]) => (
                  <tr key={a} className="border-t border-border/60">
                    <td className="p-4 text-muted-foreground">{a}</td>
                    <td className="p-4 font-medium text-primary">{b}</td>
                    <td className="p-4 text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <TrustedBySection />
      <FeaturesSection />
      <WorkflowSection />
    </div>
  );
}