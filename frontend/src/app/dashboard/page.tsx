import LearnerDashboardOverview from "@/components/dashboard/LearnerDashboardOverview";
import MockPerformanceHub from "@/components/dashboard/MockPerformanceHub";
import SectionHeader from "@/components/ui/SectionHeader";
import { getSafeProfile } from "@/lib/profile-server";

export const metadata = {
  title: "Dashboard – Defence Pathshala",
  description:
    "Your personal PYQ Intelligence dashboard. Access practice sessions, question bank and analytics.",
};

export default async function DashboardPage() {
  const { profile, user } = await getSafeProfile();
  const displayName =
    profile.full_name ||
    user?.email?.split("@")[0] ||
    "Aspirant";
  const firstName = displayName.trim().split(" ")[0] || "Aspirant";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <LearnerDashboardOverview
          firstName={firstName}
          targetExams={profile.target_exams || []}
        />

        <section id="performance-coach" className="mt-10 scroll-mt-20">
          <SectionHeader
            eyebrow="DP Performance Coach"
            title="Mock Test Analytics & Diagnostics"
            description="Live performance trajectory, recurring weak spots, and recovery upside across your attempts."
          />
          <div className="mt-6">
            <MockPerformanceHub />
          </div>
        </section>
      </div>
    </main>
  );
}
