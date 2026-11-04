import Link from "next/link";
import type { Metadata } from "next";
import ExamModeSwitcher from "@/components/layout/ExamModeSwitcher";
import AfcatCtaLink from "@/components/afcat/AfcatCtaLink";
import AfcatLandingTracker from "@/components/afcat/AfcatLandingTracker";
import { ArrowRight, BarChart3, Brain, Clock3, FileCheck2, Target, Timer } from "lucide-react";

export const metadata: Metadata = {
  title: "AFCAT Full Mock 01, free",
  description: "A free full-length AFCAT mock: 100 questions, 120 minutes, +3/−1 marking, with a detailed analysis the moment you submit.",
  alternates: { canonical: "/afcat" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://www.defencepathshala.in/afcat",
    siteName: "Defence Pathshala",
    title: "AFCAT Full Mock 01 — free, 100 questions, with analysis",
    description: "100 questions, 120 minutes, +3/−1 marking. Free full-length AFCAT mock with a detailed analysis the moment you submit.",
    images: [{ url: "/og/afcat-full-mock-01.png", width: 1200, height: 630, alt: "AFCAT Full Mock 01 — free full-length mock by Defence Pathshala" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AFCAT Full Mock 01 — free full-length mock",
    description: "100 questions, 120 minutes, +3/−1 marking, instant analysis.",
    images: ["/og/afcat-full-mock-01.png"],
  },
};

const stats = [
  { value: "100", label: "Questions" },
  { value: "120", label: "Minutes" },
  { value: "300", label: "Marks" },
  { value: "+3 / −1", label: "Marking" },
];
const sections = [
  { name: "General Awareness", count: 25, note: "History, geography, polity, science, defence and 2026 current affairs" },
  { name: "English", count: 30, note: "Comprehension, cloze test, error spotting, vocabulary" },
  { name: "Numerical Ability", count: 20, note: "Percentages, time and work, interest, mensuration, probability" },
  { name: "Reasoning & Military Aptitude", count: 25, note: "Verbal reasoning plus figure-based spatial questions" },
];
const afterwards = [
  { icon: Target, title: "Your score, the honest way", text: "Marks, accuracy and how many marks wrong guesses cost you." },
  { icon: BarChart3, title: "Section and topic breakdown", text: "See exactly which sections and topics lost you marks." },
  { icon: Timer, title: "Where your time went", text: "Time on every question, so you can spot the ones that drained it." },
  { icon: Brain, title: "Next steps and explanations", text: "Up to three actions drawn from your own numbers, and a worked explanation for every question." },
];

export default function AfcatPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <AfcatLandingTracker />
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold">
            <span className="rounded-lg bg-blue-600 px-2.5 py-2 text-white">DP</span>
            Defence Pathshala
          </Link>
          <div className="w-48"><ExamModeSwitcher compact /></div>
        </div>
      </header>

      <section className="bg-[#081b35] text-white" aria-labelledby="afcat-hero">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
          <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
            Free · No payment needed
          </span>
          <h1 id="afcat-hero" className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
            AFCAT Full Mock 01
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            A full-length simulation in the AFCAT pattern: 100 questions, 120 minutes, four sections. Submit it and you get a detailed analysis straight away.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <AfcatCtaLink href="/afcat/lab" placement="hero"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-8 text-base font-bold text-white shadow-lg shadow-blue-900/40 transition hover:bg-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Attempt Full Mock for Free <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </AfcatCtaLink>
            <p className="flex items-center gap-2 text-sm text-slate-400">
              <Clock3 className="h-4 w-4" aria-hidden="true" /> Keep 2 uninterrupted hours
            </p>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <dd className="text-2xl font-black sm:text-3xl">{s.value}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-slate-400">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6">
        <section aria-labelledby="afcat-paper">
          <h2 id="afcat-paper" className="text-2xl font-black tracking-tight">What is in the paper</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-bold">{s.name}</h3>
                  <span className="shrink-0 text-sm font-bold text-blue-700">{s.count} Qs</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{s.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="afcat-after">
          <h2 id="afcat-after" className="text-2xl font-black tracking-tight">What you get after you submit</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {afterwards.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <span className="h-fit rounded-xl bg-blue-50 p-3 text-blue-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-600">
          <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <p>
            Original questions written by Defence Pathshala in the AFCAT pattern. This is practice, not an official paper, and the score does not predict your AFCAT result or cut-off. Your answers save automatically and the timer is kept on the server, so a refresh will not cost you time.
          </p>
        </div>
      </div>
    </main>
  );
}
