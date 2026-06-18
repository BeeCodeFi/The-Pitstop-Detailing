import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header, Footer, SmoothScroll } from "@/components/layout";
import { SITE_CONFIG } from "@/lib/constants";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "car detailing",
    "ceramic coating",
    "paint protection film",
    "PPF",
    "interior detailing",
    "exterior detailing",
    "car wash",
    "auto detailing",
    "vehicle pickup delivery",
    SITE_CONFIG.name,
  ],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <SmoothScroll>
          <Header />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
