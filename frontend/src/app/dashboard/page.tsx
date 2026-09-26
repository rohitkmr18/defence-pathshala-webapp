import { Database, Pencil, Target } from "lucide-react";

import ContinuePreparationHero from "@/components/dashboard/ContinuePreparationHero";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
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
  const primaryExam =
    profile.target_exams?.[0] || "Choose your target exam";

  const displayName =
    profile.full_name ||
    user?.email?.split("@")[0] ||
    "Aspirant";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        {/* Hero Banner with live synchronized Accuracy */}
        <ContinuePreparationHero
          name={displayName}
          exam={primaryExam}
          targetYear={profile.target_year}
          lastTopic="Start your first practice"
        />

        {/* Learning Hub Quick Actions */}
        <section className="mt-10">
          <SectionHeader
            eyebrow="Learning Hub"
            title="Choose your next step"
            description="Everything you need for today's preparation."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <QuickActionCard
              href="/dashboard/question-bank"
              title="PYQ Insights"
              description="Explore 730 PYQs with subject, topic and difficulty insights."
              icon={Database}
              badge="730 PYQs"
            />

            <QuickActionCard
              href="/dashboard/practice"
              title="Targeted Practice"
              description="Generate UPSC-standard mocks instantly."
              icon={Pencil}
            />

            <QuickActionCard
              href="/dashboard"
              title="Weak Areas"
              description="Focus on high-yield revision."
              icon={Target}
            />
          </div>
        </section>

        {/* Live Mock Performance & AI Insights Hub */}
        <section className="mt-10">
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