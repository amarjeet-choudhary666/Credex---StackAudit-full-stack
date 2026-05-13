import { motion } from "framer-motion";
import { Layers, Receipt, Server, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const patterns: { title: string; body: string; icon: typeof Layers }[] = [
  {
    title: "Duplicate subscriptions",
    body: "ChatGPT Team next to Claude Team, or two API contracts covering the same workflows.",
    icon: Receipt,
  },
  {
    title: "Oversized enterprise SKUs",
    body: "Business or Enterprise seats when headcount and compliance do not justify the uplift.",
    icon: Users,
  },
  {
    title: "Unused or lumpy API spend",
    body: "Committed capacity and retail list pricing before credits, reserved instances, or brokered rates.",
    icon: Server,
  },
  {
    title: "Overlapping coding tools",
    body: "Cursor + Copilot + legacy IDE add-ons — each defensible alone, expensive together.",
    icon: Layers,
  },
];

export function WastePatternsSection() {
  return (
    <section className="border-y border-border/60 bg-background py-16 md:py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <h2 className="mb-4 font-bold text-3xl tracking-tight md:text-4xl">
            Common waste patterns
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            What we see most often before anyone models the stack — the audit turns these into
            line-item deltas instead of vibes.
          </p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">
          {patterns.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Card className="h-full border-border/80 bg-card/80 shadow-sm">
                <CardContent className="flex gap-4 p-6 md:p-7">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                    <p.icon className="size-5 text-foreground/80" aria-hidden />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-lg leading-tight">{p.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                      {p.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
