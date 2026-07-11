import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import FeaturedReel from "@/components/FeaturedReel";
import CampaignCarousel from "@/components/CampaignCarousel";
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
      <FeaturedReel />
      <CampaignCarousel />
      <FeaturedProductions />
      <AboutSection />
      <ProductionTimeline />
      <Testimonials />
      <ContactSection />
    </>
  );
}
