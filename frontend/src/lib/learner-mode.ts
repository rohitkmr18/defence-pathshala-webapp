"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { withPaper } from "./paper-links";
import { defaultTabForMode, parseSeparatePaperTab, tabMode, type PaperTabId } from "./exam-registry";

/**
 * The learner's chosen exam mode (CDS/CAPF, NDA or AFCAT) and paper tab
 * (CDS/CAPF: GS / Maths / English; NDA: Maths / GAT).
 * The choice is sticky: it changes only when the learner taps a tab, never because they navigated.
 * Stored per browser (localStorage); every read/write is guarded so a blocked store just means
 * "no remembered choice" (GS / CDS defaults), never an error.
 */
export type ExamMode = "cds" | "nda" | "afcat";
export type PaperChoice = PaperTabId;

export { isPaperAwarePath, withPaper } from "./paper-links";

const MODE_KEY = "dp_exam_mode";
const PAPER_KEY = "dp_paper_tab";
const EVENT = "dp_learner_mode_change";

function read(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage blocked: the choice simply is not remembered.
  }
}

export function readExamMode(): ExamMode | null {
  const v = read(MODE_KEY);
  return v === "cds" || v === "nda" || v === "afcat" ? v : null;
}

export function readPaperChoice(): PaperChoice | null {
  const v = read(PAPER_KEY);
  return v === "gs" ? "gs" : parseSeparatePaperTab(v);
}

export function rememberExamMode(mode: ExamMode) {
  if (readExamMode() !== mode) write(MODE_KEY, mode);
}

export function rememberPaperChoice(paper: PaperChoice) {
  if (readPaperChoice() !== paper) write(PAPER_KEY, paper);
}

/** Where "Home" goes for this learner's current choice. */
export function homeHref(mode: ExamMode | null, paper: PaperChoice | null): string {
  if (mode === "afcat") return "/afcat/dashboard";
  return withPaper("/dashboard", paperForMode(mode === "nda" ? "nda" : "cds", paper));
}

/**
 * The tab to open when entering a mode: the remembered tab if it belongs to that mode,
 * otherwise the mode's default (CDS/CAPF: GS; NDA: its first live paper).
 */
export function paperForMode(mode: "cds" | "nda", remembered: PaperChoice | null): PaperChoice | null {
  if (remembered && tabMode(remembered) === mode) return remembered;
  return defaultTabForMode(mode);
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Remembered choice, hydration-safe (null on the server and during the first client render). */
export function useRememberedPaper(): PaperChoice | null {
  return useSyncExternalStore(subscribe, readPaperChoice, () => null);
}

export function useRememberedExamMode(): ExamMode | null {
  return useSyncExternalStore(subscribe, readExamMode, () => null);
}

/** Exam mode of the paper in force right now (CDS/CAPF when nothing is chosen). */
export function useActiveTabMode(): "cds" | "nda" {
  const paper = useActivePaper();
  return paper ? tabMode(paper) : "cds";
}

/**
 * The paper in force right now: the URL's own `paper` param wins (a session or link says which
 * paper it belongs to); otherwise the learner's remembered tab.
 */
export function useActivePaper(): PaperChoice | null {
  const fromUrl = parseSeparatePaperTab(useSearchParams().get("paper"));
  const remembered = useRememberedPaper();
  return fromUrl ?? remembered;
}
