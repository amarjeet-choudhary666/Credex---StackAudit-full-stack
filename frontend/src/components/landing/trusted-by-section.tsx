import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { SiLinear, SiRetool, SiSlack, SiSupabase, SiVercel } from "react-icons/si";
import { Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const companies: {
  name: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { name: "Vercel", Icon: SiVercel },
  { name: "Linear", Icon: SiLinear },
  { name: "Slack", Icon: SiSlack },
  { name: "Ramp-style teams", Icon: Wallet },
  { name: "Retool", Icon: SiRetool },
  { name: "Supabase", Icon: SiSupabase },
];

export function TrustedBySection() {
  return (
    <section className="border-border/50 border-t py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10 text-center md:mb-12"
        >
          <p className="mb-2 font-medium text-foreground text-sm tracking-tight md:text-base">
            Built for teams like
          </p>
          <p className="mx-auto mb-6 max-w-xl text-muted-foreground text-sm leading-relaxed md:text-base">
            YC founders, indie hackers, and AI startups (illustrative personas — logos are
            familiar stacks, not endorsements).
          </p>
          <p className="text-muted-foreground text-xs uppercase tracking-wider">
            Trusted-by strip · mocked for assignment demo
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 place-items-center gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company, index) => {
            const { Icon } = company;
            return (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="w-full max-w-[140px]"
              >
                <Card className="border-border/70 bg-muted/20 shadow-none transition-colors hover:bg-muted/35">
                  <CardContent className="flex flex-col items-center gap-2.5 px-3 py-4 sm:py-5">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border border-border/60 bg-background/90 sm:size-11"
                      )}
                    >
                      <Icon
                        className="size-5 text-muted-foreground sm:size-6"
                        aria-hidden
                      />
                    </div>
                    <div className="text-center font-medium text-muted-foreground text-xs leading-tight sm:text-sm">
                      {company.name}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
