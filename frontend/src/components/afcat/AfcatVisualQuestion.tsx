"use client";

import { useState } from "react";
import type { AfcatAsset, AfcatChoice, AfcatContent, AfcatDisplayQuestion } from "@/lib/afcat/visual-types";
import { isSafeAfcatAssetUrl } from "@/lib/afcat/visual-types";

/** External SVGs render as images, never inline executable markup. */
function AfcatVisual({ asset }: { asset: AfcatAsset }) {
  const [failed, setFailed] = useState(false);
  if (!isSafeAfcatAssetUrl(asset.url) || !asset.alt.trim() || failed) {
    return <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      Diagram unavailable. Do not answer until the diagram is restored.
    </p>;
  }
  return (
    <div className="my-3 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.url}
        alt={asset.alt}
        width={asset.width ?? 600}
        height={asset.height ?? 400}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="mx-auto h-auto max-h-[420px] w-auto max-w-full object-contain"
      />
    </div>
  );
}

function AfcatContentBlock({ content }: { content: AfcatContent }) {
  return (
    <div className="min-w-0 space-y-2">
      {content.text && <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-900 sm:text-base">{content.text}</p>}
      {content.assets?.map((asset, index) => (
        <AfcatVisual key={asset.url + index} asset={asset} />
      ))}
    </div>
  );
}

export default function AfcatVisualQuestion({
  question, selected, onSelect, disabled = false,
}: {
  question: AfcatDisplayQuestion;
  selected: AfcatChoice["key"] | null;
  onSelect: (key: AfcatChoice["key"]) => void;
  disabled?: boolean;
}) {
  return (
    <section aria-label={`Question ${question.number}`} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="mb-4 text-base font-bold text-slate-900">Question {question.number}</h2>
      <AfcatContentBlock content={question.stem} />
      <fieldset className="mt-6 space-y-3" disabled={disabled}>
        <legend className="mb-3 text-sm font-semibold text-slate-700">Choose one answer</legend>
        {question.options.map((option) => {
          const active = selected === option.key;
          return (
            <label key={option.key} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors focus-within:ring-2 focus-within:ring-blue-500 sm:p-4 ${active ? "border-blue-600 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
              <input
                type="radio"
                name={`afcat-question-${question.id}`}
                value={option.key}
                checked={active}
                onChange={() => onSelect(option.key)}
                className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span aria-hidden="true" className="text-sm font-bold text-slate-700">{option.key}.</span>
              <div className="min-w-0 flex-1"><AfcatContentBlock content={option.content} /></div>
            </label>
          );
        })}
      </fieldset>
    </section>
  );
}
