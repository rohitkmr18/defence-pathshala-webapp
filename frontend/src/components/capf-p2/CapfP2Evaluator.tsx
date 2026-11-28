"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Camera, CheckCircle2, ChevronDown, ImagePlus, Loader2, PenLine, RotateCcw, Sparkles, Trash2, X } from "lucide-react";
import { CAPF_P2_YEARS, CAPF_P2_PATH } from "@/lib/capf-paper2-pyqs";
import { CAPF_P2_LIMITS, countWords, findTarget, type CapfP2Evaluation } from "@/lib/capf-p2-evaluator";

type Mode = "typed" | "photo";
interface Photo { id: string; url: string; mediaType: "image/jpeg"; data: string }
interface HistoryRow {
  id: string; exam_year: number; question: 1 | 2; part: string; input_mode: Mode;
  total_score: number; created_at: string; result: CapfP2Evaluation; answer_text: string | null;
}

const MAX_EDGE = 1600;
const noopSubscribe = () => () => {};

function readDraft(key: string): string {
  try { return window.localStorage.getItem(key) ?? ""; } catch { return ""; }
}

async function fetchHistory(): Promise<{ limit: number; remaining: number; evaluations: HistoryRow[] } | null> {
  try {
    const res = await fetch("/api/capf-paper2/evaluations", { cache: "no-store" });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/** Downscale a photo in the browser and return base64 JPEG (keeps uploads small and fast). */
async function compress(file: File): Promise<{ url: string; data: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL("image/jpeg", 0.82);
  return { url, data: url.split(",")[1] };
}

function readParams(sp: URLSearchParams) {
  const t = findTarget(sp.get("y"), sp.get("q"), sp.get("p"));
  if (t) return { year: t.year, question: t.question, part: t.part };
  return { year: CAPF_P2_YEARS[0].year, question: 1 as 1 | 2, part: "a" };
}

export default function CapfP2Evaluator() {
  const searchParams = useSearchParams();
  const initial = useMemo(() => readParams(searchParams), [searchParams]);
  const [year, setYear] = useState(initial.year);
  const [question, setQuestion] = useState<1 | 2>(initial.question);
  const [part, setPart] = useState(initial.part);
  const [mode, setMode] = useState<Mode>("typed");
  const [edited, setEdited] = useState<Record<string, string>>({});
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ evaluation: CapfP2Evaluation; answer: string | null; label: string } | null>(null);
  const [quota, setQuota] = useState<{ limit: number; remaining: number } | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [started, setStarted] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const fileRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const target = findTarget(year, question, part)!;
  const draftKey = `dp_capf_p2_draft_${year}_${question}_${part}`;
  const answer = edited[draftKey] ?? (isClient ? readDraft(draftKey) : "");
  const words = countWords(answer);

  const applyHistory = useCallback((body: Awaited<ReturnType<typeof fetchHistory>>) => {
    if (!body) return;
    setQuota({ limit: body.limit, remaining: body.remaining });
    setHistory(body.evaluations ?? []);
  }, []);
  const loadHistory = useCallback(() => fetchHistory().then(applyHistory), [applyHistory]);

  useEffect(() => {
    let active = true;
    fetchHistory().then((body) => { if (active) applyHistory(body); });
    return () => { active = false; };
  }, [applyHistory]);

  function updateAnswer(text: string) {
    setEdited((all) => ({ ...all, [draftKey]: text }));
    try { if (text) window.localStorage.setItem(draftKey, text); else window.localStorage.removeItem(draftKey); } catch { /* storage blocked */ }
  }

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [started]);

  const yearRow = CAPF_P2_YEARS.find((y) => y.year === year)!;
  const items = (question === 1 ? yearRow.q1 : yearRow.q2).items;

  function chooseQuestion(nextYear: number, nextQ: 1 | 2) {
    setYear(nextYear);
    setQuestion(nextQ);
    setPart("a");
    setResult(null);
    setError(null);
    setStarted(null);
  }

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    setError(null);
    const room = CAPF_P2_LIMITS.maxImages - photos.length;
    const picked = Array.from(files).slice(0, Math.max(0, room));
    try {
      const done = await Promise.all(picked.map(async (f) => ({ id: `${Date.now()}-${f.name}-${Math.random()}`, mediaType: "image/jpeg" as const, ...(await compress(f)) })));
      setPhotos((p) => [...p, ...done]);
      if (files.length > room) setError(`Up to ${CAPF_P2_LIMITS.maxImages} pages per answer.`);
    } catch {
      setError("Could not read that photo. Try a JPEG or PNG image.");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function submit() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/capf-paper2/evaluate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          year, question, part, mode,
          ...(mode === "typed" ? { answer } : { images: photos.map(({ mediaType, data }) => ({ mediaType, data })) }),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult({ evaluation: body.evaluation, answer: mode === "typed" ? answer : body.evaluation.transcription, label: `CAPF ${year} · Q${question}(${part})` });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
      void loadHistory();
    } catch {
      setError("Network problem. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const elapsed = started ? Math.floor((now - started) / 1000) : 0;
  const timeTarget = question === 1 ? 25 * 60 : 30 * 60;
  const canSubmit = !busy && (quota === null || quota.remaining > 0)
    && (mode === "typed" ? words >= CAPF_P2_LIMITS.minWords && words <= CAPF_P2_LIMITS.maxWords : photos.length > 0);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">CAPF AC Paper II · Answer evaluator</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">Write. Get marked. Improve.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Answer a real Q1 essay or Q2 for-and-against question, typed or as a photo of your handwritten page.
          You get marks out of 20 on a UPSC-style rubric, with specific fixes and an outline of a top answer.
        </p>
        {quota && (
          <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {quota.remaining} of {quota.limit} free evaluations left today
          </p>
        )}
      </header>

      <section aria-label="Choose a question" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <label className="text-xs font-bold uppercase tracking-wide text-slate-500">Year
            <select value={year} onChange={(e) => chooseQuestion(Number(e.target.value), question)} className="mt-1 block min-h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-900">
              {CAPF_P2_YEARS.map((y) => <option key={y.year} value={y.year}>{y.year}</option>)}
            </select>
          </label>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Question
            <div className="mt-1 flex gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1">
              {([1, 2] as const).map((q) => (
                <button key={q} type="button" onClick={() => chooseQuestion(year, q)} aria-pressed={question === q}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold normal-case tracking-normal ${question === q ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}>
                  {q === 1 ? "Q1 Essay" : "Q2 Arguments"}
                </button>
              ))}
            </div>
          </div>
        </div>
        <fieldset className="mt-4">
          <legend className="text-xs font-bold uppercase tracking-wide text-slate-500">{question === 1 ? "Essay topic" : "Statement"}</legend>
          <div className="mt-2 grid gap-2">
            {items.map((i) => (
              <label key={i.part} className={`flex cursor-pointer gap-3 rounded-xl border p-3 text-sm ${part === i.part ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                <input type="radio" name="capf-p2-part" value={i.part} checked={part === i.part} onChange={() => { setPart(i.part); setResult(null); setStarted(null); }} className="mt-1" />
                <span>
                  <span className="font-semibold text-slate-900">({i.part}) {i.en}</span>
                  {i.hi && <span className="mt-0.5 block text-slate-600" lang="hi">{i.hi}</span>}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-xs text-slate-500">{target.q.directionEn.replace(/\s*:$/, "")} · {question === 1 ? "20 marks · Hindi or English" : "20 marks · English only · no word limit stated"}</p>
      </section>

      <section aria-label="Answer input" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {([["typed", "Type answer", PenLine], ["photo", "Upload photo", Camera]] as const).map(([m, label, Icon]) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(null); }} aria-pressed={mode === m}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${mode === m ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
          {mode === "typed" && (
            <span className="ml-auto flex items-center gap-3 text-xs font-semibold text-slate-600">
              <span className={question === 1 && (words < 250 || words > 350) && words > 0 ? "text-amber-700" : ""}>
                {words} words{question === 1 ? " · target ~300" : ""}
              </span>
              {started ? (
                <span className={elapsed > timeTarget ? "text-red-600" : ""}>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} / {timeTarget / 60}:00</span>
              ) : (
                <button type="button" onClick={() => { setStarted(Date.now()); setNow(Date.now()); }} className="rounded-md border border-slate-200 px-2 py-1 hover:bg-slate-50">Start timer</button>
              )}
            </span>
          )}
        </div>

        {mode === "typed" ? (
          <textarea value={answer} onChange={(e) => { updateAnswer(e.target.value); if (!started && e.target.value) { setStarted(Date.now()); setNow(Date.now()); } }}
            rows={14} maxLength={CAPF_P2_LIMITS.maxChars} aria-label="Your answer"
            placeholder={question === 1 ? "Introduction → body paragraphs → conclusion. Hindi or English." : "Arguments for:\n1. …\n\nArguments against:\n1. …"}
            className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-[15px] leading-7 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        ) : (
          <div className="mt-4">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple className="sr-only" id="capf-p2-photos" onChange={(e) => void addPhotos(e.target.files)} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((p, n) => (
                <div key={p.id} className="relative overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Page ${n + 1}`} className="aspect-[3/4] w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 text-xs font-bold text-white">{n + 1}</span>
                  <button type="button" onClick={() => setPhotos((all) => all.filter((x) => x.id !== p.id))} aria-label={`Remove page ${n + 1}`}
                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-slate-700 shadow"><X className="h-4 w-4" /></button>
                </div>
              ))}
              {photos.length < CAPF_P2_LIMITS.maxImages && (
                <label htmlFor="capf-p2-photos" className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-center text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-700">
                  <ImagePlus className="h-6 w-6" /> Add page {photos.length + 1}
                </label>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500">Up to {CAPF_P2_LIMITS.maxImages} pages, in order. Shoot flat, in good light, one page per photo. Photos are read for evaluation and are not stored; the transcription is saved with your result.</p>
          </div>
        )}

        {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => void submit()} disabled={!canSubmit}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-40">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {busy ? "Evaluating… (about 30 seconds)" : "Evaluate my answer"}
          </button>
          {mode === "typed" && answer && !busy && (
            <button type="button" onClick={() => { updateAnswer(""); setStarted(null); setResult(null); }} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-800">
              <Trash2 className="h-4 w-4" /> Clear
            </button>
          )}
          {quota && quota.remaining === 0 && <span className="text-sm font-semibold text-amber-700">Daily limit reached. Your draft is saved; come back tomorrow.</span>}
        </div>
      </section>

      {result && (
        <div ref={resultRef} className="scroll-mt-24">
          <EvaluationReport evaluation={result.evaluation} answer={result.answer} label={result.label} />
          <button type="button" onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700"><RotateCcw className="h-4 w-4" /> Revise and evaluate again</button>
        </div>
      )}

      {history.length > 0 && (
        <section aria-labelledby="capf-p2-history" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 id="capf-p2-history" className="text-lg font-bold text-slate-900">Your evaluations</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {history.map((h) => {
              const item = findTarget(h.exam_year, h.question, h.part)?.item;
              return (
                <li key={h.id}>
                  <details className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center gap-3">
                      <span className="w-14 shrink-0 text-lg font-black text-slate-900">{Number(h.total_score)}<span className="text-xs font-semibold text-slate-400">/20</span></span>
                      <span className="min-w-0 flex-1 text-sm">
                        <span className="font-semibold text-slate-900">{h.exam_year} · Q{h.question}({h.part})</span>{" "}
                        <span className="text-slate-600">{item?.en}</span>
                        <span className="block text-xs text-slate-400">{new Date(h.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} · {h.input_mode === "photo" ? "Photo" : "Typed"}</span>
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition group-open:rotate-180" />
                    </summary>
                    <div className="mt-3"><EvaluationReport evaluation={h.result} answer={h.answer_text} label={`CAPF ${h.exam_year} · Q${h.question}(${h.part})`} compact /></div>
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <p className="text-xs leading-5 text-slate-500">
        Marks are an AI estimate on a Defence Pathshala rubric for practice, not UPSC marks. Questions are from the official UPSC papers.{" "}
        <Link href={CAPF_P2_PATH} className="font-semibold text-blue-700">Browse all Paper II topics</Link>
      </p>
    </div>
  );
}

export function EvaluationReport({ evaluation: e, answer, label, compact = false }: { evaluation: CapfP2Evaluation; answer: string | null; label: string; compact?: boolean }) {
  const tone = e.band === "Excellent" ? "bg-emerald-600" : e.band === "Good" ? "bg-blue-600" : e.band === "Average" ? "bg-amber-500" : "bg-red-500";
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-4" : "p-5 shadow-sm sm:p-6"}`}>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-slate-900">{e.total}</span>
          <span className="text-lg font-bold text-slate-400">/ {e.max}</span>
        </div>
        <div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${tone}`}>{e.band}</span>
          <p className="mt-1 text-xs text-slate-500">{label} · {e.wordCount} words{e.offTopic ? " · off-topic" : ""}{e.unreadable ? " · hard to read" : ""}</p>
        </div>
      </div>
      {e.examinerNote && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-800">{e.examinerNote}</p>}

      <h3 className="mt-5 text-sm font-bold uppercase tracking-wide text-slate-500">Marks by criterion</h3>
      <ul className="mt-2 space-y-3">
        {e.criteria.map((c) => (
          <li key={c.id}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-900">{c.label}</span>
              <span className="font-bold text-slate-900">{c.score}<span className="text-slate-400">/{c.max}</span></span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${(c.score / c.max) * 100}%` }} /></div>
            {c.comment && <p className="mt-1 text-sm leading-6 text-slate-600">{c.comment}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {e.strengths.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700">What worked</h3>
            <ul className="mt-2 space-y-1.5">{e.strengths.map((s) => <li key={s} className="flex gap-2 text-sm leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{s}</li>)}</ul>
          </div>
        )}
        {e.improvements.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-amber-700">Fix these next</h3>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-700">{e.improvements.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
        )}
      </div>

      {e.modelOutline.length > 0 && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-blue-800">Outline of a top answer</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-800">{e.modelOutline.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}

      {answer && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-slate-600">{e.transcription ? "What the evaluator read from your photo" : "Your answer"}</summary>
          <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">{answer}</p>
        </details>
      )}
    </article>
  );
}
