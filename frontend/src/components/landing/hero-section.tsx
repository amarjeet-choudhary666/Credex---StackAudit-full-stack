import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-dvh flex-col justify-center overflow-hidden pt-14 pb-20">
      <header className="fixed top-0 right-0 left-0 z-50 border-border/60 border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            to="/"
            className="font-semibold text-foreground text-sm tracking-tight hover:opacity-90"
          >
            Credex
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/audit">Run audit</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/30 via-background to-background" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 pt-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="px-4 py-2 font-medium text-sm">
              <Sparkles className="mr-2 inline size-4 text-primary" aria-hidden />
              AI stack audit · ~60 seconds · no login
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-6 text-balance font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Your AI stack is{" "}
            <span className="text-foreground underline decoration-primary/40 decoration-2 underline-offset-4">
              probably overpriced
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mx-auto mb-10 max-w-2xl text-pretty text-muted-foreground text-lg leading-relaxed sm:text-xl md:text-2xl"
          >
            Find hidden savings across Cursor, Claude, ChatGPT, Copilot, and AI APIs in 60
            seconds — before finance asks why the burn moved again.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-14 flex flex-col items-stretch justify-center gap-3 sm:mb-16 sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              className="h-12 min-h-12 px-8 text-base sm:h-14 sm:min-h-14 sm:px-10 sm:text-lg"
              onClick={onGetStarted}
            >
              Audit My AI Spend
              <ArrowRight className="ml-2 size-5" aria-hidden />
            </Button>
            <Button size="lg" variant="outline" className="h-12 min-h-12 sm:h-14 sm:min-h-14" asChild>
              <Link to="/audit">See the form</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mx-auto grid max-w-3xl grid-cols-1 gap-8 border-border/60 border-t pt-10 sm:grid-cols-3 sm:pt-12"
          >
            {[
              { value: "$18k+", label: "Modeled annual ceiling (mocked, top decile)" },
              { value: "1,200+", label: "Audits run (mocked social proof)" },
              { value: "60s", label: "To first savings number" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 font-bold text-3xl text-foreground tabular-nums sm:text-4xl">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm leading-snug">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
