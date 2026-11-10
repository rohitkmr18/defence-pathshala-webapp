"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, AlertCircle, Clock3, RotateCcw } from "lucide-react";
import { trackAfcatFunnel } from "@/lib/afcat/funnel";

type PublishedMock = {
  id: string;
  code: string;
  title: string;
  kind: string;
  expected_questions: number;
  duration_seconds: number;
  max_marks: number;
};

type CatalogState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; tests: PublishedMock[] };

function validMock(value: unknown): value is PublishedMock {
  if (!value || typeof value !== "object") return false;
  const mock = value as Partial<PublishedMock>;
  return typeof mock.id === "string"
    && typeof mock.code === "string"
    && typeof mock.title === "string"
    && mock.kind === "FULL_MOCK"
    && Number.isFinite(mock.expected_questions)
    && Number.isFinite(mock.duration_seconds)
    && Number.isFinite(mock.max_marks);
}

export default function AfcatMockCatalogue() {
  const [state, setState] = useState<CatalogState>({ status: "loading" });

  const load = useCallback(async (signal?: AbortSignal) => {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/afcat/tests", { cache: "no-store", signal });
      if (!response.ok) throw new Error("Mock catalogue unavailable");
      const data: unknown = await response.json();
      if (!data || typeof data !== "object" || !("tests" in data)
          || !Array.isArray(data.tests) || !data.tests.every(validMock)) {
        throw new Error("Unexpected catalogue response");
      }
      if (!signal?.aborted) setState({ status: "ready", tests: data.tests });
    } catch {
      if (!signal?.aborted) setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <section id="available-mocks" aria-labelledby="available-mocks-heading" className="scroll-mt-20">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">Test yourself</p>
          <h2 id="available-mocks-heading" className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Available AFCAT full mocks</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Only currently published mocks appear below. Sign in when you are ready to begin or resume an attempt.</p>
        </div>
        <Link href="/afcat/dashboard" className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          My attempts <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {state.status === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading available AFCAT mocks">
          {[0, 1].map((n) => (
            <div key={n} className="h-52 animate-pulse rounded-3xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" aria-hidden="true" />
            <div>
              <h3 className="font-bold text-amber-950">The live mock catalogue could not load</h3>
              <p className="mt-1 text-sm text-amber-900">We cannot confirm which AFCAT mocks are currently available. Retry to check the latest catalogue.</p>
              <button type="button" onClick={() => void load()} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-amber-400 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700">
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {state.status === "ready" && state.tests.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-7">
          <h3 className="text-lg font-bold text-slate-900">No AFCAT full mocks published right now</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Check back for the next available mock, or explore other Defence Pathshala practice resources below.</p>
        </div>
      )}

      {state.status === "ready" && state.tests.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {state.tests.map((mock) => (
            <li key={mock.id} className="flex min-w-0 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">Published full mock</p>
                <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">{mock.title}</h3>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4">
                  <div><dt className="text-xs text-slate-500">Questions</dt><dd className="mt-1 font-extrabold tabular-nums text-slate-900">{mock.expected_questions}</dd></div>
                  <div><dt className="text-xs text-slate-500">Duration</dt><dd className="mt-1 font-extrabold tabular-nums text-slate-900">{Math.round(mock.duration_seconds / 60)} min</dd></div>
                  <div><dt className="text-xs text-slate-500">Max marks</dt><dd className="mt-1 font-extrabold tabular-nums text-slate-900">{mock.max_marks}</dd></div>
                </dl>
              </div>
              <Link href="/afcat/lab"
                onClick={() => trackAfcatFunnel("afcat_cta_click", { placement: "catalogue", test_code: mock.code })}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Choose this mock in the test player <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
        <Clock3 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Your test clock starts in the player when you begin an attempt. The server controls the deadline, including across refreshes.
      </p>
    </section>
  );
}
