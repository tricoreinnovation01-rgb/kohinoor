import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Kohinoor Artist — Drawing · Kathmandu",
    template: "%s · Kohinoor Artist",
  },
  description:
    "Fine art drawings by Kohinoor — drawing artist and architectural designer. Artist gallery, shop, and commissions.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kohinoor Artist",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${dmSans.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <LenisProvider>
          <CartProvider>
            <SiteHeader />
            <main className="min-h-screen pt-20 md:pt-24">{children}</main>
            <SiteFooter />
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
