"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Repeat,
  Brain,
  Filter,
  Target,
  CheckCircle2,
  Layers,
  Search,
} from "lucide-react";

const TIMELINE_STEPS = [
  {
    step: "1",
    title: "Choose CDS, CAPF or NDA.",
    description: "Select your target exam and year in one click.",
  },
  {
    step: "2",
    title: "Instantly see topic recurrence, difficulty and intelligence breakdown.",
    description: "Every question displays repetition frequency and syllabus tags.",
  },
  {
    step: "3",
    title: "Get a revision roadmap instead of just a score.",
    description: "Target weak spots and avoidable negative marks right away.",
  },
];

const INTELLIGENCE_CARDS = [
  {
    id: "card-1",
    icon: Repeat,
    title: "Spot Recurring Questions",
    description: "See how often UPSC repeats a concept across years.",
  },
  {
    id: "card-2",
    icon: Brain,
    title: "Understand Why It Matters",
    description: "Every question carries structured intelligence—not just an answer.",
  },
  {
    id: "card-3",
    icon: Filter,
    title: "Filter Instantly",
    description: "Jump directly to topics instead of scrolling through PDFs.",
  },
  {
    id: "card-4",
    icon: Target,
    title: "Revise Smarter",
    description: "Turn insights into your next revision priority.",
  },
];

export default function IntelligenceEngineSection() {
  return (
    <section
      id="methodology"
      className="relative overflow-hidden bg-slate-50/60 py-20 sm:py-28 text-slate-900 border-t border-slate-200/80"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[550px] w-[700px] rounded-full bg-blue-500/5 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>EXPERIENCE THE INTELLIGENCE ENGINE</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Every PYQ Becomes Actionable Intelligence.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Don&apos;t just solve questions.
            <span className="block mt-1 sm:mt-1.5">
              Understand why they were asked, how often they&apos;re repeated, and exactly what to revise next.
            </span>
          </p>
        </div>

        {/* ── 3-Step Visual Timeline ───────────────────────────────────────── */}
        <div className="mb-14 sm:mb-18">
          <div className="relative">
            {/* Desktop connecting line between circles */}
            <div
              className="hidden md:block absolute top-5 left-16 right-16 h-0.5 bg-blue-200"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
              {TIMELINE_STEPS.map((item, idx) => (
                <div
                  key={item.step}
                  className="relative flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 rounded-2xl md:rounded-none border md:border-none border-slate-200 bg-white md:bg-transparent p-4 md:p-0 shadow-xs md:shadow-none"
                >
                  {/* Numbered blue circle */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-black text-sm shadow-md shadow-blue-600/20 ring-4 ring-white md:ring-slate-50">
                    {item.step}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Product Showcase (Large Question Explorer) ─────────────── */}
        <div className="mb-14 sm:mb-18">
          {/* Top 3 small chips */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Live Product
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              Official PYQs
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
              <Filter className="h-3.5 w-3.5 text-blue-600" />
              Smart Filters
            </span>
          </div>

          {/* Elevated Real UI Container */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-4 sm:p-7 lg:p-8 shadow-xl transition-all duration-300 hover:-translate-y-[3px] hover:shadow-2xl motion-reduce:transform-none motion-reduce:transition-none">
            {/* Window Chrome */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-2 hidden sm:flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono text-slate-500">
                  <Search className="h-3 w-3 text-slate-400" />
                  <span>defencepathshala.com/dashboard/question-bank</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                Interactive Preview
              </span>
            </div>

            {/* Exam Selector & Subject Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-500 font-semibold">Exam:</span>
                <span className="rounded-lg bg-blue-600 text-white font-bold px-3 py-1 shadow-xs">
                  CDS II 2024
                </span>
                <span className="rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium px-2.5 py-1">
                  CAPF AC 2024
                </span>
                <span className="rounded-lg border border-slate-200 bg-slate-50 text-slate-600 font-medium px-2.5 py-1">
                  NDA (II)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-semibold text-slate-700">
                  Subject: <strong className="text-slate-900">Polity</strong>
                </span>
                <span className="rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-bold text-blue-700">
                  Fundamental Rights
                </span>
              </div>
            </div>

            {/* Question Card Box */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-600 text-white text-xs font-black px-2 py-0.5 shadow-xs">
                    Q.42
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    CDS 2024 (II) &bull; General Studies Paper &bull; Set A
                  </span>
                </div>
                <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-0.5 shadow-2xs">
                  Moderate &bull; 62% Success Rate
                </span>
              </div>

              <p className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                Which one of the following writs is issued by the Supreme Court or High Court to command a public authority to perform a statutory duty that it has failed to execute?
              </p>

              {/* 4 Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 flex items-center gap-2 shadow-2xs">
                  <span className="font-bold text-slate-400">A</span>
                  <span>Habeas Corpus</span>
                </div>
                <div className="rounded-xl border border-blue-400 bg-blue-50 p-3 text-blue-900 font-bold flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">B</span>
                    <span>Mandamus</span>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 flex items-center gap-2 shadow-2xs">
                  <span className="font-bold text-slate-400">C</span>
                  <span>Quo-Warranto</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 flex items-center gap-2 shadow-2xs">
                  <span className="font-bold text-slate-400">D</span>
                  <span>Certiorari</span>
                </div>
              </div>

              {/* Real Intelligence Breakdown Panel */}
              <div className="rounded-2xl border border-blue-200/90 bg-white p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-blue-700">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>Intelligence Breakdown</span>
                  </div>
                  <span className="rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-mono text-blue-700">
                    29 Data Points Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Recurrence Frequency</p>
                    <p className="mt-0.5 font-bold text-blue-700">
                      Appeared 7 times in 5 years (88% recurrence)
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Target Constitutional Article</p>
                    <p className="mt-0.5 font-bold text-slate-900">
                      Articles 32 &amp; 226 (Writs Jurisdiction)
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
                    <p className="text-[11px] font-medium text-slate-500">Cognitive Layer</p>
                    <p className="mt-0.5 font-bold text-slate-900">
                      Application &amp; Conceptual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Four Intelligence Cards (2×2 Responsive Grid) ───────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {INTELLIGENCE_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Primary CTA Button ───────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            href="/dashboard/practice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span>Try the Live Intelligence Engine</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
