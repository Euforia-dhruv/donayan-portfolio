import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Featured from "@/components/Featured";
import ProductionWall from "@/components/ProductionWall";
import FeaturedProductions from "@/components/FeaturedProductions";
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
        <Reveal><Featured /></Reveal>
        <Reveal><ProductionWall /></Reveal>
        <Reveal><FeaturedProductions /></Reveal>
        <Reveal><ProductionTimeline /></Reveal>
        <Reveal><Testimonials /></Reveal>
        <Reveal><AboutSection /></Reveal>
        <Reveal><ContactSection /></Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
