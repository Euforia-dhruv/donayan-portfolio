import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ArchiveContent from "@/components/ArchiveContent";

export const metadata: Metadata = {
  title: "Production Archive — Donayan Sahdev",
  description: "Every production, document and deck — fully archived.",
};

export default function ArchivePage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <ArchiveContent />
      <Footer />
    </SiteDataProvider>
  );
}
