import { Features } from "@/app/(public)/_components/features";
import { FinalCTA } from "@/app/(public)/_components/final-cta";
import { Footer } from "@/app/(public)/_components/footer";
import { Header } from "@/app/(public)/_components/header";
import { Hero } from "@/app/(public)/_components/hero";
import { Pricing } from "@/app/(public)/_components/pricing";
import { Testimonials } from "@/app/(public)/_components/testimonials";

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
