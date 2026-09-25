import DashboardShell from "@/components/layout/DashboardShell";

export const metadata = {
  title: "About Defence Pathshala | Strategic Intelligence & Officer Mentorship",
  description:
    "Learn about Defence Pathshala's mission, vision, AI-driven PYQ methodology, roadmap, and leadership.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
