import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import ProductionWall from "@/components/ProductionWall";
import ProductionReels from "@/components/ProductionReels";
import FeaturedProductions from "@/components/FeaturedProductions";
import AboutSection from "@/components/AboutSection";
import ProductionTimeline from "@/components/ProductionTimeline";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <ProductionWall />
      <ProductionReels />
      <FeaturedProductions />
      <AboutSection />
      <ProductionTimeline />
      <Testimonials />
      <ContactSection />
    </>
  );
}
