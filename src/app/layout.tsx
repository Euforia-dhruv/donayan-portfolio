import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex/provider";

export const metadata: Metadata = {
  title: "Donayan Sahdev — Freelance Director's Assistant & Creative Producer",
  description:
    "Mumbai-based Freelance Director's Assistant and Creative Producer. 60+ commercial productions across advertising, fashion, celebrity campaigns, and music videos. Available for freelance and in-house productions.",
  keywords: [
    "Donayan Sahdev",
    "Director's Assistant",
    "Creative Producer",
    "Commercial Production",
    "Mumbai",
    "Advertising",
    "Fashion Campaigns",
    "Celebrity Shoots",
    "Music Videos",
    "Brand Films",
  ],
  authors: [{ name: "Donayan Sahdev" }],
  creator: "Donayan Sahdev",
  openGraph: {
    title: "Donayan Sahdev — Production Portfolio",
    description:
      "Freelance Director's Assistant & Creative Producer. Production · Commercials · Brand Films · Music Videos.",
    url: "https://donayan.com",
    siteName: "Donayan Sahdev",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Donayan Sahdev — Production Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donayan Sahdev — Freelance Director's Assistant & Creative Producer",
    description:
      "Mumbai-based Freelance Director's Assistant and Creative Producer. 60+ commercial productions.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "https://donayan.com" },
  metadataBase: new URL("https://donayan.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://donayan.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Donayan Sahdev",
              jobTitle: "Freelance Director's Assistant & Creative Producer",
              description:
                "Mumbai-based Freelance Director's Assistant and Creative Producer. 60+ commercial productions across advertising, fashion, celebrity campaigns, and music videos.",
              url: "https://donayan.com",
              sameAs: ["https://linkedin.com/in/donayansahdev", "https://www.instagram.com/donayan_"],
              worksFor: {
                "@type": "Organization",
                name: "Freelance",
              },
              location: { "@type": "Place", name: "Mumbai, India" },
            }),
          }}
        />
      </head>
      <body className="bg-cinema-black text-cinema-white font-switzer antialiased">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
