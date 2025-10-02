import type { Metadata } from "next";
import { Plaster } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const plaster = Plaster({
  subsets: ["latin"],
  weight: "400",
  variable: '--font-plaster',
});

export const metadata: Metadata = {
  title: "Monietar | Master Your Business Finances",
  description: "All Your Transaction in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plaster.variable}>
      <body className={`font-plaster antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}