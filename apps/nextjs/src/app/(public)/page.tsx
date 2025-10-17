import { Features } from "@/components/features";
import { FinalCTA } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";

export default function LandingPage() {
  return (
    <div className="scroll-smooth">
      <Header />
      <main className="scroll-smooth">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
