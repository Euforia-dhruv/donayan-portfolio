import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import ProductionWall from "@/components/ProductionWall";
import ProductionReels from "@/components/ProductionReels";
import FeaturedProductions from "@/components/FeaturedProductions";
import ProductionTimeline from "@/components/ProductionTimeline";
import Testimonials from "@/components/Testimonials";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Brands />
        <ProductionWall />
        <ProductionReels />
        <FeaturedProductions />
        <ProductionTimeline />
        <Testimonials />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
