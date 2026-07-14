import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectTimeline from "@/components/ProjectTimeline";
import Reveal from "@/components/motion/Reveal";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import { BASE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A chronological production timeline of Donayan Sahdev — commercials, brand films, fashion campaigns and music videos, newest first.",
  keywords: ["Production Timeline", "Creative Producer", "Commercials", "Brand Films", "Campaigns"],
};

export default function TimelinePage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ProjectTimeline titleAs="h1" />
        </Reveal>
      </main>
      <Footer />
      <SeoBreadcrumb items={[{ name: "Home", url: BASE_URL }, { name: "Timeline", url: `${BASE_URL}/timeline` }]} />
    </SiteDataProvider>
  );
}
