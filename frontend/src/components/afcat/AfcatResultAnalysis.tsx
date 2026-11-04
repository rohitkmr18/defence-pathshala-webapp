"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AfcatContentBlock } from "@/components/afcat/AfcatVisualQuestion";
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

type Tab = "OVERVIEW" | "SECTIONS" | "TOPICS" | "TIME" | "REVIEW";
const TABS: { key: Tab; label: string }[] = [
  { key: "OVERVIEW", label: "Overview" },
  { key: "SECTIONS", label: "Sections" },
  { key: "TOPICS", label: "Topics" },
  { key: "TIME", label: "Time" },
  { key: "REVIEW", label: "Review" },
];
type Filter = "ALL" | "INCORRECT" | "UNANSWERED" | "MARKED";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "INCORRECT", label: "Wrong" },
  { key: "UNANSWERED", label: "Skipped" },
  { key: "MARKED", label: "Marked" },
  { key: "ALL", label: "All" },
];
const OUTCOME: Record<AfcatOutcome, { label: string; chip: string; tile: string; bar: string }> = {
  CORRECT: { label: "Correct", chip: "bg-emerald-50 text-emerald-800 border-emerald-200", tile: "bg-emerald-500 text-white", bar: "bg-emerald-500" },
  INCORRECT: { label: "Wrong", chip: "bg-rose-50 text-rose-800 border-rose-200", tile: "bg-rose-500 text-white", bar: "bg-rose-500" },
  UNANSWERED: { label: "Skipped", chip: "bg-slate-100 text-slate-700 border-slate-200", tile: "bg-slate-200 text-slate-700", bar: "bg-slate-300" },
};

function duration(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60), s = Math.round(totalSeconds % 60);
  return m ? `${m} min${s ? ` ${s} s` : ""}` : `${s} s`;
}
const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

function Card({ title, children, note }: { title: string; children: ReactNode; note?: string }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      {children}
      {note && <p className="mt-3 text-xs text-slate-500">{note}</p>}
    </section>
  );
}

function ScoreRing({ score, max }: { score: number; max: number }) {
  const radius = 52, circumference = 2 * Math.PI * radius;
  const share = max > 0 ? Math.min(1, Math.max(0, score / max)) : 0;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="12" />
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#60a5fa" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${circumference * share} ${circumference}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black tabular-nums">{score}</span>
        <span className="text-xs text-slate-300">out of {max}</span>
      </div>
    </div>
  );
}

/** Correct / wrong / skipped as one proportional bar. */
function OutcomeBar({ correct, incorrect, unanswered }: { correct: number; incorrect: number; unanswered: number }) {
  const total = correct + incorrect + unanswered;
  const w = (n: number) => `${total ? (n / total) * 100 : 0}%`;
  return (
    <div className="flex h-3 overflow-hidden rounded-full bg-slate-100" role="img"
      aria-label={`${correct} correct, ${incorrect} wrong, ${unanswered} skipped`}>
      <div className="bg-emerald-500" style={{ width: w(correct) }} />
      <div className="bg-rose-500" style={{ width: w(incorrect) }} />
      <div className="bg-slate-300" style={{ width: w(unanswered) }} />
    </div>
  );
}

export default function AfcatResultAnalysis({
  title = "AFCAT Full Mock",
  status,
  summary,
  report,
}: {
  title?: string;
  status: string;
  summary: AfcatResultSummary;
  report: AfcatResultReport | null;
}) {
  const analysis = report?.analysis;
  const review = useMemo(() => report?.review ?? [], [report]);
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [filter, setFilter] = useState<Filter>("INCORRECT");
  const [section, setSection] = useState<AfcatSection | "ALL">("ALL");
  const [topicSection, setTopicSection] = useState<AfcatSection | "ALL">("ALL");
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
  const openReview = (nextSection: AfcatSection | "ALL", nextFilter: Filter, position?: number) => {
    setSection(nextSection);
    setFilter(nextFilter);
    setTab("REVIEW");
    window.setTimeout(() => {
      const target = position ? document.getElementById(`afcat-review-${position}`) : document.getElementById("afcat-review");
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };
  const topicRows = (analysis?.topics ?? []).filter((t) => topicSection === "ALL" || t.section === topicSection);
  const sectionTimeMax = Math.max(1, ...(analysis?.sections ?? []).map((s) => s.timeSeconds));

  return (
    <section aria-label="Exam results" className="space-y-4">
      {/* Hero */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#081b35] to-[#0f2f5c] p-5 text-white shadow-lg sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
          Test complete · {status === "EXPIRED" ? "Time ran out" : "Submitted"}
        </p>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={summary.score} max={summary.max_marks} />
          <div className="w-full min-w-0 flex-1">
            <h2 className="text-center text-2xl font-black sm:text-left">{title}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Correct", `${summary.correct_count}`, `+${summary.correct_count * 3} marks`, "text-emerald-300"],
                ["Wrong", `${summary.incorrect_count}`, `−${summary.incorrect_count} marks`, "text-rose-300"],
                ["Skipped", `${summary.unanswered_count}`, "0 marks", "text-slate-300"],
                ["Accuracy", `${accuracy}%`, `${attempted} attempted`, "text-blue-200"],
              ].map(([term, value, note, tone]) => (
                <div key={term} className="rounded-2xl bg-white/10 p-3">
                  <dt className="text-xs text-slate-300">{term}</dt>
                  <dd className={`text-2xl font-black tabular-nums ${tone}`}>{value}</dd>
                  <dd className="text-xs text-slate-300">{note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-300">
          Scored by the server at +3 correct, −1 wrong, 0 skipped. This is a Defence Pathshala practice mock and does not predict your AFCAT result or cut-off.
        </p>
      </div>

      {!analysis ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Detailed analysis is not available for this attempt.
        </p>
      ) : (
        <>
          <div role="tablist" aria-label="Result sections"
            className="sticky top-[68px] z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-2">
            {TABS.map((t) => (
              <button key={t.key} role="tab" type="button" id={`afcat-tab-${t.key}`} aria-selected={tab === t.key}
                aria-controls={`afcat-panel-${t.key}`} onClick={() => setTab(t.key)}
                className={`min-h-11 shrink-0 rounded-xl px-4 text-sm font-semibold transition-colors ${tab === t.key ? "bg-[#081b35] text-white" : "text-slate-600 hover:bg-white"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "OVERVIEW" && (
            <div role="tabpanel" id="afcat-panel-OVERVIEW" aria-labelledby="afcat-tab-OVERVIEW" className="space-y-4">
              <section aria-label="Your next steps" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                <h3 className="mb-3 text-base font-bold text-emerald-950">Your next steps</h3>
                {analysis.recommendations.length ? (
                  <ol className="space-y-3">
                    {analysis.recommendations.map((r, i) => (
                      <li key={r.kind} className="rounded-xl bg-white p-4">
                        <p className="font-semibold text-slate-900">{i + 1}. {r.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{r.reason}</p>
                        {r.section && (
                          <button type="button" onClick={() => openReview(r.section!, "INCORRECT")}
                            className="mt-2 min-h-11 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">
                            Review {sectionLabel(r.section)} mistakes →
                          </button>
                        )}
                        {r.topics?.length ? (
                          <button type="button" onClick={() => setTab("TOPICS")}
                            className="mt-2 min-h-11 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">
                            See topic breakdown →
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm leading-6 text-emerald-950">
                    No single weak area stands out. Go through your wrong answers in the Review tab and note why each one went wrong.
                  </p>
                )}
              </section>

              <Card title="Section snapshot">
                <div className="space-y-4">
                  {analysis.sections.filter((s) => s.total).map((s) => (
                    <div key={s.section}>
                      <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                        <span className="font-semibold">{s.label}</span>
                        <span className="font-bold tabular-nums">{s.marks}<span className="font-normal text-slate-500"> / {s.maximumMarks}</span></span>
                      </div>
                      <OutcomeBar correct={s.correct} incorrect={s.incorrect} unanswered={s.unanswered} />
                    </div>
                  ))}
                </div>
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />Correct</span>
                  <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-rose-500" />Wrong</span>
                  <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-slate-300" />Skipped</span>
                </p>
              </Card>

              {review.length > 0 && (
                <Card title="Question map" note="Tap a question to see it with its explanation.">
                  <div className="grid grid-cols-10 gap-1.5">
                    {review.map((row) => {
                      const outcome = afcatOutcome(row);
                      return (
                        <button key={row.questionId} type="button" onClick={() => openReview("ALL", "ALL", row.position)}
                          aria-label={`Question ${row.position}, ${OUTCOME[outcome].label}${row.markedForReview ? ", marked for review" : ""}`}
                          className={`relative aspect-square rounded-md text-[11px] font-bold ${OUTCOME[outcome].tile}`}>
                          {row.position}
                          {row.markedForReview && <span aria-hidden="true" className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-violet-600" />}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}
            </div>
          )}

          {tab === "SECTIONS" && (
            <div role="tabpanel" id="afcat-panel-SECTIONS" aria-labelledby="afcat-tab-SECTIONS" className="grid gap-4 sm:grid-cols-2">
              {analysis.sections.filter((s) => s.total).map((s) => (
                <section key={s.section} aria-label={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold">{s.label}</h3>
                    <p className="shrink-0 text-2xl font-black tabular-nums">{s.marks}<span className="text-sm font-medium text-slate-500"> / {s.maximumMarks}</span></p>
                  </div>
                  <div className="mt-3"><OutcomeBar correct={s.correct} incorrect={s.incorrect} unanswered={s.unanswered} /></div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-emerald-50 p-2"><dd className="text-lg font-bold text-emerald-800">{s.correct}</dd><dt className="text-emerald-800">Correct</dt></div>
                    <div className="rounded-lg bg-rose-50 p-2"><dd className="text-lg font-bold text-rose-800">{s.incorrect}</dd><dt className="text-rose-800">Wrong</dt></div>
                    <div className="rounded-lg bg-slate-100 p-2"><dd className="text-lg font-bold text-slate-700">{s.unanswered}</dd><dt className="text-slate-700">Skipped</dt></div>
                  </dl>
                  <p className="mt-3 text-sm text-slate-700">
                    {s.accuracyPercent}% accuracy on {s.attempted} attempted
                    {s.negativeMarks ? `, −${s.negativeMarks} from wrong answers` : ""}.
                    {s.averageSecondsPerAttempt
                      ? ` About ${s.averageSecondsPerAttempt} s per attempt against the ${AFCAT_PACE_SECONDS} s paper average.`
                      : ""}
                  </p>
                  {s.incorrect + s.unanswered > 0 && (
                    <button type="button" onClick={() => openReview(s.section, s.incorrect ? "INCORRECT" : "UNANSWERED")}
                      className="mt-2 min-h-11 text-sm font-semibold text-blue-700 underline-offset-2 hover:underline">
                      Review these questions →
                    </button>
                  )}
                </section>
              ))}
              {analysis.difficulty.length > 0 && (
                <div className="sm:col-span-2">
                  <Card title="By difficulty" note="Difficulty labels are Defence Pathshala estimates, not official ratings.">
                    <ul className="space-y-3 text-sm">
                      {analysis.difficulty.map((d) => (
                        <li key={d.difficulty}>
                          <div className="mb-1 flex justify-between gap-2">
                            <span className="font-semibold capitalize">{d.difficulty.toLowerCase()} <span className="font-normal text-slate-500">({d.total} questions)</span></span>
                            <span className="tabular-nums">{d.correct} correct · {d.attempted ? `${d.accuracyPercent}% accuracy` : "not attempted"}</span>
                          </div>
                          <OutcomeBar correct={d.correct} incorrect={d.incorrect} unanswered={d.unanswered} />
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          )}

          {tab === "TOPICS" && (
            <div role="tabpanel" id="afcat-panel-TOPICS" aria-labelledby="afcat-tab-TOPICS">
              <Card title="Topics ranked by marks lost" note="Marks lost = marks available minus marks scored, so skipped questions count too.">
                <label className="mb-3 block text-sm">
                  <span className="sr-only">Section</span>
                  <select value={topicSection} onChange={(e) => setTopicSection(e.target.value as AfcatSection | "ALL")}
                    className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 sm:w-auto">
                    <option value="ALL">All sections</option>
                    {AFCAT_SECTIONS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </label>
                <ul className="divide-y divide-slate-100">
                  {topicRows.map((t) => (
                    <li key={`${t.section}-${t.topic}`} className="py-3">
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="min-w-0">
                          <span className="font-semibold">{t.topic}</span>
                          <span className="block text-xs text-slate-500">{sectionLabel(t.section)} · {t.correct}/{t.total} correct</span>
                        </span>
                        <span className={`shrink-0 font-bold tabular-nums ${t.marksLost ? "text-rose-700" : "text-emerald-700"}`}>
                          {t.marksLost ? `−${t.marksLost}` : "No marks lost"}
                        </span>
                      </div>
                      <div className="mt-2"><OutcomeBar correct={t.correct} incorrect={t.incorrect} unanswered={t.unanswered} /></div>
                    </li>
                  ))}
                  {topicRows.length === 0 && <li className="py-3 text-sm text-slate-600">No topics in this section.</li>}
                </ul>
              </Card>
            </div>
          )}

          {tab === "TIME" && (
            <div role="tabpanel" id="afcat-panel-TIME" aria-labelledby="afcat-tab-TIME" className="space-y-4">
              {analysis.time.recorded ? (
                <>
                  <Card title="Time on questions">
                    <p className="text-sm text-slate-700">
                      You spent <strong>{duration(analysis.time.totalSeconds)}</strong> on questions out of 120 min. The paper averages {AFCAT_PACE_SECONDS} s per question.
                      {analysis.time.costlyMisses > 0 && ` ${analysis.time.costlyMisses} wrong answers took longer than ${AFCAT_PACE_SECONDS} s each.`}
                    </p>
                    <div className="mt-4 space-y-3">
                      {analysis.sections.filter((s) => s.total).map((s) => (
                        <div key={s.section}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="font-semibold">{s.label}</span>
                            <span className="tabular-nums text-slate-600">{duration(s.timeSeconds)}</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                            <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct(s.timeSeconds, sectionTimeMax)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  {review.length > 0 && (
                    <Card title="Time per question" note={`Bars show seconds spent, capped at ${AFCAT_PACE_SECONDS * 3} s. Colour shows the outcome. Tap a bar to open the question.`}>
                      <div className="flex h-32 items-end gap-px overflow-x-auto" role="group" aria-label="Time spent on each question">
                        {review.map((row) => {
                          const outcome = afcatOutcome(row);
                          const height = Math.max(3, Math.round((Math.min(row.timeSpentSeconds, AFCAT_PACE_SECONDS * 3) / (AFCAT_PACE_SECONDS * 3)) * 100));
                          return (
                            <button key={row.questionId} type="button" onClick={() => openReview("ALL", "ALL", row.position)}
                              aria-label={`Question ${row.position}, ${duration(row.timeSpentSeconds)}, ${OUTCOME[outcome].label}`}
                              className="group flex h-full min-w-[5px] flex-1 items-end">
                              <span className={`block w-full rounded-t-sm ${OUTCOME[outcome].bar}`} style={{ height: `${height}%` }} />
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-slate-500"><span>Q1</span><span>Q{review.length}</span></div>
                    </Card>
                  )}
                  {analysis.time.slowQuestions.length > 0 && (
                    <Card title={`Slowest questions (over ${AFCAT_PACE_SECONDS * 2} s)`}>
                      <div className="flex flex-wrap gap-2">
                        {analysis.time.slowQuestions.map((q) => (
                          <button key={q.position} type="button" onClick={() => openReview("ALL", "ALL", q.position)}
                            className={`min-h-11 rounded-lg border px-3 text-xs font-semibold ${OUTCOME[q.outcome].chip}`}>
                            Q{q.position} · {duration(q.seconds)} · {OUTCOME[q.outcome].label}
                          </button>
                        ))}
                      </div>
                    </Card>
                  )}
                </>
              ) : (
                <Card title="Time on questions">
                  <p className="text-sm text-slate-600">Time per question was not recorded for this attempt.</p>
                </Card>
              )}
            </div>
          )}

          {tab === "REVIEW" && (
            <div role="tabpanel" id="afcat-panel-REVIEW" aria-labelledby="afcat-tab-REVIEW">
              <section id="afcat-review" aria-label="Question review" className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
                        <li key={row.questionId} id={`afcat-review-${row.position}`} className="scroll-mt-32 rounded-xl border border-slate-200 p-4">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-slate-900">Q{row.position}</span>
                            <span className={`rounded-full border px-2 py-0.5 font-semibold ${OUTCOME[outcome].chip}`}>{OUTCOME[outcome].label}</span>
                            <span className="text-slate-500">{sectionLabel(row.section)}{row.topic ? ` · ${row.topic}` : ""}</span>
                            {row.timeSpentSeconds > 0 && <span className="text-slate-500">· {duration(row.timeSpentSeconds)}</span>}
                            {row.markedForReview && <span className="text-violet-700">· Marked</span>}
                          </div>
                          <div className="mt-3"><AfcatContentBlock content={row.question.stem} /></div>
                          <ul className="mt-3 space-y-1.5">
                            {row.question.options.map((o) => {
                              const isCorrect = o.key === row.correct, isYours = o.key === row.selected;
                              return (
                                <li key={o.key} className={`flex gap-2 rounded-lg border px-3 py-2 text-sm ${isCorrect ? "border-emerald-300 bg-emerald-50" : isYours ? "border-rose-300 bg-rose-50" : "border-slate-100"}`}>
                                  <span className="font-bold">{o.key}.</span>
                                  <div className="min-w-0 flex-1"><AfcatContentBlock content={o.content} /></div>
                                  {isCorrect && <span className="shrink-0 text-xs font-semibold text-emerald-800">Correct answer</span>}
                                  {isYours && !isCorrect && <span className="shrink-0 text-xs font-semibold text-rose-800">Your answer</span>}
                                </li>
                              );
                            })}
                          </ul>
                          {row.explanation && (
                            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700"><strong>Why: </strong>{row.explanation}</p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>
            </div>
          )}
        </>
      )}

      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <Link href="/afcat" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 hover:border-blue-400">
          Back to AFCAT home
        </Link>
      </div>
    </section>
  );
}
