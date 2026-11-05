"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildMonthGrid, formatMonthLabel, isValidMonthKey, shiftMonth, summariseMonths,
} from "@/lib/current-affairs-calendar";

export interface CalendarEdition {
  date: string;
  storyCount: number;
  quizCount: number;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CurrentAffairsCalendar({ editions }: { editions: CalendarEdition[] }) {
  const panelId = useId();
  const byDate = useMemo(() => new Map(editions.map((e) => [e.date, e])), [editions]);
  const months = useMemo(() => summariseMonths(editions.map((e) => e.date)), [editions]);
  const newestMonth = months[0]?.month ?? null;
  const oldestMonth = months[months.length - 1]?.month ?? null;

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<string | null>(newestMonth);

  // Deep links: ?month=YYYY-MM or #calendar open the calendar on load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("month");
    if (requested && isValidMonthKey(requested)) {
      setMonth(requested);
      setOpen(true);
    } else if (window.location.hash === "#calendar") {
      setOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!open || !month) return;
    const url = new URL(window.location.href);
    url.searchParams.set("month", month);
    window.history.replaceState(null, "", url);
  }, [open, month]);

  if (!month || !newestMonth || !oldestMonth) return null;

  const grid = buildMonthGrid(month);
  const editionsThisMonth = months.find((m) => m.month === month)?.editionCount ?? 0;
  const canGoBack = month > oldestMonth;
  const canGoForward = month < newestMonth;

  return (
    <section id="calendar" className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 rounded-3xl p-5 text-left transition hover:bg-slate-50 sm:p-6"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-slate-950 sm:text-lg">Browse all editions</span>
          <span className="block text-sm text-slate-500">Pick a date to open that day&apos;s current affairs</span>
        </span>
        <span className="hidden text-sm font-semibold text-blue-700 sm:inline">{open ? "Hide calendar" : "Show calendar"}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} className="grid gap-6 border-t border-slate-200 p-5 sm:p-6">
          <div className="mx-auto w-full max-w-xl min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMonth(shiftMonth(month, -1))}
                disabled={!canGoBack}
                aria-label="Previous month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="text-center">
                <p className="text-base font-bold text-slate-950" aria-live="polite">{formatMonthLabel(month)}</p>
                <p className="text-xs text-slate-500">{editionsThisMonth} {editionsThisMonth === 1 ? "edition" : "editions"}</p>
              </div>
              <button
                type="button"
                onClick={() => setMonth(shiftMonth(month, 1))}
                disabled={!canGoForward}
                aria-label="Next month"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:gap-2" aria-hidden="true">
              {WEEKDAYS.map((d) => <span key={d}>{d}</span>)}
            </div>
            <ul className="mt-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
              {grid.map((cell, i) => {
                if (!cell) return <li key={`blank-${i}`} aria-hidden="true" />;
                const edition = byDate.get(cell.date);
                if (!edition) {
                  return (
                    <li key={cell.date}>
                      <span className="flex h-11 items-center justify-center rounded-xl text-sm text-slate-300 sm:h-12">
                        <span className="sr-only">{`${cell.day} ${formatMonthLabel(month)}, no edition`}</span>
                        <span aria-hidden="true">{cell.day}</span>
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={cell.date}>
                    <Link
                      href={`/current-affairs/${cell.date}`}
                      aria-label={`${cell.day} ${formatMonthLabel(month)}: ${edition.storyCount} stories, ${edition.quizCount} MCQs`}
                      className="flex h-11 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:h-12"
                    >
                      {cell.day}
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-slate-500">Dates with a blue dot have an edition.</p>
          </div>

        </div>
      )}
    </section>
  );
}
