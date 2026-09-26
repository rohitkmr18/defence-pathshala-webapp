import Link from "next/link";
import {
  ArrowRight,
  Shield,
  CheckCircle2,
  BarChart3,
  Zap,
  BookOpen,
  Sparkles,
} from "lucide-react";
import HeroStats from "@/components/home/HeroStats";
import ProductShowcase from "@/components/home/ProductShowcase";
import PostMockAnalyticsShowcase from "@/components/home/PostMockAnalyticsShowcase";
import FounderCredibility from "@/components/home/FounderCredibility";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white text-sm font-black shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              DP
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Defence Pathshala
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Login
            </Link>
            <Link
              href="/dashboard/practice"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500 active:scale-95"
            >
              Start Practicing Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Part 1) ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-24 lg:px-8 lg:pt-28 lg:pb-32 text-white">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-sm shadow-sm">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            UPSC CDS &bull; CAPF AC &bull; NDA
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl text-white">
            India&apos;s First{" "}
            <span className="relative inline-block bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-300 bg-clip-text text-transparent font-extrabold underline decoration-blue-500/30 underline-offset-8">
              PYQ Intelligence Platform
            </span>{" "}
            for Defence Exams
          </h1>

          {/* Subheadline: max-w around 700px */}
          <p className="mt-6 max-w-[700px] mx-auto text-base sm:text-lg leading-relaxed text-slate-300">
            Analyze thousands of CDS, CAPF and NDA Previous Year Questions with topic-wise filtering, full-paper practice, difficulty insights and performance analytics—all in one platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {/* Primary CTA (Dominant large filled button) */}
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-xl shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:scale-105 hover:shadow-blue-600/40 active:scale-95"
            >
              Start Practicing Free
              <ArrowRight className="h-5 w-5 text-white" />
            </Link>

            {/* Secondary CTA (Visually subordinate) */}
            <Link
              href="/dashboard/question-bank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/25"
            >
              Explore PYQs
            </Link>
          </div>

          {/* Hero Stats (3 Cards) */}
          <HeroStats />

          {/* Trust points line */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            {["No Credit Card Required", "Instant Topic Filtering", "Accurate Official Keys", "Free to Explore"].map(
              (badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {badge}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── Credentials Banner (Second Banner - Built from Real Field Experience) ─ */}
      <FounderCredibility />

      {/* ── Product Showcase (See the Intelligence in Action) ──── */}
      <ProductShowcase />

      {/* ── Post-Mock Performance Analytics (Heatmap & Subject Audit) ────── */}
      <PostMockAnalyticsShowcase />

      {/* ── How it works (The DP Method) ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white px-4 py-20 sm:px-6 sm:py-24 lg:px-8 border-t border-slate-200/80">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              The DP Methodology
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Data-driven. Exam-focused. Effective.
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Transform passive reading into targeted mastery with structured PYQ intelligence.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
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
                  "Practice filters let you drill down to exact exam-year-topic combinations. Zero wasted hours on topics that rarely appear.",
              },
              {
                icon: BookOpen,
                step: "03",
                title: "Review and Improve",
                description:
                  "After each session, evaluate detailed cognitive breakdowns to build consistent improvement and peak exam readiness.",
              },
            ].map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                    STEP {step}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
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

      {/* ── Final Call to Action ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8 border-t border-slate-200/80">
        <div className="relative mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-white shadow-2xl backdrop-blur-md sm:p-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold text-blue-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            FREE ACCESS &bull; NO BARRIERS
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl text-white">
            Start preparing smarter today
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Explore 730+ PYQ insights and the question bank freely. Create an account when you want to save practice history and generate custom mocks.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
            >
              Start Practicing Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/question-bank"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore PYQs
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200/80 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-black shadow-xs">
              DP
            </div>
            <span className="font-semibold text-slate-800">
              Defence Pathshala
            </span>
            <span>&bull; India&apos;s First PYQ Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-blue-600 transition">
              About
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/question-bank" className="hover:text-blue-600 transition">
              Question Bank
            </Link>
            <Link href="/auth/login" className="hover:text-blue-600 transition">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
