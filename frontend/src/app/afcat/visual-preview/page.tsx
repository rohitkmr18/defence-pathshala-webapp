"use client";

import { useState } from "react";
import Link from "next/link";
import AfcatVisualQuestion from "@/components/afcat/AfcatVisualQuestion";
import type { AfcatDisplayQuestion, AfcatChoice } from "@/lib/afcat/visual-types";

const cases = [
  ["dot-placement-a", "Overlapping shapes: three-dot placement"],
  ["dot-placement-b", "Overlapping curves: fine dot positions"],
  ["figure-series-a", "Five-panel figure series: rotations and moving dots"],
  ["figure-series-b", "Grid patterns: alternating diagonals"],
  ["mirror-a", "Mirror-image fidelity: asymmetric features"],
  ["water-a", "Water-image fidelity: arrows and shapes"],
  ["embedded-a", "Embedded figures: crossing line segments"],
  ["embedded-b", "Embedded triangles: dense intersections"],
  ["fold-a", "Paper-folding: folds and punches"],
  ["fold-b", "Paper-folding: diagonal folds and cuts"],
  ["venn-a", "Venn diagrams: triple intersection"],
  ["venn-b", "Venn diagrams: four overlapping sets"],
] as const;

function makeSample(index: number): AfcatDisplayQuestion {
  const [name, title] = cases[index];
  return {
    id: `afcat-geometry-benchmark-${index + 1}`,
    number: index + 1,
    stem: {
      text: `Geometry rendering benchmark: ${title}. Inspect intersections, fine lines and text at normal size and zoomed size. This is not a validated AFCAT question and has no correct answer.`,
      assets: [{
        url: `/afcat-preview/benchmark-${name}.svg`,
        alt: `${title}; original multi-element diagram for visual quality assurance`,
        mimeType: "image/svg+xml",
        width: 620,
        height: 290,
      }],
    },
    options: (["A", "B", "C", "D"] as const).map((key, i) => ({
      key,
      content: {
        text: `Option ${key} — illustration rendering sample, not a solution`,
        assets: [{
          url: `/afcat-preview/benchmark-${cases[(index+i+1)%cases.length][0]}.svg`,
          alt: `Illustrated choice ${key}: ${cases[(index+i+1)%cases.length][1]}`,
          mimeType: "image/svg+xml" as const,
          width: 620,
          height: 290,
        }],
      },
    })) as AfcatDisplayQuestion["options"],
  };
}

export default function AfcatVisualPreviewPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, AfcatChoice["key"]>>({});
  const q = makeSample(index);
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-sm font-semibold text-blue-700 hover:underline">← Dashboard</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue-700">P1.3 visual acceptance lab</p>
        <h1 className="mb-3 mt-2 text-2xl font-black sm:text-3xl">AFCAT Complex Diagram Benchmarks</h1>
        <p className="mb-5 text-sm leading-6 text-slate-600">
          Twelve original stress-test diagrams across dot placement, figure series, reflections, embedded figures, folding and Venn diagrams.
          They are not official exam questions. Choose a benchmark and inspect its details before P1.3 acceptance.
        </p>
        <label htmlFor="benchmark-picker" className="block text-sm font-semibold text-slate-700">Benchmark case</label>
        <select id="benchmark-picker" value={index} onChange={e=>setIndex(Number(e.target.value))}
          className="mb-5 mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-blue-500">
          {cases.map(([name,title],i)=><option key={name} value={i}>{i+1}. {title}</option>)}
        </select>
        <AfcatVisualQuestion question={q} selected={selected[index]??null}
          onSelect={key=>setSelected(prev=>({...prev,[index]:key}))}/>
        <p className="mt-4 text-sm text-slate-600" role="status">
          {selected[index] ? `Selected option: ${selected[index]}. No answer evaluation or submission.` : "Choose any illustrated option to inspect selection usability."}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <button type="button" disabled={index===0} onClick={()=>setIndex(i=>Math.max(0,i-1))}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Previous</button>
          <span className="text-sm font-semibold text-slate-600">{index+1} of {cases.length}</span>
          <button type="button" disabled={index===cases.length-1} onClick={()=>setIndex(i=>Math.min(cases.length-1,i+1))}
            className="min-h-11 rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Next</button>
        </div>
      </div>
    </main>
  );
}
