import { Database, Pencil, Newspaper, Target } from "lucide-react";

import ContinuePreparationHero from "@/components/dashboard/ContinuePreparationHero";
import QuickActionCard from "@/components/dashboard/QuickActionCard";
import MockPerformanceHub from "@/components/dashboard/MockPerformanceHub";
import SectionHeader from "@/components/ui/SectionHeader";
import StatCard from "@/components/ui/StatCard";

import { getServerProfile } from "@/lib/profile-server";
import { getAnalytics } from "@/lib/analytics";
import { signOut } from "@/app/actions/auth";

export default async function DashboardPage() {
  const { profile, user } = await getServerProfile();
  const analytics = await getAnalytics();
  const primaryExam =
    profile.target_exams?.[0] || "Choose your target exam";

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <ContinuePreparationHero
          name={profile.full_name || user.email?.split("@")[0] || "Aspirant"}
          exam={primaryExam}
          targetYear={profile.target_year}
          accuracy={analytics.accuracy}
          lastTopic="Start your first practice"
        />

        <section className="mt-10">
          <SectionHeader
            eyebrow="Learning Hub"
            title="Choose your next step"
            description="Everything you need for today's preparation."
          />

          <div className="grid gap-6 md:grid-cols-2">
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
              href="/current-affairs"
              title="Daily Current Affairs"
              description="Today's UPSC-relevant defence & strategic updates."
              icon={Newspaper}
            />

            <QuickActionCard
              href="/dashboard"
              title="Weak Areas"
              description="Resume revision from your weakest topics."
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

        <section className="mt-10">
          <SectionHeader
            eyebrow="Your Progress"
            title="Preparation Snapshot"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Accuracy"
              value={`${analytics.accuracy}%`}
            />

            <StatCard
              label="Questions Attempted"
              value={analytics.questions_attempted}
            />

            <StatCard
              label="Current Streak"
              value={analytics.current_streak}
            />

            <StatCard
              label="Avoidable Marks"
              value={analytics.avoidable_marks}
            />
          </div>
        </section>
      </div>
    </main>
  );
}