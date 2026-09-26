"use client";

import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24 text-white">
      {/* Subtle radial ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-blue-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[250px] w-[250px] rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* ── Top Pill ─────────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-md shadow-xs">
          <Shield className="h-3.5 w-3.5 text-blue-400" />
          <span>UPSC CDS &bull; CAPF AC &bull; NDA</span>
        </div>

        {/* ── Headline & Gradient Emphasis (Single H1) ─────────────────── */}
        <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white">
          <span className="block">Stop Solving PYQs.</span>
          <span className="block mt-1 sm:mt-2">Start Learning From Them.</span>
          <span className="mt-3.5 block text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-normal bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent sm:mt-4">
            Know exactly what UPSC repeats.
          </span>
        </h1>

        {/* ── Supporting Text ──────────────────────────────────────────── */}
        <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
          Practice real CDS and CAPF Previous Year Questions and instantly discover recurring topics, practice smarter, and identify exactly where you&apos;re losing marks.
        </p>

        {/* ── CTA Buttons ──────────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Primary CTA (Blue) */}
          <Link
            href="/dashboard/practice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.98]"
          >
            <span>Start Free Targeted Practice</span>
            <ArrowRight className="h-5 w-5" />
          </Link>

          {/* Secondary CTA (Outline) */}
          <Link
            href="/dashboard/question-bank"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span>Explore PYQs</span>
          </Link>
        </div>

        {/* ── Mini Credibility Bar (Trust Line) ────────────────────────── */}
        <div className="mt-10 sm:mt-12 inline-flex items-center justify-center">
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Built by an Assistant Commandant &bull; CAPF AC AIR-163 &bull; IIT Kanpur
          </p>
        </div>
      </div>
    </section>
  );
}
