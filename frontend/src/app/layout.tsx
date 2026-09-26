import type { Metadata, Viewport } from "next";
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
  title: "Defence Pathshala – PYQ Intelligence for UPSC Defence Exams",
  description:
    "Practice smarter with AI-powered PYQ analysis for CDS, CAPF AC, NDA and AFCAT. Built by an IIT Kanpur graduate and BSF Officer who cleared CAPF AC with AIR 163.",
  keywords: [
    "UPSC defence exam preparation",
    "CDS PYQ",
    "CAPF AC preparation",
    "NDA previous year questions",
    "AFCAT practice",
    "defence exam coaching",
    "PYQ intelligence",
  ],
  authors: [{ name: "Defence Pathshala" }],
  openGraph: {
    title: "Defence Pathshala – PYQ Intelligence",
    description:
      "AI-powered PYQ analysis for CDS, CAPF AC, NDA and AFCAT. Built by someone who cleared these exams.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overscroll-none">{children}</body>
    </html>
  );
}
