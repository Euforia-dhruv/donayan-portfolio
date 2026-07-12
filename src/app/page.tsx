import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import ProductionWall from "@/components/ProductionWall";
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
      <FeaturedProductions />
      <AboutSection />
      <ProductionTimeline />
      <Testimonials />
      <ContactSection />
    </>
  );
}
