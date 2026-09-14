import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "Help Center | Monietar",

  description:
    "Find answers about Monietar, the cash flow operating system for African businesses. Learn how to track sales, profit, cash flow, inventory, sourcing, and more.",

  keywords: [
    "Monietar Help Center",
    "Monietar help",
    "Monietar support",
    "Monietar guides",
    "Monietar documentation",
    "cash flow management",
    "cash flow operating system",
    "business finance",
    "profit tracking",
    "sales tracking",
    "inventory tracking",
    "financial intelligence",
    "cross-border sourcing",
    "African SMEs",
    "Nigeria business finance",
  ],

  alternates: {
    canonical: `${siteUrl}/help`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/help-center`,
    siteName: "Monietar",
    title: "Help Center | Monietar",
    description:
      "Find answers about setting up Monietar, tracking your finances, managing inventory, and understanding your business cash flow.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monietar Help Center — The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Help Center | Monietar",
    description:
      "Find answers about Monietar, from getting started to understanding your cash flow, profit, inventory, and financial activity.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HelpCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}