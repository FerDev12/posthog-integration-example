import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Free Spirit",
    price: "$0",
    description: "Perfect for casual learners",
    features: [
      "50 questions per month",
      "Basic leaderboard access",
      "Community support",
      "Mobile app access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Haunted Pro",
    price: "$9",
    description: "For serious developers",
    features: [
      "Unlimited questions",
      "Advanced analytics",
      "Priority support",
      "Custom quiz creation",
      "Ad-free experience",
      "Exclusive challenges",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team Nightmare",
    price: "$49",
    description: "For development teams",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team analytics dashboard",
      "Custom branding",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Choose Your <span className="text-primary">Nightmare Level</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Select the plan that fits your learning journey. All plans include
            our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border-border/40 bg-card/50 backdrop-blur relative ${
                plan.popular
                  ? "border-primary/60 shadow-lg shadow-primary/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <span className="text-primary mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
