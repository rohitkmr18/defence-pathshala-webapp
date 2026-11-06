"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PAPER_TAB_PARAM, parsePaperTab, visiblePaperTabs } from "@/lib/exam-registry";

/** Paths where the GS / Maths / English paper tab applies. */
const PAPER_AWARE_PATHS = ["/dashboard/practice", "/dashboard/question-bank"];
const PAPER_AWARE_EXACT = ["/dashboard"];

/** Shared with the exam switcher so both rows have identical size. */
export const PAPER_TAB_GROUP_CLASS = "flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1";
export const PAPER_TAB_CLASS = "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-semibold transition-colors";

function PaperTabsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabs = visiblePaperTabs();
  const applies = PAPER_AWARE_EXACT.includes(pathname) || PAPER_AWARE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
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
    <nav aria-label="Paper" className={PAPER_TAB_GROUP_CLASS}>
      {tabs.map((tab) => (
        <Link key={tab.id} href={hrefFor(tab.id)} replace aria-current={active === tab.id ? "page" : undefined}
          className={`${PAPER_TAB_CLASS} ${active === tab.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

export default function PaperTabs() {
  return <Suspense fallback={null}><PaperTabsInner /></Suspense>;
}
