import Link from "next/link";
import type { Metadata } from "next";
import ExamModeSwitcher from "@/components/layout/ExamModeSwitcher";
import AfcatCtaLink from "@/components/afcat/AfcatCtaLink";
import AfcatLandingTracker from "@/components/afcat/AfcatLandingTracker";
import AfcatMockCatalogue from "@/components/afcat/AfcatMockCatalogue";
import DPLogo from "@/components/common/DPLogo";
import PublicExploreLinks from "@/components/public/PublicExploreLinks";
import { ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Clock3, ShieldCheck, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "AFCAT Mock Tests, Results & Preparation",
  description: "Prepare for AFCAT with published full-length mock tests, saved attempts, section-wise analysis and clear next steps. Explore live AFCAT mocks on Defence Pathshala.",
  alternates: { canonical: "/afcat" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.defencepathshala.in/afcat",
    siteName: "Defence Pathshala",
    title: "AFCAT Preparation & Full-Length Mock Tests | Defence Pathshala",
    description: "Attempt published AFCAT mocks, review saved scores and learn from detailed performance analysis.",
    images: [{ url: "/og/afcat-full-mock-01.png", width: 1200, height: 630, alt: "Defence Pathshala AFCAT mock test preparation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFCAT Preparation & Full-Length Mock Tests",
    description: "Explore AFCAT full mocks and review your performance on Defence Pathshala.",
    images: ["/og/afcat-full-mock-01.png"],
  },
};

const benefits = [
  { icon: Target, title: "Attempt a realistic mock", description: "Practice with full-length AFCAT-pattern questions and a server-controlled exam timer." },
  { icon: BarChart3, title: "Understand your performance", description: "Review your score, section accuracy, individual answers and question time after submission." },
  { icon: BookOpenCheck, title: "Know what to revise", description: "Use your topic-level results to identify which concepts need attention before your next attempt." },
];

const sections = [
  "General Awareness",
  "English",
  "Numerical Ability",
  "Reasoning & Military Aptitude",
];

export default function AfcatPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <AfcatLandingTracker />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/afcat" className="flex min-w-0 items-center gap-2 text-sm font-extrabold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <DPLogo className="h-8 w-auto shrink-0" />
            <span className="hidden sm:inline">Defence Pathshala</span>
            <span className="sr-only sm:hidden">Defence Pathshala AFCAT</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link href="/afcat/dashboard" className="inline-flex min-h-11 items-center text-xs font-bold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-sm">My dashboard</Link>
            <ExamModeSwitcher compact />
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#081b35] text-white" aria-labelledby="afcat-hero">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-48 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-blue-200">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> AFCAT preparation
          </p>
          <h1 id="afcat-hero" className="mt-5 max-w-4xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Don&apos;t just attempt AFCAT mocks. <span className="text-blue-300">Know what to improve.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
            Practice with published AFCAT full-length mock tests, return to your saved attempts, and learn from detailed score and topic analysis.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AfcatCtaLink href="#available-mocks" placement="hero_catalogue"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-6 py-3 text-base font-extrabold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Explore AFCAT mocks <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </AfcatCtaLink>
            <Link href="/afcat/dashboard" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              View my performance
            </Link>
          </div>
          <p className="mt-6 flex max-w-xl items-start gap-2 text-xs leading-5 text-slate-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Independent AFCAT-pattern practice, not an official Indian Air Force examination or predicted cut-off.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 sm:py-16">
        <AfcatMockCatalogue />

        <section aria-labelledby="afcat-method-heading">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">A better practice loop</p>
            <h2 id="afcat-method-heading" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Attempt. Analyse. Improve.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">One mock should tell you more than a score. Use evidence from your answers to decide what to study next.</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-2xl bg-blue-50 p-3 text-blue-700"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <span className="font-mono text-sm font-bold text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black tracking-tight">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="afcat-pattern-heading" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700">Know the exam</p>
              <h2 id="afcat-pattern-heading" className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Four areas. One preparation journey.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">Practice across the core AFCAT areas. The live mock cards above show the actual question count, duration and available marks for each published paper.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
              <Clock3 className="h-4 w-4" aria-hidden="true" /> Timed practice
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {sections.map((name) => (
              <li key={name} className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" /> {name}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="afcat-final-cta" className="rounded-3xl bg-[#0b2444] px-6 py-9 text-white sm:px-10">
          <h2 id="afcat-final-cta" className="text-2xl font-black tracking-tight sm:text-3xl">Ready to see where you stand?</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200">Explore the published AFCAT mocks, begin a test when you have time, and review your performance after submission.</p>
          <AfcatCtaLink href="#available-mocks" placement="footer_catalogue"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-bold text-white hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            See available mocks <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AfcatCtaLink>
        </section>

        <p className="text-xs leading-6 text-slate-500">
          Defence Pathshala prepares original AFCAT-pattern practice questions. It is not affiliated with the Indian Air Force or the official AFCAT examination. Scores are practice feedback, not exam-result predictions. Your answers and examination deadline are maintained by the server when you start a mock.
        </p>
      </div>
      <PublicExploreLinks className="border-t border-slate-200" heading="More defence exam practice" />
    </main>
  );
}
