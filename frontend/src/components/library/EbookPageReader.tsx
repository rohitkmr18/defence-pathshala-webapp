"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, List } from "lucide-react";
import { trackLearningEvent } from "@/lib/learning-events";

export interface ReaderSection {
  title: string;
  /** Page number to jump to; 0 jumps to `anchorTarget` (e.g. the interactive practice). */
  page: number;
}

export interface ReaderHotspot {
  page: number;
  /** Page to jump to; 0 jumps to `anchorTarget`. */
  target: number;
  label?: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface EbookPageReaderProps {
  title: string;
  /** Folder that holds page-NN.webp, e.g. "/monthly-capsule/2026-10". */
  srcBase: string;
  /** Page numbers to show, in order. */
  pages: number[];
  pageWidth: number;
  pageHeight: number;
  sections: ReaderSection[];
  hotspots: ReaderHotspot[];
  /** Event prefix, e.g. "monthly_capsule" → monthly_capsule_open / _page / _depth. */
  eventPrefix: string;
  /** Event context key and value identifying the document, e.g. { edition: "2026-10" }. */
  eventKey: string;
  eventId: string;
  /** Element id that section/hotspot target 0 scrolls to. */
  anchorTarget?: string;
  /** Give each page an id (page-N) so "#page-N" links can jump to it. */
  pageAnchors?: boolean;
  /** Accessible name of the contents menu. */
  contentsLabel?: string;
}

const pageFile = (base: string, page: number) => `${base}/page-${String(page).padStart(2, "0")}.webp`;

function sectionAt(sections: ReaderSection[], page: number): ReaderSection | null {
  let current: ReaderSection | null = null;
  for (const s of sections) if (s.page > 0 && s.page <= page) current = s;
  return current;
}

/**
 * Online-only page-image reader. There is no download control and the source PDF is
 * never sent to the browser. Right-click/drag saving is discouraged (not prevented —
 * screenshots remain possible).
 */
export default function EbookPageReader({
  title,
  srcBase,
  pages,
  pageWidth,
  pageHeight,
  sections,
  hotspots,
  eventPrefix,
  eventKey,
  eventId,
  anchorTarget,
  pageAnchors = false,
  contentsLabel = "Contents",
}: EbookPageReaderProps) {
  const first = pages[0] ?? 1;
  const last = pages[pages.length - 1] ?? 1;
  const [current, setCurrent] = useState(first);
  const [contentsOpen, setContentsOpen] = useState(false);
  const pageRefs = useRef<Map<number, HTMLElement>>(new Map());
  const seen = useRef<Set<number>>(new Set());
  const milestones = useRef<Set<number>>(new Set());
  const hotspotsByPage = useMemo(() => {
    const map = new Map<number, ReaderHotspot[]>();
    for (const h of hotspots) map.set(h.page, [...(map.get(h.page) ?? []), h]);
    return map;
  }, [hotspots]);

  useEffect(() => {
    trackLearningEvent(`${eventPrefix}_open`, { [eventKey]: eventId, page_count: pages.length }, eventId);
  }, [eventPrefix, eventKey, eventId, pages.length]);

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
            trackLearningEvent(`${eventPrefix}_page`, { [eventKey]: eventId, page });
            const depth = Math.floor((seen.current.size / pages.length) * 4) * 25;
            if (depth >= 25 && !milestones.current.has(depth)) {
              milestones.current.add(depth);
              trackLearningEvent(`${eventPrefix}_depth`, { [eventKey]: eventId, percent: depth });
            }
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [eventPrefix, eventKey, eventId, pages.length]);

  const goTo = useCallback(
    (page: number) => {
      setContentsOpen(false);
      if (page === 0) {
        if (anchorTarget) document.getElementById(anchorTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const target = Math.min(Math.max(page, first), last);
      pageRefs.current.get(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [anchorTarget, first, last],
  );

  // "#page-N" links (contents, score card "Revise p. N") — handled here so they also work
  // on first load and land below the sticky bars, which a native anchor jump does not.
  useEffect(() => {
    if (!pageAnchors) return;
    function onHash() {
      const m = window.location.hash.match(/^#page-(\d+)$/);
      if (!m) return;
      const page = Number(m[1]);
      window.setTimeout(() => pageRefs.current.get(page)?.scrollIntoView({ behavior: "auto", block: "start" }), 50);
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pageAnchors]);

  const step = useCallback(
    (delta: number) => {
      const i = pages.indexOf(current);
      const next = pages[Math.min(Math.max(i + delta, 0), pages.length - 1)];
      if (next !== undefined) goTo(next);
    },
    [current, goTo, pages],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); step(-1); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const section = sectionAt(sections, current);
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
            <button type="button" onClick={() => step(-1)} disabled={current <= first} aria-label="Previous page"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-[4.5rem] text-center font-mono text-sm font-semibold text-slate-700" aria-live="polite">
              {current} / {last}
            </span>
            <button type="button" onClick={() => step(1)} disabled={current >= last} aria-label="Next page"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {contentsOpen && (
          <nav id="capsule-contents" aria-label={contentsLabel} className="mt-3 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200">
            <ul className="divide-y divide-slate-100">
              {sections.map((s) => (
                <li key={s.title}>
                  <button type="button" onClick={() => goTo(s.page)}
                    className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-blue-50 ${section?.title === s.title ? "font-bold text-blue-700" : "text-slate-700"}`}>
                    <span>{s.title}</span>
                    <span className="font-mono text-xs text-slate-500">{s.page === 0 ? "Practice" : `p. ${s.page}`}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="mx-auto mt-4 flex max-w-3xl flex-col gap-4 select-none" onContextMenu={discourageSave}>
        {pages.map((page) => {
          const pageSection = sectionAt(sections, page);
          return (
            <section
              key={page}
              id={pageAnchors ? `page-${page}` : undefined}
              data-page={page}
              ref={(el) => { if (el) pageRefs.current.set(page, el); else pageRefs.current.delete(page); }}
              aria-label={`Page ${page} of ${last}`}
              className={`relative ${pageAnchors ? "scroll-mt-36 lg:scroll-mt-24" : "scroll-mt-24"} overflow-hidden rounded-xl bg-slate-900 shadow-sm ring-1 ring-slate-200`}
              style={{ aspectRatio: `${pageWidth} / ${pageHeight}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static pre-rendered page; next/image would expose an optimiser URL per size */}
              <img
                src={pageFile(srcBase, page)}
                alt={`${title}, page ${page}${pageSection ? ` — ${pageSection.title}` : ""}`}
                width={pageWidth}
                height={pageHeight}
                loading={page <= first + 1 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                onDragStart={discourageSave}
                className="pointer-events-none h-full w-full object-contain"
              />
              {(hotspotsByPage.get(page) ?? []).map((h) => (
                <button
                  key={`${h.page}-${h.target}-${h.top}`}
                  type="button"
                  onClick={() => goTo(h.target)}
                  aria-label={h.label ?? (h.target === 0 ? "Go to MCQ practice" : h.target === sections[0]?.page ? "Back to contents" : `Go to page ${h.target}`)}
                  className="absolute rounded-lg transition hover:bg-blue-400/15 focus-visible:bg-blue-400/20"
                  style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%` }}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}
