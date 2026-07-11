import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import siteContent from "@/data/site-content.json";

export const metadata: Metadata = {
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  openGraph: {
    title: siteContent.seo.ogTitle,
    description: siteContent.seo.ogDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cinema-black text-cinema-white font-sans antialiased film-grain">
        <div className="vignette" />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
