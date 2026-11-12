// ─────────────────────────────────────────────────────────────────────────────
// Free Library — subject revision eBooks, read online only.
// Reading pages are pre-rendered images under /public/library/<slug>/.
// The source PDF is intentionally NOT shipped to the browser, and the MCQ and
// answer-key pages are served as the interactive practice instead of images.
// Add a book: run scripts/library/convert_book.py, add an entry here, add its
// quiz file, and register the quiz in src/lib/library/quizzes.ts.
// ─────────────────────────────────────────────────────────────────────────────

export type LibraryExam = "CDS" | "CAPF" | "NDA" | "AFCAT" | "UPSC";
export const LIBRARY_EXAMS: LibraryExam[] = ["CDS", "CAPF", "NDA", "AFCAT", "UPSC"];

/** A contents entry. page 0 = the interactive MCQ practice. */
export interface LibrarySection {
  title: string;
  detail?: string;
  page: number;
}

export interface LibraryLink {
  label: string;
  href: string;
}

export interface LibraryBook {
  slug: string;
  title: string;
  /** Short label for cards and filters, e.g. "Biology". */
  subject: string;
  kicker: string;
  edition: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  exams: LibraryExam[];
  highlights: string[];
  publishedOn: string; // YYYY-MM-DD
  /** Pages in the source eBook (including those served as the quiz). */
  pageCount: number;
  /** Image pages shown in the reader, in order. */
  readerPages: number[];
  pageWidth: number;
  pageHeight: number;
  contentsPage: number;
  sections: LibrarySection[];
  mcqCount: number;
  pyqCount: number;
  practice: LibraryLink;
  archives: LibraryLink[];
}

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const LIBRARY_BOOKS: LibraryBook[] = [
  {
    slug: "polity-decoded",
    title: "Polity Decoded",
    subject: "Polity",
    kicker: "Indian Polity · Revision eBook",
    edition: "Edition 1 · Nov 2026",
    description:
      "The Constitution, Parliament, courts, federalism and the bodies that run India — revised the way CDS and CAPF (AC) actually ask them, with diagrams, traps and real previous-year questions.",
    seoTitle: "Polity Decoded: Free Indian Polity Revision eBook for CDS, CAPF, NDA, AFCAT",
    seoDescription:
      "Free Indian Polity revision eBook for CDS, CAPF (AC), NDA and AFCAT: Constitution, Parliament, judiciary, federalism, bodies and amendments, with 30 practice MCQs you can attempt online.",
    exams: ["CDS", "CAPF", "NDA", "AFCAT", "UPSC"],
    highlights: ["11 sections", "53 diagrams & tables", "30 MCQs · instant score card", "100 last-minute one-liners"],
    publishedOn: "2026-11-12",
    pageCount: 64,
    readerPages: range(1, 51),
    pageWidth: 1215,
    pageHeight: 1720,
    contentsPage: 3,
    sections: [
      { title: "Contents", page: 3 },
      { title: "What UPSC asks in Polity", detail: "How questions are framed", page: 4 },
      { title: "The Constitution at a glance", detail: "25 Parts, 12 Schedules on one page", page: 5 },
      { title: "Making of the Constitution", detail: "Acts 1773–1947, Constituent Assembly, sources, Schedules", page: 6 },
      { title: "Preamble, Union & Citizenship", detail: "Preamble words, Articles 1–4, Articles 5–11, CAA", page: 11 },
      { title: "Rights, Directives & Duties", detail: "Articles 12–35, writs, DPSP, 11 Fundamental Duties", page: 14 },
      { title: "Union Executive", detail: "President, Vice-President, PM, Council of Ministers, AG", page: 19 },
      { title: "Parliament", detail: "Houses, presiding officers, motions, bills, budget, committees", page: 23 },
      { title: "Judiciary", detail: "Supreme Court, High Courts, PIL, landmark cases", page: 28 },
      { title: "Federalism & Emergency", detail: "Seventh Schedule, Articles 352/356/360, Article 371", page: 32 },
      { title: "States & Local Government", detail: "Governor, state legislature, 73rd & 74th Amendments", page: 36 },
      { title: "Bodies & Elections", detail: "ECI, CAG, UPSC, FC, NHRC, CIC, NITI, anti-defection", page: 39 },
      { title: "Amendments & Basic Structure", detail: "Article 368, key amendments, Kesavananda line", page: 43 },
      { title: "Political Theory & Governance", detail: "Concepts, thinkers, public administration, symbols", page: 46 },
      { title: "High-potential watch-list", detail: "What could be asked in 2026–27", page: 49 },
      { title: "Last-minute one-liners", detail: "100 facts for the night before the exam", page: 50 },
      { title: "MCQ practice", detail: "30 questions — attempt online, get a score card", page: 0 },
    ],
    mcqCount: 30,
    pyqCount: 13,
    practice: {
      label: "Practise Polity PYQs",
      href: "/dashboard/practice?paper=gs&subject=Polity&origin=library",
    },
    archives: [
      { label: "CDS Polity PYQs", href: "/pyqs/cds/polity" },
      { label: "CAPF (AC) Polity PYQs", href: "/pyqs/capf/polity" },
    ],
  },
  {
    slug: "biology-decoded",
    title: "Biology Decoded",
    subject: "Biology",
    kicker: "General Science · Rapid Revision",
    edition: "Edition 1 · Nov 2026",
    description:
      "Every concept UPSC asks from Biology — cell to biotechnology — in exam language, with diagrams, traps and real previous-year questions.",
    seoTitle: "Biology Decoded: Free Biology Revision eBook for CDS, CAPF, NDA, AFCAT",
    seoDescription:
      "Free Biology (General Science) revision eBook for CDS, CAPF (AC), NDA and AFCAT: cell, physiology, genetics, health and biotechnology, with 20 practice MCQs you can attempt online.",
    exams: ["CDS", "CAPF", "NDA", "AFCAT", "UPSC"],
    highlights: ["9 sections", "13 diagrams", "20 MCQs · instant score card", "60 last-minute one-liners"],
    publishedOn: "2026-11-12",
    pageCount: 46,
    readerPages: range(1, 38),
    pageWidth: 1215,
    pageHeight: 1720,
    contentsPage: 3,
    sections: [
      { title: "Contents", page: 3 },
      { title: "What UPSC asks in Biology", detail: "How questions are framed", page: 4 },
      { title: "The Cell", detail: "Organelles, membranes, transport, division", page: 5 },
      { title: "Biomolecules, Enzymes & Energy", detail: "Sugars, proteins, lipids, enzymes, ATP, respiration", page: 9 },
      { title: "Plant & Animal Tissues", detail: "Meristems, xylem/phloem, four animal tissues", page: 12 },
      { title: "Diversity of Living Organisms", detail: "Five kingdoms, plant groups, animal phyla, vertebrates", page: 14 },
      { title: "Plant Physiology", detail: "Photosynthesis, nutrients, transport, hormones, reproduction", page: 18 },
      { title: "Human Physiology", detail: "Digestion, breathing, heart & blood, kidney, nerves, hormones", page: 22 },
      { title: "Genetics & Evolution", detail: "Mendel, sex determination, DNA, evolution evidence", page: 31 },
      { title: "Health, Disease & Immunity", detail: "Pathogens, vectors, deficiencies, vaccines, AIDS, cancer", page: 33 },
      { title: "Biotechnology & Microbes", detail: "Genetic engineering, vaccines, microbes in daily life", page: 36 },
      { title: "Last-minute one-liners", detail: "60 facts for the night before the exam", page: 38 },
      { title: "MCQ practice", detail: "20 questions — attempt online, get a score card", page: 0 },
    ],
    mcqCount: 20,
    pyqCount: 11,
    practice: {
      label: "Practise Biology PYQs",
      href: "/dashboard/practice?paper=gs&subject=Science+%26+Technology&topic=Biology%2FLife+Sciences&origin=library",
    },
    archives: [
      { label: "CDS Biology PYQs", href: "/pyqs/cds/science-technology/biology-life-sciences" },
      { label: "CAPF (AC) Biology PYQs", href: "/pyqs/capf/science-technology/biology-life-sciences" },
    ],
  },
];

export function getLibraryBook(slug: string): LibraryBook | null {
  return LIBRARY_BOOKS.find((b) => b.slug === slug) ?? null;
}

export function libraryPageBase(slug: string): string {
  return `/library/${slug}`;
}

/** 1200×630 JPEG link-preview card (WhatsApp, Facebook, Slack). Kept outside the book folder. */
export function libraryOgSrc(slug: string): string {
  return `/library/og/${slug}.jpg`;
}

export function libraryPageSrc(slug: string, page: number): string {
  return `${libraryPageBase(slug)}/page-${String(page).padStart(2, "0")}.webp`;
}

/** Books tagged with an exam, newest first. */
export function booksForExam(exam: LibraryExam | null): LibraryBook[] {
  return LIBRARY_BOOKS.filter((b) => !exam || b.exams.includes(exam)).sort((a, b) =>
    a.publishedOn === b.publishedOn ? 0 : a.publishedOn < b.publishedOn ? 1 : -1,
  );
}

export const LIBRARY_QUIZ_ANCHOR = "practice";
