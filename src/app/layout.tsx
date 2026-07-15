import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "@/lib/convex/provider";
import WorkWithMePopup from "@/components/WorkWithMePopup";
import ViewTracker from "@/components/admin/ViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const BASE_URL = "https://donayan.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Donayan Sahdev | Freelance Director's Assistant & Creative Producer",
    template: "%s | Donayan Sahdev",
  },
  description:
    "Creative Producer & Freelance Director's Assistant working across commercials, brand films, music videos, fashion campaigns and digital productions for India's leading brands.",
  keywords: [
    "Donayan Sahdev",
    "Creative Producer India",
    "Director Assistant Mumbai",
    "Commercial Producer",
    "Brand Film Producer",
    "Music Video Producer",
    "Fashion Production",
    "Production Freelancer India",
  ],
  applicationName: "Donayan Sahdev Portfolio",
  authors: [{ name: "Donayan Sahdev" }],
  creator: "Donayan Sahdev",
  publisher: "Donayan Sahdev",
  category: "portfolio",
  alternates: { canonical: BASE_URL },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Donayan Sahdev",
    title: "Donayan Sahdev | Freelance Director's Assistant & Creative Producer",
    description:
      "Creative Producer & Freelance Director's Assistant working across commercials, brand films, music videos, fashion campaigns and digital productions for India's leading brands.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Donayan Sahdev — Creative Producer & Director Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donayan Sahdev | Freelance Director's Assistant & Creative Producer",
    description:
      "Creative Producer & Freelance Director's Assistant — commercials, brand films, music videos and fashion productions.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const SAME_AS = [
  "https://www.instagram.com/donayansahdev/",
  "https://www.linkedin.com/in/donayan?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  BASE_URL,
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE_URL}/#person`,
    name: "Donayan Sahdev",
    givenName: "Donayan",
    familyName: "Sahdev",
    url: BASE_URL,
    email: "ads.donayan@gmail.com",
    telephone: "+91 98193 17834",
    image: `${BASE_URL}/og.png`,
    occupation: "Creative Producer",
    jobTitle: "Freelance Director's Assistant",
    description:
      "Creative Producer & Freelance Director's Assistant working across commercials, brand films, music videos, fashion campaigns and digital productions for India's leading brands.",
    sameAs: SAME_AS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Commercial Production",
      "Brand Films",
      "Fashion Films",
      "Music Videos",
      "Creative Direction",
      "Photography",
      "Campaign Production",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Donayan Sahdev",
    url: BASE_URL,
    email: "ads.donayan@gmail.com",
    logo: `${BASE_URL}/og.png`,
    sameAs: SAME_AS,
    founder: { "@id": `${BASE_URL}/#person` },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "Donayan Sahdev",
    url: BASE_URL,
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/#portfolio`,
    name: "Selected Productions",
    url: `${BASE_URL}/wall`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
  },
];

import { jsonLdSafe } from "@/lib/jsonld";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" as="image" href="/hero-bg.jpg" fetchPriority="high" />
        <link rel="alternate" type="application/rss+xml" title="Donayan Sahdev" href="/rss.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdSafe(structuredData) }}
        />
      </head>
      <body className="bg-cinema-black text-cinema-white font-switzer antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ConvexClientProvider>
          {children}
          <WorkWithMePopup />
          <ViewTracker />
          <AnalyticsTracker />
        </ConvexClientProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
