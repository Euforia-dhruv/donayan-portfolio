import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductionWall from "@/components/ProductionWall";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Wall — Donayan Sahdev",
  description: "A wall of selected productions, commercials and brand films.",
};

export default function WallPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ProductionWall />
        </Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
