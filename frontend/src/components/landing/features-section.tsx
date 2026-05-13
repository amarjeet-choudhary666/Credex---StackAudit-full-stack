import { motion } from "framer-motion";
import { BarChart3, Brain, DollarSign, Zap, Shield, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Deep insights into your AI tool usage patterns and spending efficiency.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Recommendations",
    description: "Get personalized optimization suggestions based on your team's actual usage.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: DollarSign,
    title: "Cost Optimization",
    description: "Identify overspending and find better pricing plans for your team size.",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Instant Audit",
    description: "Complete analysis in under 60 seconds with actionable results.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Benchmark Comparison",
    description: "See how your spending compares to similar teams in your industry.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "Monitor your AI spend and savings over time with detailed reports.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto px-4 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-bold text-4xl md:text-5xl">
            Everything you need to optimize AI spend
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Comprehensive tools to analyze, optimize, and track your AI tool investments
          </p>
        </motion.div>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg h-full transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}