"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PAPER_TAB_PARAM, parsePaperTab, visiblePaperTabs } from "@/lib/exam-registry";

/** Paths where the GS / Maths / English paper tab applies. */
const PAPER_AWARE_PATHS = ["/dashboard/practice", "/dashboard/question-bank"];

function PaperTabsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabs = visiblePaperTabs();
  const applies = PAPER_AWARE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  // Only the picker pages carry the tab; session/full-paper screens keep the paper from their own URL.
  if (!applies || tabs.length < 2 || pathname.includes("/session") || pathname.includes("/full-paper")) return null;

  const active = parsePaperTab(searchParams.get(PAPER_TAB_PARAM));
  const hrefFor = (id: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (id === "gs") next.delete(PAPER_TAB_PARAM); else next.set(PAPER_TAB_PARAM, id);
    // Filters from another paper's taxonomy do not carry over.
    for (const key of ["subject", "subjects", "topic", "topics", "subtopic", "subtopics", "year", "years", "cycle", "cycles"]) next.delete(key);
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav aria-label="Paper" className="mt-2 flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1">
      {tabs.map((tab) => (
        <Link key={tab.id} href={hrefFor(tab.id)} replace aria-current={active === tab.id ? "page" : undefined}
          className={`flex-1 rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition-colors ${active === tab.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default function PaperTabs() {
  return <Suspense fallback={null}><PaperTabsInner /></Suspense>;
}
