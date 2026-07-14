import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";
import Reveal from "@/components/motion/Reveal";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import { BASE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Donayan Sahdev — Creative Producer and Director in Mumbai, India — for commercials, brand films, fashion campaigns, photography, creative direction and production services.",
  keywords: ["Contact Donayan Sahdev", "Creative Producer Mumbai", "Production Inquiry", "Brand Film Producer India"],
};

export default function ContactPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ContactSection titleAs="h1" />
        </Reveal>
      </main>
      <Footer />
      <SeoBreadcrumb items={[{ name: "Home", url: BASE_URL }, { name: "Contact", url: `${BASE_URL}/contact` }]} />
    </SiteDataProvider>
  );
}
