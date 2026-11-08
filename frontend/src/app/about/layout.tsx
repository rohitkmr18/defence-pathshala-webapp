import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata({
  title: "About Us | Strategic Intelligence & Officer Mentorship",
  description:
    "Learn about Defence Pathshala's mission, vision, AI-driven PYQ methodology, roadmap, and leadership.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
