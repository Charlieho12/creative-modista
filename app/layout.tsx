import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { FloatingCartButton } from "@/components/layout/FloatingCartButton";
import { Header } from "@/components/layout/Header";
import { MessengerButton } from "@/components/layout/MessengerButton";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Creative Modista | Women's Fashion Boutique Philippines",
    template: "%s | Creative Modista"
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: "Creative Modista",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Creative Modista",
    type: "website",
    images: [
      {
        url: siteConfig.logo,
        width: 750,
        height: 750,
        alt: "Creative Modista official brand logo"
      }
    ]
  },
  icons: {
    icon: siteConfig.logo,
    apple: siteConfig.logo
  },
  alternates: {
    canonical: siteConfig.url
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingCartButton />
          <MessengerButton />
        </CartProvider>
      </body>
    </html>
  );
}
