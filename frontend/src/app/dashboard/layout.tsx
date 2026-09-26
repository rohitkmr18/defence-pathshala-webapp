import DashboardShell from "@/components/layout/DashboardShell";

export const metadata = {
  title: "Dashboard – Defence Pathshala",
  description:
    "Your personal PYQ Intelligence dashboard. Access practice sessions, question bank and analytics.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}