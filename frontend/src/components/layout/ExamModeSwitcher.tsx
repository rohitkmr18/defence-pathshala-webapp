"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { paperForMode, rememberExamMode, rememberPaperChoice, useActivePaper, useActiveTabMode, useRememberedPaper, withPaper } from "@/lib/learner-mode";
import { ndaModeLive } from "@/lib/exam-registry";
import PaperTabs, { PAPER_TAB_CLASS, PAPER_TAB_GROUP_CLASS } from "./PaperTabs";

type ExamModeSwitcherProps = { compact?: boolean };

const ACTIVE = "bg-white text-blue-700 shadow-sm";
const IDLE = "text-slate-600 hover:bg-white/70";

/** "CDS" when the CDS Maths or English paper tab is active (CAPF has neither), otherwise "CDS/CAPF". */
function UpscLabel() {
  const paper = useActivePaper();
  return <>{paper === "maths" || paper === "english" ? "CDS" : "CDS/CAPF"}</>;
}

function ModeLinks({ isAfcat }: { isAfcat: boolean }) {
  const remembered = useRememberedPaper();
  const tabMode = useActiveTabMode();
  const isNda = !isAfcat && tabMode === "nda";
  const isCds = !isAfcat && !isNda;
  // Each mode reopens the paper tab the learner last chose inside it.
  const cdsPaper = paperForMode("cds", remembered);
  const ndaPaper = paperForMode("nda", remembered);
  return (
    <>
      <Link href={withPaper("/dashboard", cdsPaper)} onClick={() => { rememberExamMode("cds"); if (cdsPaper) rememberPaperChoice(cdsPaper); }}
        aria-current={isCds ? "page" : undefined} className={`${PAPER_TAB_CLASS} ${isCds ? ACTIVE : IDLE}`}>
        <Suspense fallback="CDS/CAPF"><UpscLabel /></Suspense>
      </Link>
      {ndaModeLive() && (
        <Link href={withPaper("/dashboard", ndaPaper)} onClick={() => { rememberExamMode("nda"); if (ndaPaper) rememberPaperChoice(ndaPaper); }}
          aria-current={isNda ? "page" : undefined} className={`${PAPER_TAB_CLASS} ${isNda ? ACTIVE : IDLE}`}>
          NDA
        </Link>
      )}
      <Link href="/afcat/dashboard" onClick={() => rememberExamMode("afcat")} aria-current={isAfcat ? "page" : undefined}
        className={`${PAPER_TAB_CLASS} ${isAfcat ? ACTIVE : IDLE}`}>
        AFCAT
      </Link>
    </>
  );
}

export default function ExamModeSwitcher({ compact = false }: ExamModeSwitcherProps) {
  const pathname = usePathname();
  const isAfcat = pathname === "/afcat" || pathname.startsWith("/afcat/");
  return (
    <nav aria-label="Exam mode" className={compact ? "inline-flex flex-col gap-1.5" : "space-y-2"}>
      {!compact && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Exam Mode</p>}
      <div className={PAPER_TAB_GROUP_CLASS}>
        <Suspense fallback={null}><ModeLinks isAfcat={isAfcat} /></Suspense>
      </div>
      {!isAfcat && <PaperTabs />}
    </nav>
  );
}
