"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, List } from "lucide-react";
import { trackLearningEvent } from "@/lib/learning-events";
import {
  capsuleHotspots,
  capsulePageSrc,
  sectionForPage,
  type MonthlyCapsule,
} from "@/lib/monthly-capsules";

/**
 * Online-only reader for a monthly capsule. Pages are images; there is no
 * download control and the source PDF is never sent to the browser.
 * Right-click/drag saving is discouraged (not prevented — screenshots remain possible).
 */
export default function MonthlyCapsuleReader({ capsule }: { capsule: MonthlyCapsule }) {
  const pages = useMemo(() => Array.from({ length: capsule.pageCount }, (_, i) => i + 1), [capsule.pageCount]);
  const hotspots = useMemo(() => capsuleHotspots(capsule), [capsule]);
  const [current, setCurrent] = useState(1);
  const [contentsOpen, setContentsOpen] = useState(false);
  const pageRefs = useRef<Map<number, HTMLElement>>(new Map());
  const seen = useRef<Set<number>>(new Set());
  const milestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    trackLearningEvent("monthly_capsule_open", { edition: capsule.edition, page_count: capsule.pageCount }, capsule.edition);
  }, [capsule.edition, capsule.pageCount]);

  // Track the page in view, unique pages read and reading-depth milestones.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const page = Number((entry.target as HTMLElement).dataset.page);
          if (!Number.isFinite(page)) continue;
          setCurrent(page);
          if (!seen.current.has(page)) {
            seen.current.add(page);
            trackLearningEvent("monthly_capsule_page", { edition: capsule.edition, page });
            const depth = Math.floor((seen.current.size / capsule.pageCount) * 4) * 25;
            if (depth >= 25 && !milestones.current.has(depth)) {
              milestones.current.add(depth);
              trackLearningEvent("monthly_capsule_depth", { edition: capsule.edition, percent: depth });
            }
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [capsule.edition, capsule.pageCount]);

  const goTo = useCallback((page: number) => {
    const target = Math.min(Math.max(page, 1), capsule.pageCount);
    pageRefs.current.get(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setContentsOpen(false);
  }, [capsule.pageCount]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goTo(current + 1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goTo(current - 1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo]);

  const section = sectionForPage(capsule, current);
  const discourageSave = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 -mx-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-nav sm:mx-0 sm:rounded-2xl sm:border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setContentsOpen((v) => !v)}
            aria-expanded={contentsOpen}
            aria-controls="capsule-contents"
            className="inline-flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm font-semibold text-slate-800 transition hover:border-blue-300 sm:flex-none"
          >
            <List className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
            <span className="truncate">{section?.title ?? "Contents"}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${contentsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button type="button" onClick={() => goTo(current - 1)} disabled={current <= 1} aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-[4.5rem] text-center font-mono text-sm font-semibold text-slate-700" aria-live="polite">
              {current} / {capsule.pageCount}
            </span>
            <button type="button" onClick={() => goTo(current + 1)} disabled={current >= capsule.pageCount} aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {contentsOpen && (
          <nav id="capsule-contents" aria-label="Capsule contents" className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200">
            <ul className="divide-y divide-slate-100">
              {capsule.sections.map((s) => (
                <li key={s.title}>
                  <button type="button" onClick={() => goTo(s.page)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-blue-50 ${section?.title === s.title ? "font-bold text-blue-700" : "text-slate-700"}`}>
                    <span>{s.title}</span>
                    <span className="font-mono text-xs text-slate-500">p. {s.page}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-4 select-none" onContextMenu={discourageSave}>
        {pages.map((page) => (
          <section
            key={page}
            data-page={page}
            ref={(el) => { if (el) pageRefs.current.set(page, el); else pageRefs.current.delete(page); }}
            aria-label={`Page ${page} of ${capsule.pageCount}`}
            className="relative scroll-mt-24 overflow-hidden rounded-xl bg-slate-900 shadow-sm ring-1 ring-slate-200"
            style={{ aspectRatio: `${capsule.pageWidth} / ${capsule.pageHeight}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static pre-rendered page; next/image would expose an optimiser URL per size */}
            <img
              src={capsulePageSrc(capsule.edition, page)}
              alt={`${capsule.title}, page ${page}${sectionForPage(capsule, page) ? ` — ${sectionForPage(capsule, page)!.title}` : ""}`}
              width={capsule.pageWidth}
              height={capsule.pageHeight}
              loading={page <= 2 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              onDragStart={discourageSave}
              className="pointer-events-none h-full w-full object-contain"
            />
            {hotspots.filter((h) => h.page === page).map((h) => (
              <button
                key={`${h.page}-${h.target}-${h.top}`}
                type="button"
                onClick={() => goTo(h.target)}
                aria-label={h.label}
                className="absolute rounded-lg transition hover:bg-blue-400/15 focus-visible:bg-blue-400/20"
                style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
