"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Is Defence Pathshala completely free to use?",
    answer:
      "Yes. All official PYQs, topic-wise practice, and syllabus pattern heatmaps are 100% free with no paywalls or hidden charges.",
  },
  {
    question: "Which exams and years are currently covered?",
    answer:
      "Currently built for UPSC CDS (I & II) and CAPF AC with 1500+ official questions from 2018 to 2024. NDA and AFCAT are actively being expanded.",
  },
  {
    question: "Are these official questions with verified answer keys?",
    answer:
      "Yes. Every question is sourced directly from official UPSC examination papers and mapped strictly to verified commission answer keys.",
  },
  {
    question: "How is this different from solving PYQ PDFs or standard mock apps?",
    answer:
      "PDFs only give you questions, and standard apps only give you a score. Defence Pathshala breaks down topic recurrence, question patterns, and provides an automated revision roadmap so you know exactly where marks leaked and what to revise next.",
  },
  {
    question: "Can I clear CDS and CAPF through self-study without coaching?",
    answer:
      "Absolutely. The platform is designed specifically by an AIR-163 Assistant Commandant for self-study aspirants who want to decode the examination directly from primary source patterns.",
  },
];

export default function ObjectionAndFinalCtaSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-slate-50/70 py-16 sm:py-20 text-slate-900 border-t border-slate-200/80">
      {/* Background ambient light */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-blue-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* ── 1. FAQ Accordion ────────────────────────────────────────────── */}
        <div className="mb-14 sm:mb-18">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 shadow-2xs">
              <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              Straightforward answers about our free PYQ intelligence platform.
            </p>
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
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Final Gradient CTA Block ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-blue-900/40 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 sm:p-12 lg:p-14 text-center text-white shadow-2xl">
          {/* Subtle decorative glow overlay */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-blue-500/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-cyan-500/15 blur-[80px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>FREE ACCESS &bull; NO BARRIERS</span>
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl text-white">
              Start Decoding PYQs Today.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Don&apos;t just solve previous year questions blind.
              <span className="block font-medium text-white/90">
                Turn official UPSC papers into your next revision strategy.
              </span>
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/practice"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95 sm:w-52"
              >
                <span>Attempt PYQs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/question-bank"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 text-sm sm:text-base font-semibold text-white transition hover:bg-white/10 sm:w-52"
              >
                <span>Explore PYQs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="mt-4 text-xs font-semibold text-blue-200">100% Free Initiative</p>

            {/* Small trust line */}
            <p className="mt-5 text-xs text-slate-400 font-medium">
              Built by Rohit Kumar &bull; IIT Kanpur &bull; CAPF AC AIR-163
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
