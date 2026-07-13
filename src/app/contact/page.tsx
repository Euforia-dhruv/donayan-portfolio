import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact — Donayan Sahdev",
  description: "Get in touch for freelance and in-house production work.",
};

export default function ContactPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ContactSection />
        </Reveal>
      </main>
      <Footer />
    </SiteDataProvider>
  );
}
