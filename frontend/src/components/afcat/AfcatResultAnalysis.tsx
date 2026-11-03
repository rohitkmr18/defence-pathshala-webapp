"use client";

import { useMemo, useState, type ReactNode } from "react";
import MathText from "@/components/common/MathText";
import type { AfcatDisplayQuestion } from "@/lib/afcat/visual-types";
import {
  AFCAT_PACE_SECONDS,
  AFCAT_SECTIONS,
  afcatOutcome,
  sectionLabel,
  type AfcatAnalysis,
  type AfcatKey,
  type AfcatOutcome,
  type AfcatSection,
  type AfcatSectionSummary,
} from "@/lib/afcat/results-analytics";

export type AfcatResultSummary = {
  score: number;
  max_marks: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
};
export type AfcatReviewRow = {
  questionId: string;
  position: number;
  section: AfcatSection;
  topic: string | null;
  difficulty: string | null;
  selected: AfcatKey | null;
  correct: AfcatKey;
  markedForReview: boolean;
  timeSpentSeconds: number;
  explanation: string | null;
  question: AfcatDisplayQuestion;
};
export type AfcatResultReport = {
  status: string;
  summary: AfcatResultSummary;
  sections?: AfcatSectionSummary[];
  analysis?: AfcatAnalysis;
  review?: AfcatReviewRow[];
};

type Filter = "ALL" | "INCORRECT" | "UNANSWERED" | "MARKED";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "INCORRECT", label: "Wrong" },
  { key: "UNANSWERED", label: "Skipped" },
  { key: "MARKED", label: "Marked" },
  { key: "ALL", label: "All" },
];
const OUTCOME: Record<AfcatOutcome, { label: string; tone: string }> = {
  CORRECT: { label: "Correct", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  INCORRECT: { label: "Wrong", tone: "bg-rose-50 text-rose-800 border-rose-200" },
  UNANSWERED: { label: "Skipped", tone: "bg-slate-100 text-slate-700 border-slate-200" },
};

function duration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60), s = totalSeconds % 60;
  return m ? `${m} min ${s ? `${s} s` : ""}`.trim() : `${s} s`;
}
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">{title}</h3>
      {children}
    </section>
  );
}

export default function AfcatResultAnalysis({
  status,
  summary,
  report,
}: {
  status: string;
  summary: AfcatResultSummary;
  report: AfcatResultReport | null;
}) {
  const analysis = report?.analysis;
  const review = useMemo(() => report?.review ?? [], [report]);
  const [filter, setFilter] = useState<Filter>("INCORRECT");
  const [section, setSection] = useState<AfcatSection | "ALL">("ALL");
  const attempted = summary.correct_count + summary.incorrect_count;
  const accuracy = attempted ? Math.round((summary.correct_count / attempted) * 1000) / 10 : 0;
  const visible = review.filter((row) => {
    if (section !== "ALL" && row.section !== section) return false;
    if (filter === "MARKED") return row.markedForReview;
    if (filter === "ALL") return true;
    return afcatOutcome(row) === filter;
  });
  const counts: Record<Filter, number> = {
    ALL: review.length,
    INCORRECT: review.filter((r) => afcatOutcome(r) === "INCORRECT").length,
    UNANSWERED: review.filter((r) => afcatOutcome(r) === "UNANSWERED").length,
    MARKED: review.filter((r) => r.markedForReview).length,
  };
  const goTo = (position: number) => {
    setFilter("ALL");
    setSection("ALL");
    requestAnimationFrame(() =>
      document.getElementById(`afcat-review-${position}`)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return (
    <section aria-label="Exam results" className="space-y-4">
      {/* 1. Score */}
      <div className="rounded-2xl border border-blue-200 bg-white p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
          Test complete · {status === "EXPIRED" ? "Time ran out" : "Submitted"}
        </p>
        <h2 className="my-2 text-4xl font-bold">
          {summary.score} <span className="text-lg font-semibold text-slate-500">/ {summary.max_marks} marks</span>
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
          {[
            ["Correct", `${summary.correct_count}`, `+${summary.correct_count * 3} marks`],
            ["Wrong", `${summary.incorrect_count}`, `${summary.incorrect_count ? "−" : ""}${summary.incorrect_count} marks`],
            ["Skipped", `${summary.unanswered_count}`, "0 marks"],
            ["Accuracy", `${accuracy}%`, `${attempted} attempted`],
          ].map(([term, value, note]) => (
            <div key={term} className="rounded-xl bg-slate-50 p-3">
              <dt className="text-xs text-slate-600">{term}</dt>
              <dd className="text-lg font-bold">{value}</dd>
              <dd className="text-xs text-slate-500">{note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-slate-500">
          Scored by the server at +3 / −1. This is a DP practice mock; it does not predict your AFCAT result or cut-off.
        </p>
      </div>

      {!analysis ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Detailed analysis is not available for this attempt.
        </p>
      ) : (
        <>
          {/* 2. What to do next: the one thing this screen should drive */}
          <section aria-label="Your next steps" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
            <h3 className="mb-3 text-base font-bold text-emerald-950">Your next steps</h3>
            {analysis.recommendations.length ? (
              <ol className="space-y-3">
                {analysis.recommendations.map((r, i) => (
                  <li key={r.kind} className="rounded-xl bg-white p-3">
                    <p className="font-semibold text-slate-900">{i + 1}. {r.title}</p>
                    <p className="mt-1 text-sm text-slate-700">{r.reason}</p>
                    {r.section && (
                      <button type="button" onClick={() => { setSection(r.section!); setFilter("INCORRECT"); document.getElementById("afcat-review")?.scrollIntoView({ behavior: "smooth" }); }}
                        className="mt-2 min-h-11 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">
                        Review {sectionLabel(r.section)} mistakes →
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-emerald-950">
                No single weak area stands out. Go through your wrong answers below and note why each one went wrong.
              </p>
            )}
          </section>

          {/* 3. Sections */}
          <Card title="Section-wise">
            <div className="space-y-3">
              {analysis.sections.filter((s) => s.total).map((s) => (
                <div key={s.section}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold">{s.label}</span>
                    <span className="font-bold">{s.marks}<span className="font-normal text-slate-500">/{s.maximumMarks}</span></span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, pct(s.marks, s.maximumMarks))}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {s.correct} correct · {s.incorrect} wrong · {s.unanswered} skipped · {s.accuracyPercent}% accuracy
                    {s.negativeMarks ? ` · −${s.negativeMarks} from wrong answers` : ""}
                    {s.averageSecondsPerAttempt ? ` · ${s.averageSecondsPerAttempt} s per attempt` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* 4. Topics */}
          {analysis.topics.some((t) => t.marksLost > 0) && (
            <Card title="Where you lost marks">
              <ul className="divide-y divide-slate-100">
                {analysis.topics.filter((t) => t.marksLost > 0).slice(0, 6).map((t) => (
                  <li key={`${t.section}-${t.topic}`} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <span className="min-w-0">
                      <span className="font-semibold">{t.topic}</span>
                      <span className="block text-xs text-slate-500">{sectionLabel(t.section)} · {t.correct}/{t.total} correct</span>
                    </span>
                    <span className="shrink-0 font-bold text-rose-700">−{t.marksLost}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">Marks lost = marks available minus marks scored, so skipped questions count too.</p>
            </Card>
          )}

          {/* 5. Difficulty and time */}
          <div className="grid gap-4 sm:grid-cols-2">
            {analysis.difficulty.length > 0 && (
              <Card title="By difficulty">
                <ul className="space-y-2 text-sm">
                  {analysis.difficulty.map((d) => (
                    <li key={d.difficulty} className="flex justify-between gap-2">
                      <span className="capitalize">{d.difficulty.toLowerCase()} ({d.total})</span>
                      <span>{d.correct} correct · {d.attempted ? `${d.accuracyPercent}%` : "not attempted"}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-slate-500">Difficulty labels are DP estimates, not official ratings.</p>
              </Card>
            )}
            <Card title="Time">
              {analysis.time.recorded ? (
                <div className="space-y-2 text-sm">
                  <p>Time recorded on questions: <strong>{duration(analysis.time.totalSeconds)}</strong> of 120 min.</p>
                  {analysis.time.costlyMisses > 0 && (
                    <p>{analysis.time.costlyMisses} wrong answers took more than {AFCAT_PACE_SECONDS} s each.</p>
                  )}
                  {analysis.time.slowQuestions.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-600">Slowest questions (over {AFCAT_PACE_SECONDS * 2} s):</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {analysis.time.slowQuestions.map((q) => (
                          <button key={q.position} type="button" onClick={() => goTo(q.position)}
                            className={`min-h-11 rounded-lg border px-3 text-xs font-semibold ${OUTCOME[q.outcome].tone}`}>
                            Q{q.position} · {duration(q.seconds)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-600">Time per question was not recorded for this attempt.</p>
              )}
            </Card>
          </div>
        </>
      )}

      {/* 6. Question review */}
      {review.length > 0 && (
        <section id="afcat-review" aria-label="Question review" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <h3 className="mb-3 text-base font-bold">Review questions</h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
            {FILTERS.map((f) => (
              <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}
                className={`min-h-11 rounded-full border px-4 text-sm font-semibold ${filter === f.key ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700"}`}>
                {f.label} ({counts[f.key]})
              </button>
            ))}
          </div>
          <label className="mt-3 block text-sm">
            <span className="sr-only">Section</span>
            <select value={section} onChange={(e) => setSection(e.target.value as AfcatSection | "ALL")}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 sm:w-auto">
              <option value="ALL">All sections</option>
              {AFCAT_SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </label>
          {visible.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600">No questions match this filter.</p>
          ) : (
            <ol className="mt-4 space-y-4">
              {visible.map((row) => {
                const outcome = afcatOutcome(row);
                return (
                  <li key={row.questionId} id={`afcat-review-${row.position}`} className="scroll-mt-24 rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">Q{row.position}</span>
                      <span className={`rounded-full border px-2 py-0.5 font-semibold ${OUTCOME[outcome].tone}`}>{OUTCOME[outcome].label}</span>
                      <span className="text-slate-500">{sectionLabel(row.section)}{row.topic ? ` · ${row.topic}` : ""}</span>
                      {row.timeSpentSeconds > 0 && <span className="text-slate-500">· {duration(row.timeSpentSeconds)}</span>}
                      {row.markedForReview && <span className="text-violet-700">· Marked</span>}
                    </div>
                    <MathText as="div" text={row.question.stem.text ?? ""} className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-900" />
                    <ul className="mt-3 space-y-1.5">
                      {row.question.options.map((o) => {
                        const isCorrect = o.key === row.correct, isYours = o.key === row.selected;
                        return (
                          <li key={o.key} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${isCorrect ? "border-emerald-300 bg-emerald-50" : isYours ? "border-rose-300 bg-rose-50" : "border-slate-100"}`}>
                            <span className="font-bold">{o.key}.</span>
                            <MathText as="span" text={o.content.text ?? ""} className="min-w-0 flex-1 break-words" />
                            {isCorrect && <span className="shrink-0 text-xs font-semibold text-emerald-800">Correct answer</span>}
                            {isYours && !isCorrect && <span className="shrink-0 text-xs font-semibold text-rose-800">Your answer</span>}
                          </li>
                        );
                      })}
                    </ul>
                    {row.explanation && (
                      <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><strong>Why: </strong>{row.explanation}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}
    </section>
  );
}
