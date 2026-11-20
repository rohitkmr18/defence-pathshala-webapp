"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { rememberExamMode, useActivePaper, useRememberedPaper, withPaper } from "@/lib/learner-mode";
import PaperTabs, { PAPER_TAB_CLASS, PAPER_TAB_GROUP_CLASS } from "./PaperTabs";

type ExamModeSwitcherProps = { compact?: boolean };

/** "CDS" when the Maths or English paper tab is active (CAPF has neither), otherwise "CDS/CAPF". */
function UpscLabel() {
  const paper = useActivePaper();
  return <>{paper === "maths" || paper === "english" ? "CDS" : "CDS/CAPF"}</>;
}

export default function ExamModeSwitcher({ compact = false }: ExamModeSwitcherProps) {
  const pathname = usePathname();
  const isAfcat = pathname === "/afcat" || pathname.startsWith("/afcat/");
  // Returning to CDS reopens the paper tab the learner last chose.
  const rememberedPaper = useRememberedPaper();
  return (
    <nav aria-label="Exam mode" className={compact ? "inline-flex flex-col gap-1.5" : "space-y-2"}>
      {!compact && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Exam Mode</p>}
      <div className={PAPER_TAB_GROUP_CLASS}>
        <Link href={withPaper("/dashboard", rememberedPaper)} onClick={() => rememberExamMode("cds")} aria-current={!isAfcat ? "page" : undefined}
          className={`${PAPER_TAB_CLASS} ${!isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          <Suspense fallback="CDS/CAPF"><UpscLabel /></Suspense>
        </Link>
        <Link href="/afcat/dashboard" onClick={() => rememberExamMode("afcat")} aria-current={isAfcat ? "page" : undefined}
          className={`${PAPER_TAB_CLASS} ${isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          AFCAT
        </Link>
      </div>
      {!isAfcat && <PaperTabs />}
    </nav>
  );
}
