"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Shield } from "lucide-react";

import { trackLearningEvent } from "@/lib/learning-events";

// One question on the first screen: "Which exam are you preparing for?" Each answer goes straight to practice.
const EXAMS = [
  { tile: "exam_cds", href: "/dashboard/practice?exam=CDS", name: "CDS", detail: "GK, Maths & English PYQs", badge: null },
  { tile: "exam_capf", href: "/dashboard/practice?exam=CAPF-AC", name: "CAPF AC", detail: "Paper I PYQs with topic trends", badge: null },
  { tile: "exam_afcat", href: "/afcat", name: "AFCAT", detail: "Full-length mocks, instant analysis", badge: "Free" },
] as const;

export default function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 pt-8 pb-10 text-white sm:px-6 sm:pt-16 sm:pb-16 lg:px-8 lg:pt-20 lg:pb-20">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[130px]" />

      <motion.div
        className="relative mx-auto max-w-2xl text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Trust line: who built it + that it is free, in one glance */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1.5 text-[11px] font-bold text-blue-200 sm:text-xs">
          <Shield className="h-3.5 w-3.5 shrink-0 text-blue-400" />
          <span>Free &bull; Built by CAPF AC AIR-163, IIT Kanpur</span>
        </div>

        <h1 className="mt-5 text-[2rem] font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Stop Solving PYQs Blindly.{" "}
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Decode Them.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
          Real previous-year questions, recurring-topic trends and instant analysis, so every hour of practice counts.
        </p>

        {/* Single decision */}
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">Choose your exam to start</p>
        <div className="mx-auto mt-3 flex w-full max-w-md flex-col gap-3">
          {EXAMS.map((exam) => (
            <Link
              key={exam.tile}
              href={exam.href}
              onClick={() => trackLearningEvent("home_tile_click", { tile: exam.tile })}
              className="group flex items-center justify-between rounded-2xl bg-blue-600 px-5 py-4 text-left shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.99]"
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-lg font-extrabold text-white">
                  {exam.name}
                  {exam.badge && (
                    <span className="rounded-full bg-emerald-300/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">{exam.badge}</span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-blue-100/90 sm:text-sm">{exam.detail}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-white/85 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <a href="#how-it-works" className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 transition hover:text-blue-300">
          See how it works <ChevronDown className="h-3.5 w-3.5" />
        </a>
      </motion.div>
    </section>
  );
}
