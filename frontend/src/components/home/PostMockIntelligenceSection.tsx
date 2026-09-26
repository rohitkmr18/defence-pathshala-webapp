"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Percent,
  AlertCircle,
  BookOpen,
  TrendingUp,
  Flame,
  CheckCircle2,
  XCircle,
  BarChart3,
  Search,
} from "lucide-react";

const INSIGHT_CARDS = [
  {
    id: "marks-leaked",
    icon: Percent,
    title: "Where Marks Leaked",
    description: "Find exactly which subjects reduced your score.",
  },
  {
    id: "avoidable-mistakes",
    icon: AlertCircle,
    title: "Avoidable Mistakes",
    description: "Spot mistakes that could have been prevented with better revision.",
  },
  {
    id: "priority-topics",
    icon: BookOpen,
    title: "Priority Topics",
    description: "Get the three highest-impact areas to revise next.",
  },
  {
    id: "track-improvement",
    icon: TrendingUp,
    title: "Track Improvement",
    description: "See whether your preparation is actually improving over time.",
  },
];

export default function PostMockIntelligenceSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200/80">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── 1. Eyebrow, 2. Headline & 3. Future-Pacing Copy ─────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>POST-MOCK INTELLIGENCE</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Your Mock Doesn&apos;t End at Submission.
          </h2>

          <div className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            <p className="font-semibold text-slate-800">
              Imagine finishing today&apos;s paper and instantly knowing:
            </p>
            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base text-slate-700 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                where your marks leaked,
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                which mistakes were avoidable,
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                and what deserves tomorrow&apos;s revision.
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Main Analytics Dashboard (Real UI Visuals) ───────────────── */}
        <div className="mb-14 sm:mb-18">
          <div className="group rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10 shadow-xl transition-all duration-300 hover:-translate-y-[3px] hover:shadow-2xl motion-reduce:transform-none motion-reduce:transition-none">
            {/* Window Chrome Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-2 hidden sm:flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-mono text-slate-500">
                  <Search className="h-3 w-3 text-slate-400" />
                  <span>defencepathshala.com/dashboard/practice/debrief</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                Live Post-Mock Debrief
              </span>
            </div>

            {/* Top Metric Cards Strip (Recovery Upward, Accuracy, Score) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">74.2%</p>
                <span className="text-[11px] font-bold text-emerald-600">Above Cutoff Band</span>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-4 text-center shadow-2xs">
                <span className="text-xs font-semibold text-blue-700">Recovery Upward</span>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-emerald-600">+22.6 pts</p>
                <span className="text-[11px] font-semibold text-slate-600">Avoidable Negative Marks</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Net Mock Score</span>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">140.5 <span className="text-xs font-normal text-slate-400">/ 200</span></p>
                <span className="text-[11px] font-bold text-blue-600">Qualified Range</span>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-center shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Weak Topics</span>
                <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">3 Priority</p>
                <span className="text-[11px] font-bold text-amber-600">Immediate Action</span>
              </div>
            </div>

            {/* Main Visuals Grid: Subject Performance on Left, Accuracy Heatmap on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (Col 1-6): Subject Performance */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span>Subject Performance Audit</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Cross-subject net contribution</span>
                </div>

                <div className="space-y-2.5">
                  {/* Subject 1 */}
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

                  {/* Subject 2 */}
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

                  {/* Subject 3 */}
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

              {/* Right Column (Col 7-12): Accuracy Heatmap & Weak Topics */}
              <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <span>Accuracy Heatmap &amp; Weak Topics</span>
                  </div>
                  <span className="text-[11px] text-slate-500">Auto-prioritized revision</span>
                </div>

                <div className="space-y-2.5">
                  {/* Topic 1 (High Priority) */}
                  <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Governor &amp; State Legislature</span>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                        33% Accuracy
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-red-200/70">
                      <div className="h-full bg-red-500 w-[33%]" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Polity &bull; 1/3 Correct</span>
                      <span className="font-bold text-emerald-700">+4.0 Recoverable Marks</span>
                    </div>
                  </div>

                  {/* Topic 2 (High Priority) */}
                  <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Mughal Architecture &amp; Administration</span>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800">
                        25% Accuracy
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-red-200/70">
                      <div className="h-full bg-red-500 w-[25%]" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">History &bull; 1/4 Correct</span>
                      <span className="font-bold text-emerald-700">+6.0 Recoverable Marks</span>
                    </div>
                  </div>

                  {/* Topic 3 (Medium Priority) */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 shadow-2xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">Ocean Currents &amp; Climate Zones</span>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        60% Accuracy
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200/70">
                      <div className="h-full bg-amber-500 w-[60%]" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Geography &bull; 3/5 Correct</span>
                      <span className="font-bold text-emerald-700">+3.3 Recoverable Marks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Four Insight Cards (2×2 Responsive Grid) ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-14 sm:mb-18">
          {INSIGHT_CARDS.map((card) => {
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

        {/* ── 6. Before vs After Comparison Card ──────────────────────────── */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Preparation Shift
            </span>
            <h3 className="mt-1 text-2xl font-black text-slate-900">
              Why Traditional Preparation Fails
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Left Column: Traditional Preparation */}
            <div className="rounded-3xl border border-red-200/80 bg-red-50/40 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 border-b border-red-200/60 mb-5">
                  <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <h4 className="text-lg font-black text-red-950">
                    Traditional Preparation
                  </h4>
                </div>
                <ul className="space-y-3.5 text-sm sm:text-base text-red-900 font-medium">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-200/80 text-red-700 text-xs font-bold">
                      &times;
                    </span>
                    <span>Check score</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-200/80 text-red-700 text-xs font-bold">
                      &times;
                    </span>
                    <span>Read solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-200/80 text-red-700 text-xs font-bold">
                      &times;
                    </span>
                    <span>Guess what to revise</span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-xs text-red-700/80 font-semibold pt-4 border-t border-red-200/60">
                Leaves you guessing what to study next.
              </p>
            </div>

            {/* Right Column: Defence Pathshala */}
            <div className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 border-b border-blue-200/60 mb-5">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                  <h4 className="text-lg font-black text-blue-950">
                    Defence Pathshala
                  </h4>
                </div>
                <ul className="space-y-3.5 text-sm sm:text-base text-blue-950 font-semibold">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                      &#10003;
                    </span>
                    <span>See weak topics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                      &#10003;
                    </span>
                    <span>Identify avoidable mistakes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
                      &#10003;
                    </span>
                    <span>Get tomorrow&apos;s revision roadmap</span>
                  </li>
                </ul>
              </div>
              <p className="mt-6 text-xs text-blue-700 font-bold pt-4 border-t border-blue-200/60">
                Generates a targeted revision plan automatically.
              </p>
            </div>
          </div>
        </div>

        {/* ── 7. Primary CTA (Directly after comparison) ──────────────────── */}
        <div className="text-center">
          <Link
            href="/dashboard/practice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span>Analyze Your First Mock Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
