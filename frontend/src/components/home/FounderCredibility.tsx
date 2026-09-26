"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Award,
  GraduationCap,
  ShieldCheck,
  Target,
  CheckCircle2,
  ArrowDown,
  Layers,
  Sparkles,
} from "lucide-react";

const AUTHORITY_BADGES = [
  {
    id: "capf",
    title: "CAPF AC AIR-163",
    icon: Award,
  },
  {
    id: "ac",
    title: "Assistant Commandant",
    icon: ShieldCheck,
  },
  {
    id: "iitk",
    title: "IIT Kanpur Graduate",
    icon: GraduationCap,
  },
  {
    id: "cds",
    title: "4× CDS Qualified",
    icon: Target,
  },
];

const PROVEN_CHIPS = [
  "Official PYQs",
  "Pattern Analysis",
  "Topic Intelligence",
  "Performance Diagnostics",
];

export default function FounderCredibility() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 text-slate-900 border-t border-slate-200/80">
      {/* Subtle radial ambient glow */}
      <div className="pointer-events-none absolute right-1/4 top-1/3 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-[110px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>BUILT FROM REAL EXPERIENCE</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Built by Someone Who Cleared the Exam.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Defence Pathshala wasn&apos;t built after reading exam strategies.
            <span className="block mt-1 sm:mt-1.5">
              It was built after clearing <strong className="text-slate-900 font-bold">UPSC CAPF (AIR 163)</strong>, qualifying <strong className="text-slate-900 font-bold">CDS four times</strong>, serving as an <strong className="text-slate-900 font-bold">Assistant Commandant</strong>, and analyzing thousands of official PYQs to uncover recurring patterns.
            </span>
          </p>
        </div>

        {/* ── Cards Stack ─────────────────────────────────────────────────── */}
        <div className="space-y-6 sm:space-y-8">
          {/* ── Premium Founder Card ──────────────────────────────────────── */}
          <div className="group rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 lg:hover:-translate-y-[3px] lg:hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
              {/* Founder Avatar */}
              <div className="relative shrink-0">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full ring-4 ring-blue-50 border-2 border-white shadow-md shadow-blue-600/15 bg-blue-100">
                  <Image
                    src="/images/rohit-kumar.jpg"
                    alt="Rohit Kumar - Founder, Defence Pathshala"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, 96px"
                    priority
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 border-2 border-white text-white shadow-xs z-10" title="Verified Rank">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Founder Information & 2x2 Badge Grid */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                      Rohit Kumar
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 mt-0.5">
                      Founder, Defence Pathshala
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    AIR 163 &bull; IIT Kanpur Alumnus
                  </span>
                </div>

                {/* 2×2 Badge Grid (2 columns on mobile) */}
                <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mt-5">
                  {AUTHORITY_BADGES.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.id}
                        className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 sm:p-3.5 text-left transition hover:border-blue-300 hover:bg-white hover:shadow-2xs"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {badge.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Why This Matters Card ─────────────────────────────────────── */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Text content */}
              <div className="flex-1 max-w-2xl space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Strategic Advantage</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  Why This Matters
                </h4>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                  Most aspirants solve PYQs. Defence Pathshala converts every question into structured exam intelligence using <strong className="text-slate-900 font-bold">29 verified data points</strong>, helping you identify recurring topics, revision priorities, and avoidable mistakes.
                </p>
              </div>

              {/* Structured analytics mini visualization */}
              <div className="shrink-0 w-full lg:w-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-800 pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 text-blue-700">
                      <Layers className="h-3.5 w-3.5 text-blue-600" />
                      Intelligence Layer
                    </span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-mono text-blue-700">
                      Taxonomy
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                      <span className="text-slate-500 font-medium">Recurrence Tag</span>
                      <p className="font-bold text-blue-700 mt-0.5">88% Repetition</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 border border-slate-200/80">
                      <span className="text-slate-500 font-medium">Verified Keys</span>
                      <p className="font-bold text-slate-900 mt-0.5">100% Official</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Proven Approach Strip (Inline Trust Chips) ───────────────────── */}
        <div className="mt-10 sm:mt-12 text-center space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Proven Approach
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {PROVEN_CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:text-slate-900"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                <span>{chip}</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Primary CTA (Transitions toward Screen 4) ────────────────────── */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            href="#methodology"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <span>Explore the Intelligence Engine</span>
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
