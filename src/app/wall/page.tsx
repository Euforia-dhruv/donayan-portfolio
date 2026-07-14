import type { Metadata } from "next";
import { SiteDataProvider } from "@/lib/convex/site-data";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductionWall from "@/components/ProductionWall";
import Reveal from "@/components/motion/Reveal";
import SeoBreadcrumb from "@/components/SeoBreadcrumb";
import { BASE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Wall",
  description:
    "Selected productions, commercials, brand films, fashion campaigns and music videos by Donayan Sahdev — a wall of cinematic work.",
  keywords: ["Production Wall", "Commercials", "Brand Films", "Fashion Films", "Music Videos", "Donayan Sahdev"],
};

export default function WallPage() {
  return (
    <SiteDataProvider>
      <Navigation />
      <main id="main-content">
        <Reveal>
          <ProductionWall titleAs="h1" />
        </Reveal>
      </main>
      <Footer />
      <SeoBreadcrumb items={[{ name: "Home", url: BASE_URL }, { name: "Wall", url: `${BASE_URL}/wall` }]} />
    </SiteDataProvider>
  );
}
