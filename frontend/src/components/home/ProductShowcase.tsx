"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Search,
  Layers,
  Flame,
  TrendingUp,
} from "lucide-react";

export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-slate-50/60 py-16 sm:py-24 text-slate-900 border-t border-slate-200/80">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>SEE THE DIFFERENCE</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Turn Every Mock into a Smarter Revision Plan
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Don&apos;t just check your score. See exactly which topics are costing you marks and what to revise first.
          </p>
        </div>

        {/* ── 3 Visual Product Cards ─────────────────────────────────────── */}
        <div className="space-y-6 sm:space-y-8">
          {/* ── CARD 1: Dashboard Preview (Roadmap & Heatmap) ─────────────── */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Performance Diagnostics
                </span>
                <h3 className="mt-0.5 text-xl sm:text-2xl font-black text-slate-900">
                  Automated Post-Mock Roadmap
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs">
                  +22.6 Recoverable Marks
                </span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
                  74.2% Accuracy
                </span>
              </div>
            </div>

            {/* Dashboard Real UI Preview Container */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6 space-y-5 shadow-inner">
              {/* Window Chrome & URL */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 font-mono text-[11px] text-slate-500 hidden sm:inline">
                    defencepathshala.com/dashboard/analytics
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  Live Analytics Engine
                </span>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500">Overall Accuracy</span>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">74.2%</p>
                  <span className="text-[10px] font-bold text-emerald-600">Above Cutoff Band</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500">Recovery Upside</span>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-emerald-600">+22.6 pts</p>
                  <span className="text-[10px] font-semibold text-slate-500">Recoverable Marks</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500">Net Score</span>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">140.5 <span className="text-xs font-normal text-slate-400">/ 200</span></p>
                  <span className="text-[10px] font-semibold text-blue-600">Qualified Range</span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500">Topic Heatmap</span>
                  <p className="mt-1 text-xl sm:text-2xl font-black text-slate-900">3 Priority</p>
                  <span className="text-[10px] font-semibold text-amber-600">Immediate Action</span>
                </div>
              </div>

              {/* Topic Heatmap Snippet */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-amber-500" />
                    Topic Accuracy Heatmap (Real Test Diagnostic)
                  </span>
                  <span className="text-[11px] text-slate-500">Color-coded by priority</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-red-700">Polity &bull; High Priority</span>
                      <span className="font-black text-red-700">33%</span>
                    </div>
                    <p className="mt-1 font-bold text-slate-900 text-xs">Governor &amp; State Legislature</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-red-200/70">
                      <div className="h-full bg-red-500 w-[33%]" />
                    </div>
                    <span className="mt-1.5 block text-[10px] font-semibold text-emerald-700">+4.0 pts upside</span>
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-amber-700">Geography &bull; Medium</span>
                      <span className="font-black text-amber-700">60%</span>
                    </div>
                    <p className="mt-1 font-bold text-slate-900 text-xs">Ocean Currents &amp; Climate Zones</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200/70">
                      <div className="h-full bg-amber-500 w-[60%]" />
                    </div>
                    <span className="mt-1.5 block text-[10px] font-semibold text-emerald-700">+3.3 pts upside</span>
                  </div>

                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-emerald-700">History &bull; Strong</span>
                      <span className="font-black text-emerald-700">83%</span>
                    </div>
                    <p className="mt-1 font-bold text-slate-900 text-xs">Revolt of 1857 &amp; Leaders</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-emerald-200/70">
                      <div className="h-full bg-emerald-500 w-[83%]" />
                    </div>
                    <span className="mt-1.5 block text-[10px] font-semibold text-slate-500">Solid Retention</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Caption & Chips */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">
                Every test automatically generates your revision roadmap.
              </p>
              <span className="text-slate-400 hidden sm:inline">
                Zero manual calculations needed
              </span>
            </div>
          </div>

          {/* ── TWO-COLUMN GRID: Card 2 (Question Bank) & Card 3 (Subject Audit) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* ── CARD 2: Question Bank Explorer ──────────────────────────── */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none flex flex-col justify-between">
              <div>
                <div className="pb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Topic Intelligence
                  </span>
                  <h3 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                    Find Every Question from One Topic
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                    Instead of opening five PDFs.
                  </p>
                </div>

                {/* Real Question Explorer Preview */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3.5 shadow-inner">
                  {/* Active Filter Bar */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 font-bold text-blue-700">
                      CDS II 2024
                    </span>
                    <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                      Polity
                    </span>
                    <span className="rounded-md bg-blue-600 text-white px-2 py-0.5 font-bold shadow-xs">
                      Fundamental Rights
                    </span>
                  </div>

                  {/* Question snippet */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-blue-600">Q.28 &bull; General Studies</span>
                      <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold px-2 py-0.5">
                        Moderate &bull; 62% Success Rate
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      Which writ is issued by the Supreme Court to command an authority to perform a statutory duty?
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500">
                        A. Habeas Corpus
                      </div>
                      <div className="rounded-lg border border-blue-400 bg-blue-50 p-1.5 font-bold text-blue-800 flex items-center justify-between">
                        <span>B. Mandamus</span>
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Example Callout */}
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/80 p-3 text-center">
                <p className="text-xs font-bold text-blue-900">
                  Fundamental Rights &rarr; 7 previous questions &rarr; Articles 32 &amp; 226
                </p>
              </div>
            </div>

            {/* ── CARD 3: Subject Performance Audit ───────────────────────── */}
            <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none flex flex-col justify-between">
              <div>
                <div className="pb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    Syllabus Weightage Audit
                  </span>
                  <h3 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                    Know What UPSC Repeats
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                    Not every chapter deserves equal time.
                  </p>
                </div>

                {/* Real Subject Performance Audit UI preview */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3 shadow-inner">
                  {/* Subject Item 1 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">Indian Polity</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.2 text-[10px] font-bold text-emerald-700">
                          Strength
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">+45.3 pts</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-emerald-500 w-[88%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>22/24 Correct</span>
                      <span className="font-bold text-slate-700">88% Accuracy</span>
                    </div>
                  </div>

                  {/* Subject Item 2 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">General Science</span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.2 text-[10px] font-bold text-emerald-700">
                          Strength
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">+51.6 pts</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-emerald-500 w-[80%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>24/28 Correct</span>
                      <span className="font-bold text-slate-700">80% Accuracy</span>
                    </div>
                  </div>

                  {/* Subject Item 3 */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">Modern Indian History</span>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.2 text-[10px] font-bold text-amber-700">
                          Focus
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 text-xs">+11.2 pts</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-amber-500 w-[44%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>8/18 Correct</span>
                      <span className="font-bold text-slate-700">44% Accuracy</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Note */}
              <div className="mt-5 text-center">
                <span className="text-xs font-semibold text-slate-500">
                  Pinpoint syllabus weightage before your next study session.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Compact Premium Proof Strip ─────────────────────────────────── */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {/* Top 3 numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center pb-6 border-b border-slate-100 gap-4 sm:gap-0">
            <div className="px-4 py-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">730+</p>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Official PYQs</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">29</p>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Data Points</p>
            </div>
            <div className="px-4 py-2">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">9</p>
              <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjects</p>
            </div>
          </div>

          {/* Bottom 4 check badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-700">
            {[
              "Official Answer Keys",
              "Topic-wise Filters",
              "Full Paper Simulation",
              "Free to Explore",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Primary CTA ─────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="/dashboard/question-bank"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span>Explore Live Question Bank</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
