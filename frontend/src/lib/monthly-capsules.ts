// ─────────────────────────────────────────────────────────────────────────────
// Monthly Current Affairs capsules — read online only.
// Pages are pre-rendered images under /public/monthly-capsule/<edition>/.
// The source PDF is intentionally NOT shipped to the browser.
// ─────────────────────────────────────────────────────────────────────────────

export interface CapsuleSection {
  title: string;
  page: number;
}

/** A clickable area on a page image, in percentages of the page box. */
export interface CapsuleHotspot {
  page: number;
  target: number;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface MonthlyCapsule {
  edition: string; // YYYY-MM
  label: string; // "October 2026"
  title: string;
  description: string;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
  publishedOn: string; // YYYY-MM-DD
  highlights: string[];
  sections: CapsuleSection[];
  contentsPage: number;
}

export const MONTHLY_CAPSULES: MonthlyCapsule[] = [
  {
    edition: "2026-10",
    label: "October 2026",
    title: "October 2026 Current Affairs Capsule",
    description:
      "All of October 2026 for AFCAT, CDS, NDA and CAPF in one visual capsule: defence, international relations, economy, polity, environment, science, geography, sports and awards, with 52 MCQs and an answer key.",
    pageCount: 49,
    pageWidth: 1215,
    pageHeight: 1720,
    publishedOn: "2026-11-05",
    highlights: ["49 pages", "9 subject sections", "52 MCQs + answer key", "Exam hooks & static GK link-ups"],
    contentsPage: 2,
    sections: [
      { title: "Contents", page: 2 },
      { title: "October at a glance", page: 3 },
      { title: "10 numbers to remember", page: 4 },
      { title: "Defence & Security", page: 5 },
      { title: "International Relations", page: 12 },
      { title: "Economy & Banking", page: 16 },
      { title: "Polity & Governance", page: 21 },
      { title: "Environment & Ecology", page: 24 },
      { title: "Science & Technology", page: 28 },
      { title: "Geography & Disasters", page: 31 },
      { title: "Sports", page: 34 },
      { title: "Awards, Reports & Days", page: 35 },
      { title: "MCQ Practice", page: 37 },
      { title: "Answer Key", page: 45 },
      { title: "Where do you stand?", page: 48 },
    ],
  },
];

export function getMonthlyCapsule(edition: string): MonthlyCapsule | null {
  return MONTHLY_CAPSULES.find((c) => c.edition === edition) ?? null;
}

export function latestMonthlyCapsule(): MonthlyCapsule | null {
  return [...MONTHLY_CAPSULES].sort((a, b) => (a.edition < b.edition ? 1 : -1))[0] ?? null;
}

export function capsulePageSrc(edition: string, page: number): string {
  return `/monthly-capsule/${edition}/page-${String(page).padStart(2, "0")}.webp`;
}

/** Section a page belongs to (the last section starting at or before it). */
export function sectionForPage(capsule: MonthlyCapsule, page: number): CapsuleSection | null {
  let current: CapsuleSection | null = null;
  for (const s of capsule.sections) if (s.page <= page) current = s;
  return current;
}

/**
 * Clickable areas recreating the PDF's internal links on the page images:
 * the contents rows (page 2) and the "INDEX ↑" link in each page header.
 */
export function capsuleHotspots(capsule: MonthlyCapsule): CapsuleHotspot[] {
  if (capsule.edition !== "2026-10") return [];
  const H = 796; // reference height of the contents layout
  const rows: Array<[number, number, number, string]> = [
    [136, 170, 3, "October at a glance"],
    [176, 210, 4, "10 numbers to remember"],
    [216, 258, 5, "Defence & Security"],
    [264, 306, 12, "International Relations"],
    [312, 354, 16, "Economy & Banking"],
    [360, 402, 21, "Polity & Governance"],
    [408, 450, 24, "Environment & Ecology"],
    [456, 498, 28, "Science & Technology"],
    [504, 546, 31, "Geography & Disasters"],
    [552, 594, 34, "Sports"],
    [600, 642, 35, "Awards, Reports & Days"],
    [648, 690, 37, "MCQ Practice"],
    [696, 730, 45, "Answer Key"],
  ];
  const contents: CapsuleHotspot[] = rows.map(([y0, y1, target, label]) => ({
    page: capsule.contentsPage,
    target,
    label: `Go to ${label}, page ${target}`,
    left: 5.3,
    top: (y0 / H) * 100,
    width: 89.4,
    height: ((y1 - y0) / H) * 100,
  }));
  const index: CapsuleHotspot[] = [];
  for (let page = 3; page <= 48; page++) {
    index.push({
      page,
      target: capsule.contentsPage,
      label: "Back to contents",
      left: 78,
      top: 0.4,
      width: 19,
      height: 3.2,
    });
  }
  return [...contents, ...index];
}
