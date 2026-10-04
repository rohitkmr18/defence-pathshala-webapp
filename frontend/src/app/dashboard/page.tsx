import LearnerDashboardOverview from "@/components/dashboard/LearnerDashboardOverview";
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
      </div>
    </main>
  );
}
