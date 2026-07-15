export const dynamic = "force-dynamic";
import Script from "next/script";
import AdminShell from "./AdminShell";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-JMKN76JYS6"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JMKN76JYS6');
        `}
      </Script>
      <AdminShell>{children}</AdminShell>
    </>
  );
}
