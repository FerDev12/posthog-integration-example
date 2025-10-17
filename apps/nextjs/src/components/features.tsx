import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: "🧠",
    title: "Brain-Melting Questions",
    description:
      "Dive into challenging questions covering JavaScript, TypeScript, React, Node.js, and more. Each question is designed to test your real-world knowledge.",
  },
  {
    icon: "🏆",
    title: "Competitive Leaderboards",
    description:
      "Climb the ranks and compete with developers worldwide. Track your progress and see how you stack up against the best.",
  },
  {
    icon: "🎯",
    title: "Skill-Based Matching",
    description:
      "Questions adapt to your skill level. Whether you're a junior dev or a senior architect, you'll find the perfect challenge.",
  },
  {
    icon: "📊",
    title: "Detailed Analytics",
    description:
      "Get insights into your strengths and weaknesses. Track your improvement over time with comprehensive statistics.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            Features That Will{" "}
            <span className="text-primary">Haunt Your Dreams</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to test and improve your development skills in a
            spooky, engaging environment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors"
            >
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
