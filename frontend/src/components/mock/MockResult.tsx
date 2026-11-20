"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, House, ListChecks, MinusCircle, RotateCcw, Target, Timer, TrendingDown, XCircle,
} from "lucide-react";
import MockQuestion from "@/components/mock/MockQuestion";
import NextBestMoveCard from "@/components/practice/analysis/NextBestMoveCard";
import RecoverableMarksCard from "@/components/practice/analysis/RecoverableMarksCard";
import SubjectPerformanceCard from "@/components/practice/analysis/SubjectPerformanceCard";
import TopicHeatmapCard from "@/components/practice/analysis/TopicHeatmapCard";
import DifficultyBreakdownCard from "@/components/practice/analysis/DifficultyBreakdownCard";
import MistakePatternsCard from "@/components/practice/analysis/MistakePatternsCard";
import { computeAnalysisMetrics } from "@/lib/analysis/computeAnalysisMetrics";
import { saveCompletedMock } from "@/lib/mockHistory";
import { trackMockFunnel } from "@/lib/mock/funnel";
import { analyzeMockTime, formatMockSeconds, mockReviewToPractice } from "@/lib/mock/analysis";
import { completedAttempts, DP_MOCKS_HREF, useMockAttempts } from "@/lib/mock/attempts";
import type { MockLearnerQuestion } from "@/lib/mock/serialize";
import type { MockBucket, MockOutcome } from "@/lib/mock/results";

export type MockResultReport = {
  status: string;
  code?: string;
  title: string;
  startedAt?: string;
  completedAt?: string;
  summary: { score: number; max_marks: number; correct_count: number; incorrect_count: number; unanswered_count: number; attempted: number; accuracyPercent: number };
  marking: { correctPoints: number; wrongPoints: number; pointsDivisor: number };
  analysis: { subjects: MockBucket[]; difficulties: MockBucket[] };
  review: {
    questionId: string; position: number; subject: string; difficulty: string; topic: string | null;
    selected: "A" | "B" | "C" | "D" | null; correct: "A" | "B" | "C" | "D"; outcome: MockOutcome; marks: number;
    markedForReview: boolean; timeSpentSeconds?: number; explanation: string | null; question: MockLearnerQuestion;
  }[];
};
type Filter = "INCORRECT" | "UNANSWERED" | "MARKED" | "CORRECT" | "ALL";
const OUTCOME_LABEL: Record<MockOutcome, string> = { CORRECT: "Correct", INCORRECT: "Wrong", UNANSWERED: "Skipped" };
const CHIP: Record<MockOutcome, string> = {
  CORRECT: "bg-emerald-50 text-emerald-800 border-emerald-200",
  INCORRECT: "bg-rose-50 text-rose-800 border-rose-200",
  UNANSWERED: "bg-slate-100 text-slate-700 border-slate-200",
};
const CELL: Record<MockOutcome, string> = {
  CORRECT: "bg-emerald-500 text-white", INCORRECT: "bg-rose-500 text-white", UNANSWERED: "bg-slate-200 text-slate-600",
};
const signed = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}`;
const card = "rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7";

function ScoreRing({ percent }: { percent: number }) {
  const r = 52, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, percent));
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 shrink-0 sm:h-36 sm:w-36" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="url(#dpRing)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${(p / 100) * c} ${c}`} transform="rotate(-90 60 60)" />
      <defs><linearGradient id="dpRing" x1="0" x2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#34d399" /></linearGradient></defs>
      <text x="60" y="57" textAnchor="middle" className="fill-white text-[22px] font-black">{Math.round(p)}%</text>
      <text x="60" y="76" textAnchor="middle" className="fill-blue-200 text-[9px] font-semibold uppercase tracking-widest">of max marks</text>
    </svg>
  );
}

export default function MockResult({ report, sessionId }: { report: MockResultReport; sessionId?: string }) {
  const [filter, setFilter] = useState<Filter>("INCORRECT");
  const [subject, setSubject] = useState("ALL");
  const [focus, setFocus] = useState<number | null>(null);
  const reviewRef = useRef<HTMLElement>(null);
  const s = report.summary, m = report.marking;
  const per = (n: number) => n / m.pointsDivisor;

  const { questions, answers } = useMemo(() => mockReviewToPractice(report.review), [report.review]);
  const usedSeconds = report.startedAt && report.completedAt
    ? Math.max(0, (Date.parse(report.completedAt) - Date.parse(report.startedAt)) / 1000) : 0;
  const metrics = useMemo(() => computeAnalysisMetrics(questions, answers, usedSeconds, "CDS", true), [questions, answers, usedSeconds]);
  const time = useMemo(() => analyzeMockTime(report.review), [report.review]);
  const negativeLoss = s.incorrect_count * per(m.wrongPoints);
  const skippedPotential = s.unanswered_count * per(m.correctPoints);

  // Previous attempt of the same mock, for a score delta.
  const { attempts } = useMockAttempts();
  const previous = useMemo(() => {
    if (!attempts) return null;
    const done = completedAttempts(attempts).filter((a) => (report.code ? a.code === report.code : a.title === report.title) && a.sessionId !== sessionId);
    const mine = attempts.find((a) => a.sessionId === sessionId)?.result?.completedAt;
    const earlier = mine ? done.filter((a) => Date.parse(a.result!.completedAt) < Date.parse(mine)) : done;
    return earlier.at(-1) ?? null;
  }, [attempts, report.code, report.title, sessionId]);

  useEffect(() => { trackMockFunnel("mock_result_view", { status: report.status }, `result:${report.title}`); }, [report.status, report.title]);
  // Adds this attempt to the dashboard's mock history once (deduplicated by session).
  useEffect(() => {
    if (!sessionId) return;
    saveCompletedMock({
      sourceId: `dp-mock:${sessionId}`, examTitle: `${report.title} (DP Mock)`, exam: "CDS",
      netScore: s.score, maxMarks: s.max_marks, accuracyRate: Math.round(s.accuracyPercent),
      attemptRate: Math.round((s.attempted / Math.max(1, report.review.length)) * 100),
      correct: s.correct_count, incorrect: s.incorrect_count, skipped: s.unanswered_count, total: report.review.length,
      durationSeconds: Math.round(usedSeconds), weakTopics: metrics.recoverableTopics.slice(0, 5).map((t) => t.topic),
      recoverableMarks: metrics.totalRecoverableMarks,
    });
  }, [sessionId, report, s, usedSeconds, metrics]);

  const subjects = useMemo(() => [...new Set(report.review.map((r) => r.subject))], [report.review]);
  const rows = report.review.filter((r) => (focus !== null ? r.position === focus : (
    (filter === "ALL" || (filter === "MARKED" ? r.markedForReview : r.outcome === filter))
    && (subject === "ALL" || r.subject === subject))));
  const counts: Record<Filter, number> = {
    INCORRECT: s.incorrect_count, UNANSWERED: s.unanswered_count, CORRECT: s.correct_count,
    MARKED: report.review.filter((r) => r.markedForReview).length, ALL: report.review.length,
  };
  const jumpTo = (position: number) => { setFocus(position); reviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const delta = previous?.result ? s.score - previous.result.score : null;
  const finished = report.completedAt ? new Date(report.completedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-10">
      {/* 1. Score hero */}
      <section aria-label="Score" className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#081b35] via-[#0b2547] to-[#123a6b] p-5 text-white shadow-xl sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">DP Mock Test · Performance Analysis</span>
            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">{report.title}</h2>
            <p className="mt-1 text-xs text-blue-200 sm:text-sm">
              {report.status === "EXPIRED" ? "Auto-submitted at time-out" : "Submitted"}{finished ? ` · ${finished}` : ""} · Original DP questions on the UPSC CDS pattern
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={DP_MOCKS_HREF} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-white/20 px-3.5 text-xs font-semibold text-white hover:bg-white/10"><RotateCcw className="h-3.5 w-3.5" />Reattempt</Link>
            <Link href="/dashboard" className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-white px-3.5 text-xs font-semibold text-slate-900 hover:bg-slate-100"><House className="h-3.5 w-3.5" />Dashboard</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ScoreRing percent={(s.score / s.max_marks) * 100} />
          <div className="w-full min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">Net score</p>
            <p className="mt-1 text-5xl font-black tabular-nums sm:text-6xl" data-testid="score">
              {s.score.toFixed(2)}<span className="text-2xl font-bold text-blue-200"> / {s.max_marks.toFixed(2)}</span>
            </p>
            <p className="mt-2 text-sm text-blue-100">+{per(m.correctPoints).toFixed(2)} per correct answer, −{per(m.wrongPoints).toFixed(2)} per wrong answer, 0 for skipped.</p>
            {delta !== null && (
              <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${delta >= 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300"}`}>
                {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {signed(delta)} vs your previous attempt ({previous!.result!.score.toFixed(2)})
              </p>
            )}
          </div>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 sm:grid-cols-4">
          {[
            { label: "Accuracy", value: `${s.accuracyPercent.toFixed(1)}%`, hint: "of attempted questions", icon: Target },
            { label: "Attempted", value: `${s.attempted}/${report.review.length}`, hint: `${Math.round((s.attempted / report.review.length) * 100)}% of the paper`, icon: ListChecks },
            { label: "Time used", value: usedSeconds ? formatMockSeconds(usedSeconds) : "—", hint: time ? `~${time.averageSeconds}s per question` : "of 2h allowed", icon: Clock },
            { label: "Lost to negatives", value: `−${negativeLoss.toFixed(2)}`, hint: `${s.incorrect_count} wrong answers`, icon: TrendingDown },
          ].map(({ label, value, hint, icon: Icon }) => (
            <div key={label} className="rounded-2xl bg-white/5 p-3.5 ring-1 ring-white/10">
              <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-blue-200"><Icon className="h-3.5 w-3.5" />{label}</dt>
              <dd className="mt-1 text-2xl font-black tabular-nums">{value}</dd>
              <dd className="text-[11px] text-blue-200/80">{hint}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white/5 px-4 py-3 text-xs ring-1 ring-white/10">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /><strong>{s.correct_count}</strong> Correct</span>
          <span className="flex items-center gap-1.5"><XCircle className="h-4 w-4 text-rose-400" /><strong>{s.incorrect_count}</strong> Wrong</span>
          <span className="flex items-center gap-1.5"><MinusCircle className="h-4 w-4 text-slate-300" /><strong>{s.unanswered_count}</strong> Skipped</span>
          {metrics.totalRecoverableMarks > 0 && <span className="rounded-lg bg-emerald-400/15 px-2.5 py-1 font-semibold text-emerald-300">+{metrics.totalRecoverableMarks} recoverable marks on Easy/Moderate questions</span>}
        </div>
      </section>

      {/* 2. Where the marks went + question map */}
      <section aria-label="Question map" className={card}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Where your marks went</h3>
            <p className="mt-0.5 text-xs text-slate-500">Every question in paper order. Tap a square to open its solution.</p>
          </div>
          <dl className="flex gap-4 text-right text-xs">
            <div><dt className="text-slate-500">Earned</dt><dd className="text-base font-black text-emerald-600">+{(s.correct_count * per(m.correctPoints)).toFixed(2)}</dd></div>
            <div><dt className="text-slate-500">Negatives</dt><dd className="text-base font-black text-rose-600">−{negativeLoss.toFixed(2)}</dd></div>
            <div><dt className="text-slate-500">Left on skips</dt><dd className="text-base font-black text-slate-500">{skippedPotential.toFixed(2)}</dd></div>
          </dl>
        </div>
        <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
          <div className="bg-emerald-500" style={{ width: `${(s.correct_count / report.review.length) * 100}%` }} />
          <div className="bg-rose-500" style={{ width: `${(s.incorrect_count / report.review.length) * 100}%` }} />
        </div>
        <div className="mt-5 grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(20,minmax(0,1fr))]">
          {report.review.map((r) => (
            <button key={r.questionId} type="button" onClick={() => jumpTo(r.position)}
              aria-label={`Question ${r.position}, ${OUTCOME_LABEL[r.outcome]}, ${r.subject}`}
              className={`relative aspect-square min-h-7 rounded-md text-[10px] font-bold transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-blue-600 ${CELL[r.outcome]}`}>
              {r.position}
              {r.markedForReview && <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-violet-600 ring-1 ring-white" />}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-emerald-500" />Correct</span>
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-rose-500" />Wrong</span>
          <span className="flex items-center gap-1.5"><i className="h-3 w-3 rounded bg-slate-200" />Skipped</span>
          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-violet-600" />Marked for review</span>
        </div>
      </section>

      {/* 3. Coach + recoverable marks */}
      <NextBestMoveCard move={metrics.nextBestMove} />
      <RecoverableMarksCard totalRecoverableMarks={metrics.totalRecoverableMarks} topics={metrics.recoverableTopics}
        answers={answers} scoringRule={metrics.scoringRule} isEligible={metrics.eligibility.hasRecoverableMarks} />

      {/* 4. Subject and difficulty */}
      <section aria-label="By subject"><SubjectPerformanceCard subjects={metrics.subjects} isEligible={metrics.eligibility.hasSubjectPerformance} /></section>
      <section aria-label="By difficulty"><DifficultyBreakdownCard difficulties={metrics.difficulties} isEligible={metrics.eligibility.hasDifficulty} /></section>
      <TopicHeatmapCard topics={metrics.topics} isEligible={metrics.eligibility.hasTopicHeatmap} />
      <MistakePatternsCard patterns={metrics.mistakePatterns} isEligible={metrics.eligibility.hasMistakePatterns} />

      {/* 5. Time intelligence (needs per-question timings) */}
      {time && (
        <section aria-label="Time analysis" className={card}>
          <div className="flex items-center gap-2"><Timer className="h-5 w-5 text-blue-600" /><h3 className="text-lg font-bold text-slate-900">Time intelligence</h3></div>
          <p className="mt-0.5 text-xs text-slate-500">Time on each question while it was on screen. UPSC CDS GK allows about 60 seconds per question.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {time.byOutcome.map((o) => (
              <div key={o.outcome} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{OUTCOME_LABEL[o.outcome]} answers</p>
                <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{o.count ? `${o.averageSeconds}s` : "—"}</p>
                <p className="text-[11px] text-slate-500">average over {o.count} question{o.count === 1 ? "" : "s"}</p>
              </div>
            ))}
          </div>
          {time.costlyMistakes > 0 && (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <strong>{time.costlyMistakes} wrong answer{time.costlyMistakes === 1 ? "" : "s"}</strong> took more than 1.5× your average time. Long deliberation that still ends in a guess costs both time and a negative mark — consider skipping sooner.
            </p>
          )}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Time by subject</h4>
              <ul className="mt-3 space-y-2.5">
                {time.bySubject.map((x) => (
                  <li key={x.subject}>
                    <div className="flex justify-between text-xs"><span className="font-semibold text-slate-800">{x.subject}</span><span className="tabular-nums text-slate-500">{formatMockSeconds(x.seconds)} · {x.averageSeconds}s/q{x.accuracyPercent !== null ? ` · ${x.accuracyPercent}% acc.` : ""}</span></div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(x.seconds / Math.max(1, time.bySubject[0].seconds)) * 100}%` }} /></div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Slowest questions</h4>
              <ul className="mt-3 divide-y divide-slate-100">
                {time.slowest.map((x) => (
                  <li key={x.position}>
                    <button type="button" onClick={() => jumpTo(x.position)} className="flex w-full items-center justify-between gap-2 py-2 text-left text-sm hover:text-blue-700">
                      <span><strong>Q{x.position}</strong> <span className="text-slate-500">· {x.subject}</span></span>
                      <span className="flex items-center gap-2"><span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${CHIP[x.outcome]}`}>{OUTCOME_LABEL[x.outcome]}</span><span className="tabular-nums text-slate-600">{formatMockSeconds(x.seconds)}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 6. Solutions */}
      <section ref={reviewRef} aria-label="Question review" className={`${card} scroll-mt-24 space-y-5`}>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review with explanations</h2>
          <p className="mt-0.5 text-xs text-slate-500">Original DP practice questions — not past UPSC papers. Start with your wrong answers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Review filter" className="flex flex-wrap gap-2">
            {(["INCORRECT", "UNANSWERED", "MARKED", "CORRECT", "ALL"] as Filter[]).map((f) => (
              <button key={f} type="button" aria-pressed={focus === null && filter === f} onClick={() => { setFocus(null); setFilter(f); }}
                className={`min-h-10 rounded-full px-4 text-xs font-semibold transition ${focus === null && filter === f ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                {{ INCORRECT: "Wrong", UNANSWERED: "Skipped", MARKED: "Marked", CORRECT: "Correct", ALL: "All" }[f]} ({counts[f]})
              </button>
            ))}
          </div>
          <label className="ml-auto flex items-center gap-2 text-xs text-slate-600">
            Subject
            <select value={subject} onChange={(e) => { setFocus(null); setSubject(e.target.value); }} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold">
              <option value="ALL">All subjects</option>
              {subjects.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
        </div>
        {focus !== null && (
          <button type="button" onClick={() => setFocus(null)} className="text-xs font-semibold text-blue-700 underline">Showing Q{focus} · back to filtered list</button>
        )}
        {!rows.length && <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Nothing in this filter.</p>}
        <div className="space-y-6">
          {rows.map((r) => (
            <article key={r.questionId} className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold">Q{r.position}</span>
                <span className={`rounded-full border px-2 py-0.5 font-semibold ${CHIP[r.outcome]}`}>{OUTCOME_LABEL[r.outcome]} · {signed(r.marks)}</span>
                <span className="text-slate-500">{r.subject}{r.topic ? ` · ${r.topic}` : ""} · {r.difficulty.charAt(0) + r.difficulty.slice(1).toLowerCase()}</span>
                {(r.timeSpentSeconds ?? 0) > 0 && <span className="flex items-center gap-1 text-slate-500"><Clock className="h-3 w-3" />{formatMockSeconds(r.timeSpentSeconds!)}</span>}
                <span className="text-slate-400">DP practice question</span>
              </div>
              <MockQuestion question={r.question} selected={r.selected} correct={r.correct} />
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-sm leading-7">
                <p className="font-bold text-slate-900">Correct answer: {r.correct}{r.selected === null ? " · you skipped this question" : r.selected !== r.correct ? ` · you chose ${r.selected}` : ""}</p>
                {r.explanation && <p className="mt-1 whitespace-pre-line text-slate-700">{r.explanation}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={DP_MOCKS_HREF} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700">← Back to DP Mock Tests</Link>
        <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50">Go to dashboard</Link>
      </div>
    </div>
  );
}
