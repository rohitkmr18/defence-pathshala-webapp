import { getServerProfile } from "@/lib/profile-server";
import { signOut } from "@/app/actions/auth";

import WelcomeHero from "@/components/dashboard/WelcomeHero";
import TargetExamsCard from "@/components/dashboard/TargetExamsCard";
import TargetYearCard from "@/components/dashboard/TargetYearCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import ContinueSessionCard from "@/components/dashboard/ContinueSessionCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";

export default async function DashboardPage() {
  const { profile, user } = await getServerProfile();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* Top Navigation */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
              Defence Pathshala
            </p>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
            >
              Sign Out
            </button>
          </form>
        </header>

        {/* Welcome Hero */}
        <WelcomeHero
          name={profile.full_name || user.email || "Aspirant"}
          exams={profile.target_exams}
          targetYear={profile.target_year}
        />

        {/* Stats Row */}
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <TargetExamsCard exams={profile.target_exams} />
          <TargetYearCard targetYear={profile.target_year} />
          <ProgressCard progress={0} />
        </section>

        {/* Main Content */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ContinueSessionCard />
          </div>

          <RecentActivityCard />
        </section>

        {/* Coming Soon */}
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Coming Next
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Your PYQ Intelligence Dashboard
          </h2>

          <p className="mt-3 max-w-2xl text-gray-600">
            The next updates will unlock Subject Analytics, ESAC difficulty
            insights, Avoidable Marks Lost, Adaptive Revision, and AI-generated
            revision notes powered by Defence Pathshala's proprietary 730-question
            intelligence engine.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              "Subject Analytics",
              "Avoidable Marks Lost",
              "Adaptive Revision",
              "Revision Notes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 p-4"
              >
                <p className="font-medium">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}