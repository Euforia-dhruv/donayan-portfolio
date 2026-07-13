import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Donayan — Portfolio",
  description: "Design, Photography & Creative Direction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cinema-black text-cinema-white font-switzer antialiased">
        {children}
      </body>
    </html>
  );
}
