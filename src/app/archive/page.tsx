import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ArchiveContent from "@/components/ArchiveContent";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import { BASE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Archive",
  description:
    "The full production archive of Donayan Sahdev — commercials, music videos, brand films, social campaigns, treatments, pitch decks and PPMs, all in one place.",
  keywords: ["Production Archive", "Commercials", "Brand Films", "Music Videos", "Treatments", "Pitch Decks"],
};

export default function ArchivePage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <ArchiveContent />
      <Footer />
      <SeoBreadcrumb items={[{ name: "Home", url: BASE_URL }, { name: "Archive", url: `${BASE_URL}/archive` }]} />
    </SiteDataProvider>
  );
}
