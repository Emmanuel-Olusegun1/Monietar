import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "Monietar API | The Cash Flow Operating System",

  description:
    "Build on Monietar's financial infrastructure. The Monietar API will give developers programmatic access to business records, transactions, ledgers, and multi-currency financial operations.",

  keywords: [
    "Monietar API",
    "Monietar developer API",
    "financial API",
    "business finance API",
    "cash flow API",
    "ledger API",
    "financial infrastructure",
    "business integrations",
    "developer tools",
    "financial technology",
    "FinTech API",
    "cash flow operating system",
    "African FinTech",
  ],

  alternates: {
    canonical: `${siteUrl}/api-docs`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/api`,
    siteName: "Monietar",
    title: "Monietar API | The Cash Flow Operating System",
    description:
      "Build on Monietar's financial infrastructure. Connect your products and workflows to the financial layer powering modern businesses.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Monietar API — The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Monietar API | The Cash Flow Operating System",
    description:
      "Build on Monietar's financial infrastructure and connect to the financial layer powering modern businesses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function APILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}