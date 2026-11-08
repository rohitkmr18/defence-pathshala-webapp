import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import { pageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = pageMetadata({
  title: "Daily Current Affairs for Defence Exams",
  description:
    "Exam-focused daily current affairs for CDS, CAPF AC, NDA and AFCAT with structured key facts, static linkages and daily MCQs.",
  path: "/current-affairs",
});

export default function CurrentAffairsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
