import type { Metadata } from "next";

const siteUrl = "https://monietar.com.ng";

export const metadata: Metadata = {
  title: "Careers at Monietar | The Cash Flow Operating System",

  description:
    "Join Monietar and help build the cash flow operating system for African businesses. Explore opportunities across engineering, product, design, growth, and operations.",

  keywords: [
    "Monietar careers",
    "Monietar jobs",
    "Monietar hiring",
    "careers at Monietar",
    "FinTech jobs Nigeria",
    "FinTech careers",
    "software engineering jobs Nigeria",
    "product design jobs",
    "growth and operations jobs",
    "financial technology careers",
    "cash flow operating system",
    "African FinTech",
    "African technology",
  ],

  alternates: {
    canonical: `${siteUrl}/careers`,
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: `${siteUrl}/careers`,
    siteName: "Monietar",
    title: "Careers at Monietar | The Cash Flow Operating System",
    description:
      "Help build the cash flow operating system for African businesses. Join Monietar and work on real problems across engineering, product, design, growth, and operations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Careers at Monietar - The Cash Flow Operating System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Careers at Monietar | The Cash Flow Operating System",
    description:
      "Join Monietar and help build the cash flow operating system for African businesses.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}