import CinematicHero from "@/components/CinematicHero";
import Brands from "@/components/Brands";
import FeaturedReel from "@/components/FeaturedReel";
import ProductionWall from "@/components/ProductionWall";
import ShowcaseWall from "@/components/ShowcaseWall";
import CampaignCarousel from "@/components/CampaignCarousel";
import FeaturedProductions from "@/components/FeaturedProductions";
import AboutSection from "@/components/AboutSection";
import ProductionTimeline from "@/components/ProductionTimeline";
import Testimonials from "@/components/Testimonials";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <Brands />
      <FeaturedReel />
      <ProductionWall />
      <ShowcaseWall />
      <CampaignCarousel />
      <FeaturedProductions />
      <AboutSection />
      <ProductionTimeline />
      <Testimonials />
      <ContactSection />
    </>
  );
}
