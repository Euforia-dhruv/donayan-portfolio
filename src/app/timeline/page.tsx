import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductionTimeline from "@/components/ProductionTimeline";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Timeline — Donayan Sahdev",
  description: "Production timeline and experience.",
};

export default function TimelinePage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ProductionTimeline />
        </Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
