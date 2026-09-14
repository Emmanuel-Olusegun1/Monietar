import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "About Monietar | The Cash Flow Operating System",

  description:
    "Learn about Monietar, the cash flow operating system built to help African businesses understand their sales, profits, cash flow, inventory, and financial activity.",

  keywords: [
    "About Monietar",
    "Monietar",
    "cash flow operating system",
    "cash flow management",
    "business finance",
    "SME finance",
    "financial intelligence",
    "African businesses",
    "African SMEs",
    "Nigeria business finance",
  ],

  alternates: {
    canonical: `${siteUrl}/about`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/about`,
    siteName: "Monietar",
    title: "About Monietar | The Cash Flow Operating System",
    description:
      "Learn about Monietar and why we are building the cash flow operating system for African businesses.",
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
    title: "About Monietar | The Cash Flow Operating System",
    description:
      "Learn about Monietar and why we are building the cash flow operating system for African businesses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}