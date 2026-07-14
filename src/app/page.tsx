import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import ProductionWall from "@/components/ProductionWall";
import PdfWallSection from "@/components/PdfWallSection";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/motion/Reveal";

export default function Home() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Hero />
        <Reveal><Brands /></Reveal>
        <ProductionWall />
        <PdfWallSection />
        <Reveal><Testimonials /></Reveal>
        <Reveal><AboutSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
