"use client";

import Link from "next/link";
import {
  Search,
  CheckCircle2,
  FileCheck2,
  BarChart3,
  Flame,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  tag: string;
  href: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: "topic-explorer",
    icon: Search,
    title: "Topic-wise PYQ Explorer",
    description: "Find every question ever asked from a topic with comprehensive filters.",
    tag: "730+ PYQs",
    href: "/dashboard/question-bank",
  },
  {
    id: "full-paper",
    icon: FileCheck2,
    title: "Full Paper Simulation",
    description: "Attempt real exam papers with an authentic experience and real exam timings.",
    tag: "Authentic Mock",
    href: "/dashboard/practice",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Post-Mock Diagnostics",
    description: "Track accuracy, weak areas and topic accuracy heatmaps with actionable data.",
    tag: "Instant Insights",
    href: "/dashboard",
  },
];

export default function ProductShowcase() {
  return (
    <section className="relative overflow-hidden bg-slate-50/60 py-20 sm:py-28 text-slate-900 border-t border-slate-200/80">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            THE INTELLIGENCE ENGINE
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            See the Intelligence in Action
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Every question is transformed into structured exam intelligence—not just another PDF.
          </p>
        </div>

        {/* Showcase Grid: Left Screenshot/Mockup, Right Feature Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Dashboard Interactive Preview / Mockup (Col 1-7) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden group">
              {/* Window Header Chrome */}
              <div className="flex items-center justify-between border-b border-slate-200/90 bg-slate-100/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-amber-400/90 inline-block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400/90 inline-block" />
                </div>
                <div className="rounded-lg bg-white border border-slate-200 px-3 py-1 text-[11px] font-mono text-slate-500 flex items-center gap-1.5 shadow-2xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                  defencepathshala.com/dashboard/question-bank
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                  Live View
                </span>
              </div>

              {/* Workspace Content */}
              <div className="p-4 sm:p-6 space-y-4 bg-white">
                {/* Active Filters Bar */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Active Filters:</span>
                  <span className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-700 font-semibold">
                    Exam: <strong className="text-blue-600">CDS (II) 2024</strong>
                  </span>
                  <span className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-700 font-semibold">
                    Subject: <strong className="text-blue-600">Polity</strong>
                  </span>
                  <span className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1 text-slate-700 font-semibold">
                    Topic: <strong className="text-blue-600">Fundamental Rights</strong>
                  </span>
                </div>

                {/* Question Intelligence Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5 space-y-4">
                  {/* Question Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-blue-600 text-white text-xs font-black px-2 py-0.5 shadow-xs">
                        Q.28
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        CDS 2024 · General Studies Paper
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-2.5 py-0.5 shadow-2xs">
                        Moderate · 62% Success Rate
                      </span>
                    </div>
                  </div>

                  {/* Question Text */}
                  <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                    Which one of the following writs is issued by the Supreme Court or High Court to command a public authority to perform a statutory duty that it has failed to execute?
                  </p>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-2xs">
                      <span className="font-bold text-slate-400">A</span>
                      <span>Habeas Corpus</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-blue-400 bg-blue-50/80 p-2.5 text-blue-900 font-semibold shadow-xs">
                      <span className="font-bold text-blue-600">B</span>
                      <span className="flex-1">Mandamus</span>
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-2xs">
                      <span className="font-bold text-slate-400">C</span>
                      <span>Quo-Warranto</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-2xs">
                      <span className="font-bold text-slate-400">D</span>
                      <span>Certiorari</span>
                    </div>
                  </div>

                  {/* 29 Data Points Intelligence Panel */}
                  <div className="rounded-xl border border-blue-200/80 bg-white p-3.5 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                        <Layers className="h-3.5 w-3.5 text-blue-600" />
                        <span>Intelligence Breakdown (29 Data Points)</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Taxonomy Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/70">
                        <p className="text-slate-500 font-medium">Cognitive Layer</p>
                        <p className="text-slate-900 font-bold mt-0.5">Conceptual / Recall</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/70">
                        <p className="text-slate-500 font-medium">Recurrence Rate</p>
                        <p className="text-blue-600 font-bold mt-0.5">7x in Last 5 Years</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200/70 col-span-2 sm:col-span-1">
                        <p className="text-slate-500 font-medium">Target Article</p>
                        <p className="text-slate-900 font-bold mt-0.5">Article 32 & 226</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Ticker */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> 730+ Questions Indexed
                    </span>
                    <span>·</span>
                    <span className="text-slate-600">Detailed Explanations Included</span>
                  </div>
                  <Link
                    href="/dashboard/question-bank"
                    className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 text-xs"
                  >
                    Open Live Explorer <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Feature Highlights (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className="group relative flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 group-hover:bg-blue-100 transition-colors">
                        {feature.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
