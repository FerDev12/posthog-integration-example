import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    content:
      "This quiz helped me identify gaps in my knowledge I didn't even know existed. The spooky theme makes learning fun!",
    avatar: "👩‍💻",
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupXYZ",
    content:
      "I use Spooky Dev Quiz every week to stay sharp. The competitive leaderboard keeps me motivated to improve.",
    avatar: "👨‍💻",
  },
  {
    name: "Emily Watson",
    role: "Tech Lead",
    company: "DevStudio",
    content:
      "Our entire team uses this for skill assessment. It's become an essential part of our learning culture.",
    avatar: "👩‍🔬",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 border-b border-border/40"
    >
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-balance">
            What Developers Are{" "}
            <span className="text-primary">Screaming About</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of developers who have improved their skills with
            Spooky Dev Quiz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 backdrop-blur"
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  <div className="pt-4 border-t border-border/40">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
