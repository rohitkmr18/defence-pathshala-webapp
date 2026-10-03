import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard – Defence Pathshala",
  description:
    "Your personal PYQ Intelligence dashboard. Access practice sessions, question bank and analytics.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}