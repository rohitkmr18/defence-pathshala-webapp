"use client";

import { useState } from "react";

const example = {
  date: new Date().toISOString().slice(0, 10),
  title: "Daily Current Affairs",
  summary: "Exam-focused developments for CDS, CAPF, NDA and AFCAT.",
  published: true,
  stories: [],
};

export default function StructuredCurrentAffairsImporter() {
  const [payload, setPayload] = useState(JSON.stringify(example, null, 2));
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function publish() {
    setSubmitting(true);
    setStatus("");
    try {
      const parsed = JSON.parse(payload);
      const response = await fetch("/api/current-affairs/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Publishing failed.");
      setStatus(`Published: ${result.stories} stories and ${result.mcqs} MCQs.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Publishing failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">Structured edition importer</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Paste the structured JSON produced by the Daily Current Affairs task. The server validates the edition before publishing it.
      </p>
      <textarea
        value={payload}
        onChange={(event) => setPayload(event.target.value)}
        className="mt-4 min-h-[360px] w-full rounded-2xl border border-slate-300 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100"
        spellCheck={false}
      />
      <button
        type="button"
        onClick={publish}
        disabled={submitting}
        className="mt-4 w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white hover:bg-blue-700 disabled:bg-blue-300"
      >
        {submitting ? "Validating & publishing..." : "Validate & publish structured edition"}
      </button>
      {status && <p className="mt-3 text-sm font-semibold text-slate-700">{status}</p>}
    </section>
  );
}
