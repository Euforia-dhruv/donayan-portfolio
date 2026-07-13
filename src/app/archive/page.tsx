import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductionReels from "@/components/ProductionReels";
import ViralWorkSection from "@/components/ViralWorkSection";
import PdfGallery from "@/components/PdfGallery";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Archive — Donayan Sahdev",
  description: "An archive of production reels and viral work.",
};

export default function ArchivePage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal><ProductionReels /></Reveal>
        <Reveal><ViralWorkSection /></Reveal>
        <Reveal><PdfGallery /></Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
