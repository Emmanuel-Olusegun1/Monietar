import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import RegisterSW from './register-sw';
import ServiceWorkerRegistration from './ServiceWorkerRegistration'

export const metadata: Metadata = {
  title: "Monietar | Master Your Business Finances",
  description: "All Your Transaction in one place",
  manifest: '/manifest.json',
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
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Monietar" />
        </head>
      <body className="antialiased">
        {children}
        <Analytics />
        <RegisterSW />
        <SpeedInsights/>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}