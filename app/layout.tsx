import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import RegisterSW from "./register-sw";
import ServiceWorkerRegistration from "./ServiceWorkerRegistration";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Monietar | The Cash Flow Operating System",
    template: "%s | Monietar",
  },

  description:
    "Monietar is the cash flow operating system for African businesses, helping you track sales, profits, cash flow, inventory, and financial activity in one place.",

  applicationName: "Monietar",

  keywords: [
    "Monietar",
    "cash flow operating system",
    "cash flow management",
    "business finance",
    "SME finance",
    "financial management",
    "profit tracking",
    "sales tracking",
    "inventory tracking",
    "business financial intelligence",
    "African SMEs",
    "Nigeria business finance",
    "SME financial management",
    "cross-border sourcing",
  ],

  authors: [
    {
      name: "Monietar",
      url: siteUrl,
    },
  ],

  creator: "Monietar",
  publisher: "Monietar",

  alternates: {
    canonical: siteUrl,
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

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "Monietar",
    title: "Monietar | The Cash Flow Operating System",
    description:
      "The cash flow operating system for African businesses. Track sales, profits, cash flow, inventory, and financial activity in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monietar — The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Monietar | The Cash Flow Operating System",
    description:
      "The cash flow operating system for African businesses.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />

        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />

        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />

        <meta
          name="apple-mobile-web-app-title"
          content="Monietar"
        />
      </head>

      <body className="antialiased">
        {children}

        <Analytics />

        <RegisterSW />

        <SpeedInsights />

        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}