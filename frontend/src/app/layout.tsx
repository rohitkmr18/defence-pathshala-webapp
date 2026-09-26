import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.defencepathshala.in"),

  title: {
    default: "Defence Pathshala | PYQ Intelligence Platform for CDS, CAPF & NDA",
    template: "%s | Defence Pathshala",
  },

  description:
    "Analyze CDS, CAPF and NDA previous year questions with topic-wise filters, full-paper practice, and AI-powered performance analytics.",

  keywords: [
    "CDS PYQ",
    "CAPF Previous Year Questions",
    "NDA PYQ",
    "Defence Pathshala",
    "CDS Mock Test",
    "CAPF AC Preparation",
    "UPSC CAPF",
    "Defence Exams",
    "PYQ Analysis",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://www.defencepathshala.in",
    title: "Defence Pathshala | PYQ Intelligence Platform",
    description:
      "Practice smarter with topic-wise PYQ analysis, full-paper mocks, and performance analytics.",
    siteName: "Defence Pathshala",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Defence Pathshala",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Defence Pathshala",
    description:
      "CDS • CAPF • NDA PYQ Intelligence Platform",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  manifest: "/manifest.webmanifest",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-icon.png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Defence Pathshala",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563EB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overscroll-none">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Defence Pathshala",
              url: "https://www.defencepathshala.in",
              logo: "https://www.defencepathshala.in/logo.png",
              image: "https://www.defencepathshala.in/og-image.png",
              description:
                "AI-powered PYQ Intelligence Platform for CDS, CAPF and NDA aspirants.",
              slogan: "Learn | Prepare | Serve",
              sameAs: [
                "https://www.instagram.com/defencepathshala_",
                "https://www.youtube.com/@defencepathshala3471",
              ],
              knowsAbout: [
                "CDS Preparation",
                "CAPF AC Preparation",
                "NDA Preparation",
                "Previous Year Questions",
                "Current Affairs",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Defence Pathshala",
              url: "https://www.defencepathshala.in",
            }),
          }}
        />
        {children}
        <GoogleAnalytics gaId="G-22KSG5GLDT" />
      </body>
    </html>
  );
}