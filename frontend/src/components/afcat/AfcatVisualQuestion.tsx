"use client";

import { useEffect, useRef, useState } from "react";
import type { AfcatAsset, AfcatChoice, AfcatContent, AfcatDisplayQuestion } from "@/lib/afcat/visual-types";
import MathText from "@/components/common/MathText";
import { isSafeAfcatAssetUrl } from "@/lib/afcat/visual-types";

/** External SVGs render as images, never inline executable markup. */
function AfcatVisual({ asset }: { asset: AfcatAsset }) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousExpanded = useRef(false);
  useEffect(() => {
    if (!expanded) {
      if (previousExpanded.current) triggerRef.current?.focus();
      previousExpanded.current = false;
      return;
    }
    previousExpanded.current = true;
    closeRef.current?.focus();
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); setExpanded(false); }
      if (event.key === "Tab") {
        // Currently the dialog intentionally contains one focusable control.
        event.preventDefault();
        closeRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [expanded]);
  if (!isSafeAfcatAssetUrl(asset.url) || !asset.alt.trim() || failed) {
    return <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
      Diagram unavailable. Do not answer until the diagram is restored.
    </p>;
  }
  return (
    <div className="my-3 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
      <button ref={triggerRef} type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setExpanded(true); }}
        className="block w-full cursor-zoom-in rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        aria-label={`Enlarge diagram: ${asset.alt}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.url} alt={asset.alt} width={asset.width ?? 600} height={asset.height ?? 400}
          loading="lazy" decoding="async" onError={() => setFailed(true)}
          className="mx-auto h-auto max-h-[420px] w-auto max-w-full object-contain" />
      </button>
      <p className="mt-2 text-center text-xs text-blue-700">Tap or select diagram to enlarge</p>
      {expanded && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 p-3 sm:p-8"
          role="dialog" aria-modal="true" aria-label={`Enlarged diagram: ${asset.alt}`}>
          <div className="mx-auto flex w-full max-w-6xl justify-end">
            <button ref={closeRef} type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setExpanded(false); }}
              className="mb-3 min-h-11 rounded-xl bg-white px-5 text-sm font-bold text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-400">
              Close enlarged diagram
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.url} alt={asset.alt} width={asset.width ?? 600} height={asset.height ?? 400}
              className="max-h-full max-w-full object-contain" onError={() => setFailed(true)} />
          </div>
          <p className="mt-3 text-center text-xs text-white">Inspect lines and intersections. Press Escape or Close to return.</p>
        </div>
      )}
    </div>
  );
}

function AfcatContentBlock({ content }: { content: AfcatContent }) {
  return (
    <div className="min-w-0 space-y-2">
      {content.text && <MathText as="div" text={content.text} className="max-w-full overflow-x-auto whitespace-pre-wrap break-words text-base leading-7 text-slate-900" />}
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
