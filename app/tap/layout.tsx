import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "Monietar TAP | The Cash Flow Operating System",

  description:
    "Monietar TAP is a dedicated, affordable business terminal designed to give merchants direct access to Monietar's cash flow, transaction, and financial intelligence tools.",

  keywords: [
    "Monietar TAP",
    "Monietar hardware",
    "cash flow operating system",
    "business terminal",
    "business financial device",
    "SME hardware",
    "merchant device",
    "cash flow management",
    "business finance",
    "financial intelligence",
    "African SMEs",
    "Nigeria business technology",
    "affordable business hardware",
  ],

  alternates: {
    canonical: `${siteUrl}/tap`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/tap`,
    siteName: "Monietar",
    title: "Monietar TAP | The Cash Flow Operating System",
    description:
      "A dedicated, affordable business terminal designed to give merchants direct access to Monietar's financial intelligence tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monietar TAP — The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Monietar TAP | The Cash Flow Operating System",
    description:
      "A dedicated business terminal built around the financial tools merchants actually need.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function TAPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}