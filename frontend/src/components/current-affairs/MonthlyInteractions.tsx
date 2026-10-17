"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackLearningEvent } from "@/lib/learning-events";

export type MonthlyContext = Record<string, string | number | boolean | undefined>;

export function MonthlyView({ events, context }: { events: string[]; context: MonthlyContext }) {
  useEffect(() => {
    events.forEach(event => trackLearningEvent(event, context, String(context.edition_id) + ":" + String(context.content_id ?? context.source_surface)));
  }, [events, context]);
  return null;
}

export function MonthlyLink({ href, event, context, children, className }: {
  href: string; event: string; context: MonthlyContext; children: React.ReactNode; className?: string;
}) {
  return <Link href={href} className={className} onClick={() => trackLearningEvent(event, context)}>{children}</Link>;
}

export function MonthlyAvailability({ context }: { context: MonthlyContext }) {
  const [open, setOpen] = useState(false);
  return <div>
    <button type="button" aria-expanded={open} aria-controls="edition-availability"
      className="mt-4 min-h-12 w-full rounded-xl border border-slate-300 px-4 py-3 font-bold text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
      onClick={() => { setOpen(true); trackLearningEvent("monthly_ca_release_availability_viewed", { ...context, availability: "unavailable" }, String(context.edition_id)); }}>
      View release availability
    </button>
    {open && <p id="edition-availability" role="status" className="mt-3 text-sm leading-6 text-slate-600">The full October edition is still in preparation. Purchasing will open after editorial approval. No payment is collected here.</p>}
  </div>;
}

export function MonthlyReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const lesson = document.getElementById("lesson");
      if (!lesson) return;
      const rect = lesson.getBoundingClientRect();
      const available = Math.max(1, rect.height - window.innerHeight / 2);
      setProgress(Math.round(Math.min(100, Math.max(0, (100 * (100 - rect.top)) / available))));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return <div className="sticky top-[61px] z-20 border-b border-slate-200 bg-white px-4 py-3 lg:top-0">
    <div className="mx-auto flex max-w-3xl items-center gap-3 text-xs font-bold text-slate-600">
      <span>Lesson reading · {progress}%</span>
      <progress aria-label="Lesson reading progress" value={progress} max={100} className="h-1.5 min-w-0 flex-1 accent-blue-600" />
      <a href="#practice" className="rounded-lg px-2 py-1 text-blue-700 focus-visible:outline-2">Practice ↓</a>
    </div>
  </div>;
}
