import Link from "next/link";
import type { Metadata } from "next";
import ExamModeSwitcher from "@/components/layout/ExamModeSwitcher";
import { BookOpenCheck, ClipboardList, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "AFCAT Test Series — Defence Pathshala",
  description: "AFCAT sectional tests and full mocks. Product preview — tests are not yet available.",
  robots: { index: false, follow: true },
};

const offerings = [
  { title: "Sectional Tests", icon: BookOpenCheck, count: "20 tests", questions: "500 unique questions",
    description: "English, General Awareness, Numerical Ability, and Reasoning & Military Aptitude." },
  { title: "Full Mocks", icon: ClipboardList, count: "5 mocks", questions: "500 additional questions",
    description: "Five fixed 100-question AFCAT simulations, each with a 120-minute timer." },
];

export default function AfcatPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold">
            <span className="rounded-lg bg-blue-600 px-2.5 py-2 text-white">DP</span>
            Defence Pathshala
          </Link>
          <div className="w-48"><ExamModeSwitcher compact /></div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to UPSC workspace
        </Link>
        <div className="mt-8 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">AFCAT Exam Mode</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">AFCAT Test Series</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A dedicated AFCAT workspace, separate from Defence Pathshala's official UPSC PYQ collection.
            The test series is being prepared and is not available for attempts yet.
          </p>
        </div>
        <section aria-label="AFCAT test offerings" className="mt-10 grid gap-5 md:grid-cols-2">
          {offerings.map(({ title, icon: Icon, count, questions, description }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700"><Icon className="h-6 w-6" aria-hidden="true" /></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Coming soon</span>
              </div>
              <h2 className="mt-6 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm font-semibold text-blue-700">{count} · {questions}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">Test access will be enabled after content and technical validation.</p>
            </article>
          ))}
        </section>
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <p>All AFCAT questions will undergo editorial and answer-key review before release. Sectional and full-mock question pools will not overlap.</p>
        </div>
      </div>
    </main>
  );
}
