import type { Metadata } from "next";
import { Archivo_Black, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aussiepridenyc.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Aussie Pride NYC 2026 — March with us at NYC Pride",
    template: "%s · Aussie Pride NYC",
  },
  description:
    "Register to march with the Australian contingent at the NYC Pride March on Sunday 28 June 2026. Free t-shirt, free dance rehearsals, all the Aussie pride.",
  applicationName: "Aussie Pride NYC",
  keywords: [
    "NYC Pride 2026",
    "Australian Pride NYC",
    "Aussie Pride",
    "NYC Pride March",
    "Australian Consulate New York",
    "American Australian Association",
    "America Josh",
  ],
  openGraph: {
    title: "Aussie Pride NYC 2026 — March with us at NYC Pride",
    description:
      "Register to march with the Australian contingent at the NYC Pride March, Sunday 28 June 2026.",
    url: SITE_URL,
    siteName: "Aussie Pride NYC",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aussie Pride NYC 2026",
    description:
      "March with the Aussies at NYC Pride 2026. Free t-shirt, free dance classes, a beaut of a time.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
