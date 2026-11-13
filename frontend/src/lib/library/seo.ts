// Search-facing text and structured data for Free Library books.
// Every answer below is derived from the book record, so it stays true when a book changes.
import { SITE_URL } from "@/lib/seo-metadata";
import { libraryOgSrc, type LibraryBook } from "@/lib/library/books";

export const LIBRARY_AUTHOR = "Rohit Kumar";

export interface LibraryFaq {
  q: string;
  a: string;
}

export function listExams(book: LibraryBook): string {
  const names = book.exams.map((e) => (e === "CAPF" ? "CAPF (AC)" : e));
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0];
}

export function libraryFaqs(book: LibraryBook): LibraryFaq[] {
  const parts = book.sections.filter((s) => s.page > 0 && s.page !== book.contentsPage);
  return [
    {
      q: `Is ${book.title} free?`,
      a: `Yes. ${book.title} is free to read online on Defence Pathshala, and you do not need to sign in.`,
    },
    {
      q: `Can I download ${book.title} as a PDF?`,
      a: "No. Library eBooks are read online only, for personal study. They work on mobile and desktop.",
    },
    {
      q: `Which exams is ${book.title} for?`,
      a: `It is written for ${listExams(book)} aspirants, and is weighted by the ${book.subject} questions UPSC has actually asked in CDS and CAPF (AC) papers.`,
    },
    {
      q: `What does ${book.title} cover?`,
      a: `${book.pageCount} pages, from ${parts[0]?.title ?? "the basics"} to ${parts.at(-1)?.title ?? "revision"}, followed by ${book.mcqCount} practice MCQs you can attempt online for an instant score card.`,
    },
    {
      q: "Are the practice questions real previous-year questions?",
      a: `${book.pyqCount} of the ${book.mcqCount} MCQs are real UPSC previous-year questions; the rest are Defence Pathshala practice questions. Each one is labelled.`,
    },
  ];
}

export function libraryBookJsonLd(book: LibraryBook) {
  const url = `${SITE_URL}/library/${book.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "Book",
      "@id": `${url}#book`,
      name: book.title,
      alternativeHeadline: book.seoTitle,
      description: book.description,
      url,
      image: `${SITE_URL}${libraryOgSrc(book.slug)}`,
      inLanguage: "en-IN",
      bookFormat: "https://schema.org/EBook",
      numberOfPages: book.pageCount,
      bookEdition: book.edition,
      datePublished: book.publishedOn,
      isAccessibleForFree: true,
      learningResourceType: "Revision notes",
      educationalLevel: "Competitive examination",
      about: book.subject,
      keywords: [`${book.subject} notes`, ...book.exams.map((e) => `${e} ${book.subject}`), "previous year questions"].join(", "),
      audience: { "@type": "EducationalAudience", educationalRole: "student", audienceType: `${listExams(book)} aspirants` },
      author: { "@type": "Person", name: LIBRARY_AUTHOR },
      publisher: { "@type": "Organization", name: "Defence Pathshala", url: SITE_URL },
      hasPart: book.sections
        .filter((s) => s.page > 0 && s.page !== book.contentsPage)
        .map((s) => ({ "@type": "Chapter", name: s.title, ...(s.detail ? { description: s.detail } : {}), url: `${url}#page-${s.page}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: libraryFaqs(book).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
}
