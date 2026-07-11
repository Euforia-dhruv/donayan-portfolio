import CinematicHero from "@/components/CinematicHero";
import FeaturedReel from "@/components/FeaturedReel";
import ProductionWall from "@/components/ProductionWall";
import CampaignCarousel from "@/components/CampaignCarousel";
import FeaturedProductions from "@/components/FeaturedProductions";
import AboutSection from "@/components/AboutSection";
import Brands from "@/components/Brands";
import ProductionTimeline from "@/components/ProductionTimeline";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <FeaturedReel />
      <ProductionWall />
      <CampaignCarousel />
      <FeaturedProductions />
      <AboutSection />
      <Brands />
      <ProductionTimeline />
      <Testimonials />
      <ContactSection />
    </>
  );
}
