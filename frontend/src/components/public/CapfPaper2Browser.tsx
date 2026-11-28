"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PenLine, Shuffle } from "lucide-react";
import { capfP2Anchor, type CapfP2Theme, type CapfP2Year } from "@/lib/capf-paper2-pyqs";

type Show = "all" | "q1" | "q2";

interface Props {
  years: CapfP2Year[];
  themes: CapfP2Theme[];
}

const CHIP = "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors";
const chipClass = (on: boolean) => `${CHIP} ${on ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`;

export default function CapfPaper2Browser({ years, themes }: Props) {
  const [show, setShow] = useState<Show>("all");
  const [theme, setTheme] = useState<CapfP2Theme | "">("");
  const [hindi, setHindi] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);

  const filtered = useMemo(() => years.map((y) => ({
    year: y.year,
    questions: [y.q1, y.q2]
      .filter((q) => show === "all" || (show === "q1" ? q.number === 1 : q.number === 2))
      .map((q) => ({ ...q, items: q.items.filter((i) => !theme || i.theme === theme) }))
      .filter((q) => q.items.length > 0),
  })).filter((y) => y.questions.length > 0), [years, show, theme]);

  const visibleCount = filtered.reduce((n, y) => n + y.questions.reduce((m, q) => m + q.items.length, 0), 0);

  function pickRandom() {
    const pool = filtered.flatMap((y) => y.questions.flatMap((q) => q.items.map((i) => capfP2Anchor(y.year, q.number, i.part))));
    if (pool.length === 0) return;
    const id = pool[Math.floor(Math.random() * pool.length)];
    setPicked(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div>
      <div className="sticky top-20 z-10 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-bold uppercase tracking-wide text-slate-500">Show</span>
          {([["all", "Q1 + Q2"], ["q1", "Q1 Essays"], ["q2", "Q2 Arguments"]] as const).map(([v, label]) => (
            <button key={v} type="button" onClick={() => setShow(v)} aria-pressed={show === v} className={chipClass(show === v)}>{label}</button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-slate-700">
            <input type="checkbox" checked={hindi} onChange={(e) => setHindi(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            हिंदी भी दिखाएँ (Q1)
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label htmlFor="capf-p2-theme" className="text-xs font-bold uppercase tracking-wide text-slate-500">Theme</label>
          <select id="capf-p2-theme" value={theme} onChange={(e) => setTheme(e.target.value as CapfP2Theme | "")}
            className="min-h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-800">
            <option value="">All themes</option>
            {themes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="text-xs text-slate-500" aria-live="polite">{visibleCount} shown</span>
          <button type="button" onClick={pickRandom} disabled={visibleCount === 0}
            className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40">
            <Shuffle className="h-3.5 w-3.5" /> Pick a random topic
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">No questions match these filters.</p>
      )}

      <div className="space-y-8">
        {filtered.map((y) => (
          <section key={y.year} id={`year-${y.year}`} aria-labelledby={`year-${y.year}-h`} className="scroll-mt-40 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 id={`year-${y.year}-h`} className="text-xl font-extrabold text-slate-900">CAPF AC {y.year} · Paper II</h2>
            {y.questions.map((q) => (
              <div key={q.number} className="mt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    <span className={`mr-2 rounded-md px-2 py-0.5 text-xs ${q.number === 1 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-800"}`}>Q{q.number}</span>
                    {q.directionEn}
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{q.marks}</span>
                </div>
                {hindi && q.directionHi && <p className="mt-1 text-sm text-slate-600" lang="hi">{q.directionHi}</p>}
                <ol className="mt-3 space-y-2">
                  {q.items.map((item) => {
                    const id = capfP2Anchor(y.year, q.number, item.part);
                    return (
                      <li key={id} id={id}
                        className={`scroll-mt-40 rounded-xl border p-3 transition-colors ${picked === id ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : "border-slate-100 bg-slate-50/60"}`}>
                        <div className="flex gap-3">
                          <span className="mt-0.5 text-sm font-bold text-slate-400">({item.part})</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium leading-6 text-slate-900">{item.en}</p>
                            {hindi && item.hi && <p className="mt-1 text-sm leading-6 text-slate-600" lang="hi">{item.hi}</p>}
                            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{item.theme}</p>
                              <Link href={`/dashboard/capf-paper-2?y=${y.year}&q=${q.number}&p=${item.part}`}
                                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50">
                                <PenLine className="h-3.5 w-3.5" /> Write &amp; get it evaluated
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
