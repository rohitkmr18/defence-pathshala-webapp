import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";

export const metadata: Metadata = {
  title: "About Us | Strategic Intelligence & Officer Mentorship",
  description:
    "Learn about Defence Pathshala's mission, vision, AI-driven PYQ methodology, roadmap, and leadership.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
