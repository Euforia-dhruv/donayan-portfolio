import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About — Donayan Sahdev",
  description: "About Donayan Sahdev — Freelance Director's Assistant & Creative Producer.",
};

export default function AboutPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <AboutSection />
        </Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
