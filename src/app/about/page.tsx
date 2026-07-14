import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import Reveal from "@/components/motion/Reveal";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import { BASE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About",
  description:
    "Donayan Sahdev is a Creative Producer and Director in Mumbai, India — producing commercials, brand films, fashion campaigns, music videos, photography, creative direction and full-scale production.",
  keywords: ["About Donayan Sahdev", "Creative Producer Mumbai", "Director India", "Production Portfolio"],
};

export default function AboutPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <AboutSection titleAs="h1" />
        </Reveal>
      </main>
      <Footer />
      <SeoBreadcrumb items={[{ name: "Home", url: BASE_URL }, { name: "About", url: `${BASE_URL}/about` }]} />
    </SiteDataProvider>
  );
}
