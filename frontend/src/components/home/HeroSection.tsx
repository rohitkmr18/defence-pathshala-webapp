"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Newspaper,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8 lg:pt-24 lg:pb-24 text-white">
      {/* Subtle radial ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-blue-600/15 blur-[130px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-[250px] w-[250px] rounded-full bg-indigo-600/10 blur-[100px]" />

      <motion.div
        className="relative mx-auto max-w-4xl text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* ── Top Pill ─────────────────────────────────────────────────── */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 backdrop-blur-md shadow-xs">
          <Shield className="h-3.5 w-3.5 text-blue-400" />
          <span>UPSC CDS &bull; CAPF AC &bull; AFCAT</span>
        </div>

        {/* ── Headline & Gradient Emphasis (Single H1) ─────────────────── */}
        <h1 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl text-white">
          <span className="block">Stop Solving PYQs Blindly.</span>
          <span className="block mt-1 sm:mt-2">
            <motion.span
              className="inline-block"
              style={{
                background:
                  "linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: 4, filter: "drop-shadow(0 0 16px rgba(37,99,235,0.75))" }
              }
              animate={{
                opacity: 1,
                y: 0,
                filter: "drop-shadow(0 0 8px rgba(37,99,235,0.4))",
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Decode
            </motion.span>{" "}
            Them.
          </span>
          <span className="mt-3.5 block text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-normal bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-200 bg-clip-text text-transparent sm:mt-4">
            Know exactly what UPSC repeats.
          </span>
        </h1>

        {/* ── Supporting Text ──────────────────────────────────────────── */}
        <p className="mt-5 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed text-slate-300">
          Analyse real CDS and CAPF Previous Year Questions from GS and instantly discover recurring topics, practice smarter, and identify exactly where you&apos;re losing marks.
        </p>

        {/* ── CTA Hierarchy ────────────────────────────────────────────── */}
        <div className="mx-auto mt-8 w-full max-w-2xl">
          <Link
            href="/dashboard/practice"
            className="group flex w-full items-center justify-between rounded-2xl bg-blue-600 px-5 py-4 text-left shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:px-6 sm:py-5"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/12">
                <Target className="h-5 w-5 text-white" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-extrabold text-white sm:text-lg">
                  Start Smart Practice
                </span>
                <span className="mt-0.5 block text-xs font-medium text-blue-100/85 sm:text-sm">
                  Authentic PYQs. Personalised practice.
                </span>
              </span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              href="/dashboard/question-bank"
              className="group flex min-h-[112px] flex-col justify-between rounded-2xl border border-blue-400/20 bg-white/[0.045] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[118px] sm:p-5"
            >
              <span className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                  <BarChart3 className="h-4.5 w-4.5 text-blue-300" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-300" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white sm:text-base">
                  Decode PYQs
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                  Trends &amp; weightage
                </span>
              </span>
            </Link>

            <Link
              href="/current-affairs"
              className="group relative flex min-h-[112px] flex-col justify-between overflow-hidden rounded-2xl border border-blue-400/20 bg-white/[0.045] p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-blue-400/40 hover:bg-blue-500/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99] sm:min-h-[118px] sm:p-5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-400 via-white to-emerald-500 opacity-80"
              />
              <span className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-inset ring-blue-400/20">
                  <Newspaper className="h-4.5 w-4.5 text-blue-300" />
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-blue-300" />
              </span>
              <span>
                <span className="block text-sm font-bold text-white sm:text-base">
                  Daily Current Affairs
                </span>
                <span className="mt-1 block text-[11px] font-medium leading-snug text-slate-400 sm:text-xs">
                  Today&apos;s exam briefs
                </span>
              </span>
            </Link>
          </div>
        </div>

        {/* ── Free Access Badge over Credentials ───────────────────────── */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>FREE ACCESS &bull; NO BARRIERS</span>
          </div>

          {/* Mini Credibility Bar (Trust Line) */}
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Built by an Assistant Commandant &bull; CAPF AC AIR-163 &bull; IIT Kanpur
          </p>
        </div>
      </motion.div>
    </section>
  );
}
