"use client";

import { useState } from "react";
import Link from "next/link";
import AfcatVisualQuestion from "@/components/afcat/AfcatVisualQuestion";
import type { AfcatDisplayQuestion, AfcatChoice } from "@/lib/afcat/visual-types";

const sample: AfcatDisplayQuestion = {
  id: "sample-visual-not-an-exam-question",
  number: 1,
  stem: {
    text: "Visual renderer demonstration only. Review whether the following diagram and all four illustrated options fit properly on your device. This is not an AFCAT test.",
    assets: [{
      url: "/afcat-preview/stem.svg",
      alt: "A left-to-right series showing a circle, triangle, square and question mark.",
      mimeType: "image/svg+xml",
      width: 600,
      height: 220,
    }],
  },
  options: ([
    ["A", "circle"],
    ["B", "triangle"],
    ["C", "square"],
    ["D", "pentagon"],
  ] as const).map(([key, name]) => ({
    key,
    content: {
      assets: [{
        url: `/afcat-preview/${name}.svg`,
        alt: `Option ${key}: ${name}`,
        mimeType: "image/svg+xml" as const,
        width: 220,
        height: 130,
      }],
    },
  })) as AfcatDisplayQuestion["options"],
};

export default function AfcatVisualPreviewPage() {
  const [selected, setSelected] = useState<AfcatChoice["key"] | null>(null);
  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/afcat" className="text-sm font-semibold text-blue-700 hover:underline">← AFCAT Home</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue-700">Internal QA preview</p>
        <h1 className="mb-4 mt-2 text-2xl font-black sm:text-3xl">Visual Question Renderer</h1>
        <p className="mb-6 text-sm text-slate-600">This non-scored sample verifies SVG stem rendering, image options, screen responsiveness and keyboard-accessible answer selection. No attempt is saved.</p>
        <AfcatVisualQuestion question={sample} selected={selected} onSelect={setSelected} />
        <p className="mt-4 text-sm text-slate-600" role="status">
          {selected ? `Selected option: ${selected}. Preview only — no answer evaluation.` : "Select any option to check interaction."}
        </p>
      </div>
    </main>
  );
}
