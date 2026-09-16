import { ArchitectureSection } from "@/components/ArchitectureSection";
import { BusinessModelSection } from "@/components/BusinessModelSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ImpactSection } from "@/components/ImpactSection";
import { Navbar } from "@/components/Navbar";
import { ProblemSection } from "@/components/ProblemSection";
import { USPSection } from "@/components/USPSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <ArchitectureSection />
        <USPSection />
        <ImpactSection />
        <BusinessModelSection />
      </main>
      <Footer />
    </div>
  );
}
