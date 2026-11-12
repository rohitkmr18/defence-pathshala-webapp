import DashboardShell from "@/components/layout/DashboardShell";

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
