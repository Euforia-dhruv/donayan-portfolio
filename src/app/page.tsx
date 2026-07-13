import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import ProductionWall from "@/components/ProductionWall";
import ProductionReels from "@/components/ProductionReels";
import FeaturedProductions from "@/components/FeaturedProductions";
import ViralWorkSection from "@/components/ViralWorkSection";
import ProductionTimeline from "@/components/ProductionTimeline";
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
        <Reveal><ProductionWall /></Reveal>
        <Reveal><ProductionReels /></Reveal>
        <Reveal><FeaturedProductions /></Reveal>
        <Reveal><ViralWorkSection /></Reveal>
        <Reveal><ProductionTimeline /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><AboutSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
