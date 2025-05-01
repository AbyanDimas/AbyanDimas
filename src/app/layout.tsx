import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abyan | Cloud Engineer Portfolio",
  description:
    "Professional portfolio of Abyan, showcasing cloud computing expertise and projects.",
  keywords: [
    "Cloud Engineer",
    "Portfolio",
    "AWS",
    "Azure",
    "GCP",
    "Cloud Computing",
    "DevOps",
    "Server Solutions",
  ],
  authors: [{ name: "Abyan" }],
  openGraph: {
    title: "Abyan Dimas R Mussyafa",
    description:
      "Professional portfolio showcasing cloud computing expertise and projects.",
    url: "https://yourportfolio.com",
    siteName: "Abyan Portfolio",
    images: [
      {
        url: "https://yourportfolio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Abyan Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abyan | Cloud Engineer Portfolio",
    description:
      "Professional portfolio showcasing cloud computing expertise and projects.",
    creator: "@yourtwitter",
    images: ["https://yourportfolio.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Abyan",
              jobTitle: "Cloud Engineer",
              url: "https://yourportfolio.com",
              sameAs: [
                "https://github.com/yourusername",
                "https://linkedin.com/in/yourusername",
                "https://twitter.com/yourusername",
              ],
              description:
                "Professional cloud engineer with expertise in AWS, Azure, and GCP solutions.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights/>
      </body>
    </html>
  );
}
