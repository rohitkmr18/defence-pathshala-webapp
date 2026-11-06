"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import PaperTabs, { PAPER_TAB_CLASS, PAPER_TAB_GROUP_CLASS } from "./PaperTabs";

type ExamModeSwitcherProps = { compact?: boolean };

/** "CDS" when the Maths or English paper tab is active (CAPF has neither), otherwise "CDS/CAPF". */
function UpscLabel() {
  const paper = useSearchParams().get("paper");
  return <>{paper === "maths" || paper === "english" ? "CDS" : "CDS/CAPF"}</>;
}

export default function ExamModeSwitcher({ compact = false }: ExamModeSwitcherProps) {
  const pathname = usePathname();
  const isAfcat = pathname === "/afcat" || pathname.startsWith("/afcat/");
  return (
    <nav aria-label="Exam mode" className={compact ? "inline-flex flex-col gap-1.5" : "space-y-2"}>
      {!compact && <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Exam Mode</p>}
      <div className={PAPER_TAB_GROUP_CLASS}>
        <Link href="/dashboard" aria-current={!isAfcat ? "page" : undefined}
          className={`${PAPER_TAB_CLASS} ${!isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          <Suspense fallback="CDS/CAPF"><UpscLabel /></Suspense>
        </Link>
        <Link href="/afcat/dashboard" aria-current={isAfcat ? "page" : undefined}
          className={`${PAPER_TAB_CLASS} ${isAfcat ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white/70"}`}>
          AFCAT
        </Link>
      </div>
      {!isAfcat && <PaperTabs />}
    </nav>
  );
}
