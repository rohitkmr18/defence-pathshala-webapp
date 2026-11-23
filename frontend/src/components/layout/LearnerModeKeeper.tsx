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
import { parseSeparatePaperTab, tabMode } from "@/lib/exam-registry";

/** Filters that belong to one paper's taxonomy: a link carrying them is a deliberate deep link. */
const TAXONOMY_KEYS = ["subject", "subjects", "topic", "topics", "subtopic", "subtopics"];

/**
 * Keeps the learner inside the exam mode and paper tab they chose, however they navigate:
 * - In-app AFCAT pages remember AFCAT mode; other learning pages remember CDS/CAPF or NDA mode,
 *   following the paper tab in force (NDA Maths / GAT = NDA mode).
 * - "Home" (/dashboard) for an AFCAT-mode learner opens the AFCAT dashboard instead.
 * - A paper-aware page opened without a paper (bottom nav, "Go to Home", login redirect)
 *   reopens on the remembered non-GS tab (CDS Maths / English, NDA Maths / GAT).
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
    const paper = searchParams.get("paper");
    const urlTab = paper === "gs" ? "gs" : parseSeparatePaperTab(paper);
    if (pathname.startsWith("/dashboard/") || (pathname === "/dashboard" && urlTab)) {
      const inForce = urlTab ?? readPaperChoice();
      rememberExamMode(inForce && tabMode(inForce) === "nda" ? "nda" : "cds");
    }
    if (!isPaperAwarePath(pathname)) return;

    // Landing-page links say paper=gs explicitly: GS is the primary entry and resets a sticky Maths/English choice.
    if (paper === "gs") {
      rememberPaperChoice("gs");
      return;
    }
    if (urlTab) {
      rememberPaperChoice(urlTab);
      return;
    }
    const remembered = parseSeparatePaperTab(readPaperChoice());
    if (!remembered) return;
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
