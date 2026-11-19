"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MockQuestion from "@/components/mock/MockQuestion";
import { trackMockFunnel } from "@/lib/mock/funnel";
import type { MockLearnerQuestion } from "@/lib/mock/serialize";
import type { MockBucket, MockOutcome } from "@/lib/mock/results";

export type MockResultReport = {
  status: string;
  title: string;
  summary: { score: number; max_marks: number; correct_count: number; incorrect_count: number; unanswered_count: number; attempted: number; accuracyPercent: number };
  marking: { correctPoints: number; wrongPoints: number; pointsDivisor: number };
  analysis: { subjects: MockBucket[]; difficulties: MockBucket[] };
  review: {
    questionId: string; position: number; subject: string; difficulty: string; topic: string | null;
    selected: "A" | "B" | "C" | "D" | null; correct: "A" | "B" | "C" | "D"; outcome: MockOutcome; marks: number;
    markedForReview: boolean; explanation: string | null; question: MockLearnerQuestion;
  }[];
};
type Filter = "ALL" | "INCORRECT" | "UNANSWERED" | "MARKED";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "INCORRECT", label: "Wrong" }, { key: "UNANSWERED", label: "Skipped" }, { key: "MARKED", label: "Marked" }, { key: "ALL", label: "All" },
];
const CHIP: Record<MockOutcome, string> = {
  CORRECT: "bg-emerald-50 text-emerald-800 border-emerald-200",
  INCORRECT: "bg-rose-50 text-rose-800 border-rose-200",
  UNANSWERED: "bg-slate-100 text-slate-700 border-slate-200",
};
const OUTCOME_LABEL: Record<MockOutcome, string> = { CORRECT: "Correct", INCORRECT: "Wrong", UNANSWERED: "Skipped" };
const signed = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(2)}`;

function BreakdownTable({ title, rows, label }: { title: string; rows: MockBucket[]; label: string }) {
  return (
    <section aria-label={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="text-left text-xs text-slate-500">
            <tr><th className="py-1.5 pr-2 font-semibold">{label}</th><th className="px-2 text-right">Correct</th><th className="px-2 text-right">Wrong</th><th className="px-2 text-right">Skipped</th><th className="pl-2 text-right">Accuracy</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-slate-100">
                <th scope="row" className="py-2 pr-2 text-left font-semibold">{r.key} <span className="font-normal text-slate-500">({r.total})</span></th>
                <td className="px-2 text-right tabular-nums text-emerald-700">{r.correct}</td>
                <td className="px-2 text-right tabular-nums text-rose-700">{r.incorrect}</td>
                <td className="px-2 text-right tabular-nums text-slate-600">{r.unanswered}</td>
                <td className="pl-2 text-right tabular-nums">{r.attempted ? `${r.accuracyPercent.toFixed(0)}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function MockResult({ report }: { report: MockResultReport }) {
  const [filter, setFilter] = useState<Filter>("INCORRECT");
  useEffect(() => { trackMockFunnel("mock_result_view", { status: report.status }, `result:${report.title}`); }, [report.status, report.title]);
  const s = report.summary, m = report.marking;
  const rows = report.review.filter((r) => filter === "ALL" || (filter === "INCORRECT" && r.outcome === "INCORRECT")
    || (filter === "UNANSWERED" && r.outcome === "UNANSWERED") || (filter === "MARKED" && r.markedForReview));
  const per = (n: number) => (n / m.pointsDivisor).toFixed(2);
  return (
    <div className="space-y-5">
      <section aria-label="Score" className="rounded-2xl bg-[#081b35] p-5 text-white shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">{report.title} · {report.status === "EXPIRED" ? "Time expired" : "Submitted"}</p>
        <p className="mt-2 text-5xl font-black tabular-nums" data-testid="score">{s.score.toFixed(2)}<span className="text-2xl font-bold text-blue-200"> / {s.max_marks.toFixed(2)}</span></p>
        <p className="mt-3 text-sm text-blue-100">+{per(m.correctPoints)} per correct answer, −{per(m.wrongPoints)} per wrong answer, 0 for skipped.</p>
      </section>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[["Correct", s.correct_count], ["Wrong", s.incorrect_count], ["Skipped", s.unanswered_count], ["Attempted", s.attempted], ["Accuracy", `${s.accuracyPercent.toFixed(1)}%`]].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-slate-200 bg-white p-3"><dd className="text-xl font-black tabular-nums">{v}</dd><dt className="text-[11px] uppercase tracking-wider text-slate-500">{l}</dt></div>
        ))}
      </dl>
      <div className="grid gap-5 lg:grid-cols-2">
        <BreakdownTable title="By subject" rows={report.analysis.subjects} label="Subject" />
        <BreakdownTable title="By difficulty" rows={report.analysis.difficulties} label="Difficulty" />
      </div>
      <section aria-label="Question review" className="space-y-4">
        <h2 className="text-lg font-black">Review with explanations</h2>
        <div role="group" aria-label="Review filter" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button key={f.key} aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}
              className={`min-h-11 rounded-xl border px-4 text-sm font-semibold ${filter === f.key ? "border-blue-600 bg-blue-50 text-blue-900" : "border-slate-200 bg-white"}`}>{f.label}</button>
          ))}
        </div>
        {!rows.length && <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">Nothing in this filter.</p>}
        {rows.map((r) => (
          <article key={r.questionId} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold">Q{r.position}</span>
              <span className={`rounded-full border px-2 py-0.5 font-semibold ${CHIP[r.outcome]}`}>{OUTCOME_LABEL[r.outcome]} · {signed(r.marks)}</span>
              <span className="text-slate-500">{r.subject}{r.topic ? ` · ${r.topic}` : ""} · {r.difficulty}</span>
              <span className="text-slate-400">DP practice question</span>
            </div>
            <MockQuestion question={r.question} selected={r.selected} correct={r.correct} />
            <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-7">
              <p className="font-bold">Correct answer: {r.correct}{r.selected === null ? " · you skipped this question" : ""}</p>
              {r.explanation && <p className="mt-1 whitespace-pre-line text-slate-700">{r.explanation}</p>}
            </div>
          </article>
        ))}
      </section>
      <Link href="/mock/cds-gk" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 underline">← Back to CDS GK mocks</Link>
    </div>
  );
}
