"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  BookOpen,
  Zap,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const OBJECTION_CARDS = [
  {
    id: "free",
    question: "Is it free?",
    answer: "Yes. You can start exploring the platform without paying.",
    icon: Sparkles,
  },
  {
    id: "exams",
    question: "Which exams?",
    answer: "Built for UPSC CDS, CAPF AC and NDA aspirants.",
    icon: Target,
  },
  {
    id: "coaching",
    question: "Do I need coaching?",
    answer: "No. It's designed for serious self-study aspirants.",
    icon: BookOpen,
  },
  {
    id: "different",
    question: "How is it different?",
    answer: "It doesn't just show PYQs—it helps you decide what to study next.",
    icon: Zap,
  },
];

const FAQS: FAQItem[] = [
  {
    question: "How many previous year questions are available?",
    answer: "730+ official PYQs across CDS, CAPF AC and NDA.",
  },
  {
    question: "Are the questions official?",
    answer: "Yes. Official PYQs with verified answer keys.",
  },
  {
    question: "Can I practice topic-wise?",
    answer: "Yes. Filter by exam, subject and topic.",
  },
  {
    question: "Will more exams be added?",
    answer: "Yes. The platform will continue expanding.",
  },
];

export default function ObjectionAndFinalCtaSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-slate-50/70 py-16 sm:py-24 text-slate-900 border-t border-slate-200/80">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── 1. Section Eyebrow & Headline ──────────────────────────────── */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
            <span>READY TO START?</span>
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Everything You Need. Nothing You Don&apos;t.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Start practicing in minutes. No unnecessary setup. Just real PYQs, intelligent analysis, and a clearer revision roadmap.
          </p>
        </div>

        {/* ── 2. Four Objection Cards (2x2 Grid) ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {OBJECTION_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {card.question}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {card.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. Mini FAQ Accordion ──────────────────────────────────────── */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Frequently Asked Questions
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Common Questions Answered
            </h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-bold text-slate-900 transition hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-transform duration-200 ${
                        isOpen ? "rotate-180 bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 4. Final Gradient CTA Block ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 sm:p-12 lg:p-14 text-center text-white shadow-2xl">
          {/* Subtle decorative glow overlay */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>FREE ACCESS &bull; NO BARRIERS</span>
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-white">
              Start Learning From Every PYQ.
            </h2>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Don&apos;t just solve previous year questions.
              <span className="block font-medium text-white/90">
                Turn them into your next revision decision.
              </span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard/practice"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 motion-reduce:transform-none"
              >
                <span>Start Free Targeted Practice</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/question-bank"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <span>Explore PYQs</span>
              </Link>
            </div>

            {/* Small trust line */}
            <p className="mt-6 text-xs sm:text-sm text-slate-400 font-medium">
              Built by Rohit Kumar &bull; IIT Kanpur &bull; CAPF AC AIR-163
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
