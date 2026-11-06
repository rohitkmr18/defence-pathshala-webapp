"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  isPaperAwarePath,
  readExamMode,
  readPaperChoice,
  rememberExamMode,
  rememberPaperChoice,
  withPaper,
} from "@/lib/learner-mode";

/** Filters that belong to one paper's taxonomy: a link carrying them is a deliberate deep link. */
const TAXONOMY_KEYS = ["subject", "subjects", "topic", "topics", "subtopic", "subtopics"];

/**
 * Keeps the learner inside the exam mode and paper tab they chose, however they navigate:
 * - In-app AFCAT pages remember AFCAT mode; CDS/CAPF learning pages remember CDS mode.
 * - "Home" (/dashboard) for an AFCAT-mode learner opens the AFCAT dashboard instead.
 * - A paper-aware page opened without a paper (bottom nav, "Go to Home", login redirect)
 *   reopens on the remembered Maths / English tab.
 * Only tab taps change the remembered choice (see ExamModeSwitcher and PaperTabs) or an explicit
 * `paper` in the URL.
 */
function KeeperInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // The public /afcat landing page is a marketing page; it does not switch anyone's mode.
    if (pathname.startsWith("/afcat/")) {
      rememberExamMode("afcat");
      return;
    }
    if (pathname === "/dashboard" && readExamMode() === "afcat") {
      router.replace("/afcat/dashboard");
      return;
    }
    if (pathname.startsWith("/dashboard/")) rememberExamMode("cds");
    if (!isPaperAwarePath(pathname)) return;

    const paper = searchParams.get("paper");
    if (paper === "maths" || paper === "english") {
      rememberPaperChoice(paper);
      return;
    }
    const remembered = readPaperChoice();
    if (remembered !== "maths" && remembered !== "english") return;
    if (TAXONOMY_KEYS.some((key) => searchParams.has(key))) return;
    const qs = searchParams.toString();
    router.replace(withPaper(`${pathname}${qs ? `?${qs}` : ""}`, remembered));
  }, [pathname, searchParams, router]);

  return null;
}

export default function LearnerModeKeeper() {
  return (
    <Suspense fallback={null}>
      <KeeperInner />
    </Suspense>
  );
}
