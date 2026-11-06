"use client";

import MathText from "@/components/common/MathText";

// A figure line inside an explanation: ![Alt text](/pyq-figures/<paper>/<file>.svg)
// Only same-origin files under /pyq-figures/ are rendered as images; anything else stays text.
const FIGURE_LINE = /^\s*!\[([^\]]*)\]\((\/pyq-figures\/[A-Za-z0-9_\-/]+\.(?:svg|png|webp))\)\s*$/;

type Block = { kind: "text"; text: string } | { kind: "figure"; alt: string; src: string };

export function splitExplanation(source: string): Block[] {
  const blocks: Block[] = [];
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join("\n").replace(/^\n+|\n+$/g, "");
    if (text) blocks.push({ kind: "text", text });
    buffer = [];
  };
  for (const line of source.replace(/\r\n?/g, "\n").split("\n")) {
    const match = FIGURE_LINE.exec(line);
    if (match) {
      flush();
      blocks.push({ kind: "figure", alt: match[1] || "Figure", src: match[2] });
    } else {
      buffer.push(line);
    }
  }
  flush();
  return blocks;
}

export default function ExplanationText({ text, className = "" }: { text: string | null | undefined; className?: string }) {
  if (!text) return null;
  return (
    <div className={className}>
      {splitExplanation(text).map((block, index) =>
        block.kind === "figure" ? (
          <figure key={index} className="my-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- static SVG diagrams, no optimisation needed */}
            <img src={block.src} alt={block.alt} className="h-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-2" loading="lazy" />
            <figcaption className="mt-1.5 text-center text-xs text-slate-500">{block.alt}</figcaption>
          </figure>
        ) : (
          <MathText key={index} text={block.text} className="block whitespace-pre-line" as="div" />
        ),
      )}
    </div>
  );
}
