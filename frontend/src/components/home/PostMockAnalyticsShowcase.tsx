"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
} from "lucide-react";

// Mock subjects for post-mock visualization
const DEMO_SUBJECTS = [
  {
    subject: "Indian Polity",
    badge: "Strength",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barColor: "bg-emerald-500",
    accuracy: 88,
    attempted: 24,
    total: 25,
    netScore: "+45.3",
    correct: 22,
    incorrect: 2,
    skipped: 1,
  },
  {
    subject: "General Science",
    badge: "Strength",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    barColor: "bg-emerald-500",
    accuracy: 80,
    attempted: 28,
    total: 30,
    netScore: "+51.6",
    correct: 24,
    incorrect: 4,
    skipped: 2,
  },
  {
    subject: "Geography & Ecology",
    badge: "Stable",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    barColor: "bg-blue-500",
    accuracy: 68,
    attempted: 21,
    total: 24,
    netScore: "+32.4",
    correct: 15,
    incorrect: 6,
    skipped: 3,
  },
  {
    subject: "Modern Indian History",
    badge: "Focus",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    barColor: "bg-amber-500",
    accuracy: 44,
    attempted: 18,
    total: 20,
    netScore: "+11.2",
    correct: 8,
    incorrect: 10,
    skipped: 2,
  },
];

// Mock topics for heatmap visualization
const DEMO_TOPICS = [
  {
    topic: "Governor & State Legislature",
    subject: "Polity",
    priority: "High Priority",
    cardStyle: "border-red-200 bg-red-50/50 text-red-950",
    badgeStyle: "bg-red-100 text-red-800 border-red-200",
    barStyle: "bg-red-500",
    accuracy: 33,
    correct: 1,
    attempted: 3,
    recoverableMarks: 4.0,
  },
  {
    topic: "Mughal Architecture & Mansabdari",
    subject: "History",
    priority: "High Priority",
    cardStyle: "border-red-200 bg-red-50/50 text-red-950",
    badgeStyle: "bg-red-100 text-red-800 border-red-200",
    barStyle: "bg-red-500",
    accuracy: 25,
    correct: 1,
    attempted: 4,
    recoverableMarks: 6.0,
  },
  {
    topic: "Monetary Policy & Inflation",
    subject: "Economics",
    priority: "High Priority",
    cardStyle: "border-red-200 bg-red-50/50 text-red-950",
    badgeStyle: "bg-red-100 text-red-800 border-red-200",
    barStyle: "bg-red-500",
    accuracy: 40,
    correct: 2,
    attempted: 5,
    recoverableMarks: 5.3,
  },
  {
    topic: "Ocean Currents & Climate Zones",
    subject: "Geography",
    priority: "Medium Priority",
    cardStyle: "border-amber-200 bg-amber-50/50 text-amber-950",
    badgeStyle: "bg-amber-100 text-amber-800 border-amber-200",
    barStyle: "bg-amber-500",
    accuracy: 60,
    correct: 3,
    attempted: 5,
    recoverableMarks: 3.3,
  },
  {
    topic: "Fundamental Rights & Writs",
    subject: "Polity",
    priority: "Medium Priority",
    cardStyle: "border-amber-200 bg-amber-50/50 text-amber-950",
    badgeStyle: "bg-amber-100 text-amber-800 border-amber-200",
    barStyle: "bg-amber-500",
    accuracy: 67,
    correct: 4,
    attempted: 6,
    recoverableMarks: 2.7,
  },
  {
    topic: "Revolt of 1857 & Leaders",
    subject: "History",
    priority: "Good Performance",
    cardStyle: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-200",
    barStyle: "bg-emerald-500",
    accuracy: 83,
    correct: 5,
    attempted: 6,
    recoverableMarks: 1.3,
  },
];

export default function PostMockAnalyticsShowcase() {
  const [activeTab, setActiveTab] = useState<"subject" | "heatmap">("subject");

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 text-slate-900 border-t border-slate-200/80">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs">
            <BarChart3 className="h-3.5 w-3.5 text-blue-600" />
            ACTIONABLE POST-MOCK DEBRIEF
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl text-slate-900">
            Post-Mock Diagnostics & Analytics
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Every test you attempt generates deep diagnostic graphs—auditing subject contribution and rendering an accuracy heatmap to target your revision.
          </p>

          {/* Quick interactive mode switcher */}
          <div className="mt-8 inline-flex rounded-2xl border border-slate-200 bg-slate-100/80 p-1 shadow-inner">
            <button
              onClick={() => setActiveTab("subject")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "subject"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Subject Performance Audit
            </button>
            <button
              onClick={() => setActiveTab("heatmap")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "heatmap"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="h-4 w-4 text-amber-500" />
              Topic Accuracy Heatmap
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 lg:p-10 shadow-sm">
          {/* Top KPI Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Overall Accuracy</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">74.2%</p>
              <span className="text-[11px] font-semibold text-emerald-600">Above Cutoff Band</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Net Score</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">140.5 <span className="text-xs font-normal text-slate-400">/ 200</span></p>
              <span className="text-[11px] font-semibold text-blue-600">+18.5 vs Average</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Recovery Upside</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">+22.6 pts</p>
              <span className="text-[11px] font-semibold text-slate-500">Avoidable Negative Marks</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Exam Readiness</span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">High</p>
              <span className="text-[11px] font-semibold text-blue-600">3 Priority Fixes</span>
            </div>
          </div>

          {/* Tab 1: Subject Performance Audit */}
          {activeTab === "subject" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Subject Performance Audit
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Cross-subject syllabus breakdown showing accuracy, net contribution, and target focus areas.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" /> Strength (75%+)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-blue-700">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> Stable (60-74%)
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-amber-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500" /> Focus (&lt;60%)
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                {DEMO_SUBJECTS.map((sub) => (
                  <div
                    key={sub.subject}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-md shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{sub.subject}</h4>
                        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${sub.badgeClass}`}>
                          {sub.badge}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-900">
                        {sub.netScore} pts
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Accuracy</span>
                        <span className="font-bold text-slate-900">{sub.accuracy}%</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${sub.barColor}`}
                          style={{ width: `${sub.accuracy}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex gap-3">
                        <span className="text-emerald-700 font-semibold">✓ {sub.correct} Correct</span>
                        <span className="text-red-700 font-semibold">✗ {sub.incorrect} Incorrect</span>
                        <span className="text-slate-400">○ {sub.skipped} Skipped</span>
                      </div>
                      <span className="font-medium text-slate-600">
                        {sub.attempted}/{sub.total} Attempted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Topic Accuracy Heatmap */}
          {activeTab === "heatmap" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Topic Accuracy Heatmap
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Color-coded priority matrix identifying high-risk topics vs consolidated strengths.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-semibold text-red-700">
                    <span className="h-2.5 w-2.5 rounded-xs bg-red-500" />
                    <span>High Priority (&lt;50%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-amber-700">
                    <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" />
                    <span>Medium Priority (50-74%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                    <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
                    <span>Good Performance (75%+)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {DEMO_TOPICS.map((t) => (
                  <div
                    key={t.topic}
                    className={`rounded-2xl border p-4 transition shadow-2xs hover:shadow-md ${t.cardStyle}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {t.subject}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {t.topic}
                        </h4>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${t.badgeStyle}`}>
                        {t.accuracy}%
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/70">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${t.barStyle}`}
                        style={{ width: `${t.accuracy}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-600">
                      <span>
                        {t.correct}/{t.attempted} correct
                      </span>
                      {t.recoverableMarks > 0 && (
                        <span className="font-bold text-emerald-700">
                          +{t.recoverableMarks} pts upside
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar: Action to practice */}
          <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
              These diagnostics generate automatically after every filtered practice or full paper attempt.
            </p>
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 transition shrink-0"
            >
              Start Free Targeted Practice
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
