import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "Monietar Community | The Cash Flow Operating System",

  description:
    "Join the Monietar community for practical conversations around cash flow, profitability, business operations, inventory, sourcing, and financial visibility for African businesses.",

  keywords: [
    "Monietar Community",
    "Monietar",
    "business community Nigeria",
    "African business community",
    "SME community",
    "business owners community",
    "cash flow",
    "profit and margins",
    "business operations",
    "inventory management",
    "cross-border sourcing",
    "financial visibility",
    "business finance",
    "cash flow operating system",
    "African SMEs",
  ],

  alternates: {
    canonical: `${siteUrl}/community`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/community`,
    siteName: "Monietar",
    title: "Monietar Community | The Cash Flow Operating System",
    description:
      "A growing community for business owners who want to understand their numbers, learn from others, and get better at running their businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monietar Community — The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Monietar Community | The Cash Flow Operating System",
    description:
      "Practical conversations for business owners around cash flow, profitability, operations, inventory, sourcing, and financial visibility.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}