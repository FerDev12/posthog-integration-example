import { Button } from "@/components/ui/button";
import Image from "next/image";
import heroImg from ".././../public/images/spooky-halloween-pumpkin-coding-on-computer-in-dar.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <span className="animate-pulse">🎃</span>
                <span>New Halloween Edition Available</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Test Your Dev Skills{" "}
              <span className="text-primary">in the Dark</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-xl">
              Challenge yourself with spooky coding trivia. From JavaScript
              nightmares to CSS horrors, see if you can survive our developer
              quiz gauntlet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base"
              >
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base bg-transparent"
              >
                View Leaderboard
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Active Players
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-3xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative rounded-lg border border-border/40 bg-card/50 backdrop-blur p-8">
              <Image
                src={heroImg}
                alt="Spooky coding atmosphere"
                width={500}
                height={500}
                className="rounded-lg"
                placeholder="blur"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
