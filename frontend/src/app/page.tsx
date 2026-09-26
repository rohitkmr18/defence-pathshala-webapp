import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Pencil,
  Shield,
  CheckCircle2,
  GraduationCap,
  Award,
  BarChart3,
  Zap,
  BookOpen,
} from "lucide-react";

// ─── Feature Card ──────────────────────────────────────────────────────────────

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  href: string;
}

function FeatureCard({ icon: Icon, title, description, badge, href }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        {badge && (
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors">{title}</h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:text-blue-700">
        Explore
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

// ─── Credential Badge ──────────────────────────────────────────────────────────

function CredBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200/80 bg-blue-50/50 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-2xs">
      <GraduationCap className="h-3.5 w-3.5 text-blue-600 shrink-0" />
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20">
              DP
            </div>
            <span className="hidden text-sm font-bold text-slate-900 sm:block">
              Defence Pathshala
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              Let&apos;s Start
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        {/* Background glows */}
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-sm">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            AI-Powered UPSC Defence Exam Preparation
          </div>

          {/* Headline */}
          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Practice with intelligence,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              not guesswork.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Defence Pathshala uses data-driven PYQ analysis to help you
            prepare for CDS, CAPF AC, NDA and AFCAT — built by someone who
            has actually cleared these exams.
          </p>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.97]"
            >
              Let&apos;s Start
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              About the Platform
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            {["730+ PYQs Analysed", "4 Exams Covered", "AI-Powered Insights", "Free to Explore"].map(
              (badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {badge}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              What you get
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Everything you need for smart preparation
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              No login required to explore. Start practising when you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Database}
              title="PYQ Insights"
              description="Explore 730+ questions with subject, topic, difficulty and year-wise analysis. Understand exactly what the exam tests."
              badge="730+ PYQs"
              href="/dashboard/question-bank"
            />
            <FeatureCard
              icon={Pencil}
              title="Targeted Practice"
              description="Generate custom mocks filtered by exam, year, subject or topic. Practice the way the exam demands."
              href="/dashboard/practice"
            />
            <FeatureCard
              icon={Shield}
              title="About Us"
              description="Learn about the mission, methodology and the founder behind Defence Pathshala."
              href="/about"
            />
          </div>
        </div>
      </section>

      {/* ── Founder Credibility ───────────────────────────────────────────── */}
      <section className="bg-slate-50/60 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Why trust us
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Built by someone who has walked the path
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Not a coaching centre. Not a startup guess. Defence Pathshala was
              built after clearing these exams — and analysing thousands of PYQs
              to understand what really matters.
            </p>
          </div>

          {/* Founder card */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            <div className="flex flex-col gap-8 p-7 sm:p-10 md:flex-row md:items-start">
              {/* Photo */}
              <div className="flex shrink-0 flex-col items-center text-center md:items-start md:text-left">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl ring-4 ring-blue-600/10">
                  <Image
                    src="/images/rohit-kumar.jpg"
                    alt="Rohit Kumar - Founder"
                    width={120}
                    height={120}
                    priority
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
                <span className="mt-3.5 inline-block rounded-full border border-blue-200/80 bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wide text-blue-700 shadow-2xs">
                  AIR 163 · CAPF AC
                </span>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                    <Award className="h-3.5 w-3.5" />
                    Founder
                  </div>
                  <h3 className="mt-2.5 text-2xl font-black tracking-tight text-slate-900">
                    Rohit Kumar
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-blue-600">
                    BSF Assistant Commandant · IIT Kanpur · Defence Educator
                  </p>
                </div>

                {/* Credential chips */}
                <div className="flex flex-wrap gap-2">
                  <CredBadge>IIT Kanpur — Mechanical Engineering</CredBadge>
                  <CredBadge>BSF Assistant Commandant</CredBadge>
                  <CredBadge>CAPF AC AIR 163</CredBadge>
                  <CredBadge>4× CDS Qualified</CredBadge>
                  <CredBadge>AI + Data PYQ Analysis</CredBadge>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  After clearing CAPF AC with AIR 163 and qualifying CDS four
                  times, I noticed that most aspirants were preparing
                  inefficiently — repeating the wrong topics and ignoring
                  patterns hidden in thousands of PYQs. I built Defence
                  Pathshala using AI and data analysis to surface those patterns
                  so you can prepare with precision.
                </p>

                <blockquote className="rounded-r-2xl border-l-4 border-blue-600 bg-slate-50 px-4 py-3 text-sm font-medium italic text-slate-800">
                  &ldquo;The best preparation isn&apos;t the hardest preparation
                  — it&apos;s the most targeted.&rdquo;
                </blockquote>
              </div>
            </div>

            {/* Stat strip */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 sm:grid-cols-4">
              {[
                { value: "AIR 163", label: "CAPF AC Rank" },
                { value: "4×", label: "CDS Cleared" },
                { value: "730+", label: "PYQs Analysed" },
                { value: "IIT Kanpur", label: "Mechanical Engineering" },
              ].map(({ value, label }) => (
                <div key={label} className="px-6 py-5 text-center">
                  <p className="text-xl font-black text-slate-900">{value}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof line */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Built by someone who has <strong className="text-slate-800">cleared the exams</strong> — not just taught them.
          </p>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The DP method
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Data-driven. Exam-focused. Effective.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: BarChart3,
                step: "01",
                title: "Analyse PYQ Patterns",
                description:
                  "Every question is tagged by subject, topic, difficulty and year. Understand what the exam actually tests — not what coaching centres guess.",
              },
              {
                icon: Zap,
                step: "02",
                title: "Target Your Weak Areas",
                description:
                  "Practice filters let you drill down to exact exam-year-topic combinations. No wasted time on topics that never appear.",
              },
              {
                icon: BookOpen,
                step: "03",
                title: "Review and Improve",
                description:
                  "After each session, see where you went wrong. Use debrief analytics to build consistent improvement.",
              },
            ].map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    STEP {step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-slate-950 p-10 text-center text-white shadow-2xl sm:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-blue-300">
            <Shield className="h-3.5 w-3.5" />
            Free to explore. No credit card required.
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
            Start preparing smarter today
          </h2>

          <p className="mt-4 text-slate-400">
            Explore PYQ insights and the question bank — no
            login required. Create an account only when you&apos;re ready to
            start practice.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:scale-[1.02] active:scale-[0.97]"
            >
              Let&apos;s Start
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-black">
              DP
            </div>
            <span className="font-semibold text-slate-700">
              Defence Pathshala
            </span>
            <span>· PYQ Intelligence for UPSC Defence Exams</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-800 transition">
              About
            </Link>
            <Link href="/dashboard" className="hover:text-slate-800 transition">
              Dashboard
            </Link>
            <Link href="/auth/login" className="hover:text-slate-800 transition">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
