import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abyandimas.me'), // Replace with actual domain
  title: {
    default: "Abyan Dimas | Personal Blog",
    template: "%s | Abyan Dimas"
  },
  description: "Portfolio of Abyan Dimas, a Cloud Engineer and Web Developer specializing in AWS, Next.js, and DevOps.",
  openGraph: {
    title: "Abyan Dimas | Personal Blog",
    description: "Explore the portfolio of Abyan Dimas. Cloud Engineering, Web Development, and featured projects.",
    url: 'https://abyandimas.me',
    siteName: 'Abyan Dimas Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/banner.png', // Uses the banner we updated earlier
        width: 1200,
        height: 630,
        alt: 'Abyan Dimas Portfolio Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Abyan Dimas | Personal Blog",
    description: "Cloud Engineer & Web Developer. Check out my projects and services.",
    images: ['/banner.png'],
  },
  icons: {
    icon: '/avatar.png',
  },
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased transition-colors duration-300`}>
        <Providers>
          <Header />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
