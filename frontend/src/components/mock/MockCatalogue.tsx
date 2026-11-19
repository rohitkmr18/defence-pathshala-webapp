"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackMockFunnel } from "@/lib/mock/funnel";

type Test = {
  id: string; code: string; title: string; duration_seconds: number; expected_questions: number;
  correct_points: number; wrong_points: number; points_divisor: number; max_marks: number | string;
  blueprint: Record<string, number>;
};

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(20000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
/** "+0.83 / -0.28" derived from the test row, never hard-coded. */
export function markingLabel(t: Pick<Test, "correct_points" | "wrong_points" | "points_divisor">) {
  const f = (n: number) => (n / t.points_divisor).toFixed(2);
  return `+${f(t.correct_points)} / -${f(t.wrong_points)}`;
}

export default function MockCatalogue() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/api/mock/tests").then((x) => { setTests(x.tests); trackMockFunnel("mock_catalogue_view", { count: x.tests.length }, "catalogue"); })
      .catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  async function start(t: Test) {
    if (starting) return;
    setStarting(t.id); setError("");
    try {
      const s = await api("/api/mock/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testId: t.id }) });
      trackMockFunnel(s.resumed ? "mock_resume" : "mock_start", { test_code: t.code }, `${s.resumed ? "resume" : "start"}:${s.sessionId}`);
      router.push(`/mock/cds-gk/${s.sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start test");
      setStarting(null);
    }
  }
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900" style={{ overflowX: "clip" }}>
      <header className="bg-[#081b35] text-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-300">Defence Pathshala · CDS</p>
          <h1 className="text-lg font-bold sm:text-xl">CDS General Knowledge Mocks</h1>
        </div>
      </header>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
        <p className="leading-7 text-slate-600">Full-length timed GK papers marked exactly like the exam. Questions are Defence Pathshala practice questions; your timer runs on the server and your attempt resumes if you refresh.</p>
        {error && (
          <div role="alert" className="space-y-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
            <p>{error}</p>
            {/sign in required/i.test(error) && (
              <Link className="font-semibold text-blue-700 underline" href={`/auth/login?next=${encodeURIComponent("/mock/cds-gk")}`}>Sign in with Defence Pathshala</Link>
            )}
          </div>
        )}
        {loading && <p role="status" className="text-slate-600">Loading mocks…</p>}
        {!loading && !tests.length && !error && (
          <p role="status" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No CDS GK mock is published yet.</p>
        )}
        {tests.map((t) => (
          <article key={t.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-xl font-black">{t.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{t.code}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[[String(t.expected_questions), "Questions"], [String(Math.round(t.duration_seconds / 60)), "Minutes"],
                [Number(t.max_marks).toFixed(2), "Marks"], [markingLabel(t), "Marking"]].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-slate-200 p-3">
                  <dd className="text-lg font-black">{v}</dd><dt className="text-[11px] uppercase tracking-wider text-slate-500">{l}</dt>
                </div>
              ))}
            </dl>
            <ul className="grid grid-cols-1 gap-x-6 text-sm sm:grid-cols-2">
              {Object.entries(t.blueprint).map(([subject, n]) => (
                <li key={subject} className="flex justify-between border-b border-slate-100 py-1.5"><span>{subject}</span><span className="text-slate-600">{n}</span></li>
              ))}
            </ul>
            <button disabled={starting !== null} onClick={() => void start(t)}
              className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-blue-600 px-6 text-base font-bold text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
              {starting === t.id ? "Starting…" : "Start / resume mock"}
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
