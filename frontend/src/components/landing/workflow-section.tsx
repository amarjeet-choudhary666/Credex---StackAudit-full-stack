import { motion } from "framer-motion";
import { CheckCircle, TrendingDown, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const steps = [
  {
    icon: Zap,
    title: "Select Your Tools",
    description: "Tell us which AI tools your team uses and how many seats you have.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: TrendingDown,
    title: "Get Instant Analysis",
    description: "Our AI analyzes your stack and identifies wasteful spending patterns.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: CheckCircle,
    title: "Implement Savings",
    description: "Follow our recommendations to optimize your AI spend immediately.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
];

export function WorkflowSection() {
  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto px-4 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-bold text-4xl md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Three simple steps to optimize your AI spending
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <div className="relative gap-8 grid grid-cols-1 md:grid-cols-3">
            {/* Connection lines */}
            <div className="hidden md:block top-1/2 left-1/3 absolute bg-gradient-to-r from-primary/50 to-transparent w-1/3 h-px -translate-y-1/2 transform" />
            <div className="hidden md:block top-1/2 right-1/3 absolute bg-gradient-to-l from-primary/50 to-transparent w-1/3 h-px -translate-y-1/2 transform" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <Card className="group z-10 relative hover:shadow-lg p-8 text-center transition-all duration-300">
                  <CardContent className="space-y-4">
                    <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                      <step.icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    
                    <div className="font-semibold text-primary text-sm">
                      Step {index + 1}
                    </div>
                    
                    <h3 className="font-semibold text-xl">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Mobile arrow */}
                {index < steps.length - 1 && (
                  <div className="my-4 flex flex-col items-center gap-2 md:hidden">
                    <Separator className="max-w-[40%] bg-primary/30" />
                    <ArrowRight className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}