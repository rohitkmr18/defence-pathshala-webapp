import DashboardShell from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Daily Current Affairs | Defence Pathshala",
  description:
    "Authentic exam-focused daily visual current affairs updates for UPSC CDS, CAPF AC, NDA, and AFCAT.",
};

export default function CurrentAffairsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
