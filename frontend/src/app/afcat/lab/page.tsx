"use client";
import { useEffect, useState } from "react";
import AfcatVisualQuestion from "@/components/afcat/AfcatVisualQuestion";
import type { AfcatDisplayQuestion, AfcatChoice } from "@/lib/afcat/visual-types";

type Test = { id: string; title: string; expected_questions: number; duration_seconds: number };
type Answer = { selected: AfcatChoice["key"] | null; markedForReview: boolean };
type Paper = { session: { id: string; title: string; status: string; deadline: string; expired: boolean };
  questions: AfcatDisplayQuestion[];
  responses: { question_id: string; selected_option: AfcatChoice["key"] | null; marked_for_review: boolean }[] };
async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
export default function AfcatLab() {
  const [tests, setTests] = useState<Test[]>([]);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; max_marks: number; correct_count: number; incorrect_count: number; unanswered_count: number } | null>(null);
  const [sections, setSections] = useState<{ section: string; label: string; total: number; attempted: number; correct: number; incorrect: number; unanswered: number; marks: number; accuracyPercent: number }[]>([]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    api("/api/afcat/tests").then(x => setTests(x.tests)).catch(e => setError(String(e.message)));
    const handle = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(handle);
  }, []);
  async function start(testId: string) {
    try {
      setError("");
      const started = await api("/api/afcat/sessions", { method: "POST",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testId }) });
      const data: Paper = await api(`/api/afcat/sessions/${started.sessionId}`);
      setPaper(data);
      setAnswers(Object.fromEntries(data.responses.map(r => [r.question_id,
        { selected: r.selected_option, markedForReview: r.marked_for_review }])));
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to start test"); }
  }
  async function submit() {
    if (!paper || busy || submitting) return;
    setSubmitting(true);
    try {
      await api(`/api/afcat/sessions/${paper.session.id}/submit`, { method: "POST" });
      const completed = await api(`/api/afcat/sessions/${paper.session.id}/result`);
      setResult(completed.summary);
      setSections(completed.sections ?? []);
      setPaper(old => old ? { ...old, session: { ...old.session, status: completed.status } } : old);
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Submission failed"); }
    finally { setSubmitting(false); }
  }
  const question = paper?.questions[index];
  const left = paper ? Math.max(0, Math.ceil((Date.parse(paper.session.deadline) - now) / 1000)) : 0;
  const active = paper?.session.status === "IN_PROGRESS" && !paper.session.expired && left > 0;
  async function save(id: string, answer: Answer) {
    if (!paper || !active || busy) return;
    setBusy(true);
    try {
      await api(`/api/afcat/sessions/${paper.session.id}/responses`, { method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: id, ...answer }) });
      setAnswers(old => ({ ...old, [id]: answer }));
    } catch(e) { setError(e instanceof Error ? e.message : "Autosave failed"); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
    <div className="mx-auto max-w-4xl space-y-5">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Internal staging lab — not a released exam</p>
      <h1 className="text-2xl font-bold">AFCAT Test Player</h1>
      {error && <p role="alert" className="rounded-xl bg-amber-100 p-4">{error}</p>}
      {!paper ? <section className="space-y-3">
        {tests.length === 0 && <p>No published staging tests available.</p>}
        {tests.map(t => <button key={t.id} onClick={() => start(t.id)}
          className="block w-full rounded-xl border bg-white p-4 text-left font-bold">
          {t.title} — {t.expected_questions} questions · {Math.round(t.duration_seconds / 60)} minutes
        </button>)}
      </section> : <div className="space-y-4">
        <div className="flex justify-between rounded-xl bg-white p-4">
          <span className="font-bold">{paper.session.title}</span>
          <span role="timer" className="font-mono font-bold">{Math.floor(left / 3600)}:{String(Math.floor(left % 3600 / 60)).padStart(2,"0")}:{String(left % 60).padStart(2,"0")}</span>
        </div>
        {question && <AfcatVisualQuestion key={question.id} question={question}
          selected={answers[question.id]?.selected ?? null} disabled={!active || busy}
          onSelect={selected => void save(question.id,
            { selected, markedForReview: answers[question.id]?.markedForReview ?? false })}/>}
        {question && <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={answers[question.id]?.markedForReview ?? false}
            disabled={!active || busy} onChange={e => void save(question.id,
              { selected: answers[question.id]?.selected ?? null, markedForReview: e.target.checked })}/>
          Mark for Review
        </label>}
        <nav className="flex flex-wrap gap-2" aria-label="Question navigation">
          {paper.questions.map((q,i) => <button type="button" key={q.id}
            aria-label={`Question ${i+1}`} aria-current={i===index?"step":undefined}
            onClick={() => setIndex(i)}
            className={`min-h-10 min-w-10 rounded-lg border ${i===index?"border-blue-600":""} ${answers[q.id]?.markedForReview?"bg-violet-100":answers[q.id]?.selected?"bg-green-100":"bg-white"}`}>
            {i+1}
          </button>)}
        </nav>
        <div className="flex justify-between">
          <button disabled={index===0} onClick={() => setIndex(i => i-1)}>Previous</button>
          <span className="text-sm">{busy ? "Saving…" : "Saved answers remain in staging"}</span>
          <button disabled={index===paper.questions.length-1} onClick={() => setIndex(i => i+1)}>Next</button>
        </div>
        {result && <section aria-label="Exam results" className="rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="text-xl font-bold">Result: {result.score}/{result.max_marks}</h2>
          <p className="text-sm">Correct: {result.correct_count} · Incorrect: {result.incorrect_count} · Unanswered: {result.unanswered_count}</p>
          <p className="mt-2 text-xs">Synthetic QA mock only; not a real AFCAT performance indicator.</p>
          {sections.length > 0 && <div className="mt-4 space-y-3" aria-label="Section breakdown">
            {sections.map(section => <div key={section.section} className="rounded-lg border border-green-200 bg-white p-3">
              <div className="flex flex-wrap justify-between gap-2"><strong>{section.label}</strong><span className="font-semibold">{section.marks}/{section.total * 3} marks</span></div>
              <p className="mt-1 text-sm text-slate-600">{section.correct} correct · {section.incorrect} incorrect · {section.unanswered} unanswered</p>
              <p className="text-sm text-slate-600">{section.accuracyPercent}% accuracy among attempted questions</p>
            </div>)}
          </div>}
        </section>}
        {!result && <button type="button" disabled={busy || submitting || paper.session.status !== "IN_PROGRESS"}
          onClick={() => { if (window.confirm("Submit this staging test? You cannot edit answers afterwards.")) void submit(); }}
          className="w-full rounded-xl bg-blue-700 p-3 font-semibold text-white disabled:opacity-50">
          {submitting ? "Submitting…" : "Submit & View Results"}
        </button>}
      </div>}
    </div>
  </main>;
}
