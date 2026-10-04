import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  Target,
} from "lucide-react";

const outcomes = [
  {
    icon: Database,
    title: "See what UPSC actually repeats",
    copy: "Explore PYQs by exam, subject and topic before deciding what deserves revision time.",
  },
  {
    icon: Target,
    title: "Turn insight into practice",
    copy: "Launch a targeted PYQ set directly from the same exam and topic context.",
  },
  {
    icon: Brain,
    title: "Understand every attempt",
    copy: "Check the answer, explanation, taxonomy and exam-relevant intelligence without breaking the learning loop.",
  },
];

export default function LoggedOutDashboard() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
              <BarChart3 className="h-3.5 w-3.5" />
              PYQ Intelligence for defence exams
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Don&apos;t just solve PYQs.
              <span className="block bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                Let them tell you what to study next.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Defence Pathshala connects exploration, practice, answer review and
              performance intelligence into one preparation loop for CDS and CAPF.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/question-bank"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400"
              >
                Explore PYQs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/practice"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Try Targeted Practice
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                1,821 structured PYQs
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Exam-aware practice
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                No account required to explore
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
              What changes after you sign in
            </p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Next Best Move
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Your dashboard stops being a menu.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Saved attempts and sessions become a deterministic preparation
                coach: resume unfinished work, review unresolved mistakes, or
                strengthen a weak high-value topic.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                ["Attempts", "Saved"],
                ["Mistakes", "Resolved"],
                ["Weak Areas", "Ranked"],
                ["Mocks", "Tracked"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] p-4"
                >
                  <p className="text-xs font-semibold text-slate-400">{label}</p>
                  <p className="mt-1 text-lg font-black text-white">{value}</p>
                </div>
              ))}
            </div>

            <Link
              href="/auth/login?next=%2Fdashboard"
              className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-blue-50"
            >
              Save My Progress
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Email code login · no password to remember
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            One connected preparation loop
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Explore → Practise → Understand → Improve
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            You can inspect the platform before creating an account. Sign in only
            when you want DP to preserve attempts, mistakes and performance across
            sessions and devices.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {outcomes.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
