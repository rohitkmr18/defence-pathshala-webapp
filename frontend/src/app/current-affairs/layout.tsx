import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";

export const metadata: Metadata = {
  title: "Daily Current Affairs | Defence Pathshala",
  description:
    "Exam-focused daily current affairs for CDS, CAPF AC, NDA and AFCAT with structured key facts, static linkages and daily MCQs.",
  alternates: {
    canonical: "/current-affairs",
  },
};

export default function CurrentAffairsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
