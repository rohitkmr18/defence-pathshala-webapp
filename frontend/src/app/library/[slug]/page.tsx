import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, ClipboardCheck } from "lucide-react";
import Breadcrumbs from "@/components/public/Breadcrumbs";
import EbookPageReader from "@/components/library/EbookPageReader";
import LibraryQuiz from "@/components/library/LibraryQuiz";
import { LIBRARY_BOOKS, LIBRARY_QUIZ_ANCHOR, getLibraryBook, libraryOgSrc, libraryPageBase } from "@/lib/library/books";
import { LIBRARY_HOTSPOTS } from "@/lib/library/hotspots";
import { getLibraryQuiz } from "@/lib/library/quizzes";
import { SITE_URL, pageMetadata } from "@/lib/seo-metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIBRARY_BOOKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const book = getLibraryBook(slug);
  if (!book) return {};
  return pageMetadata({
    title: book.seoTitle,
    description: book.seoDescription,
    path: `/library/${book.slug}`,
    type: "article",
    image: `${SITE_URL}${libraryOgSrc(book.slug)}`,
    imageAlt: `${book.title} cover`,
    imageWidth: 1200,
    imageHeight: 630,
  });
}

export default async function LibraryBookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = getLibraryBook(slug);
  const quiz = getLibraryQuiz(slug);
  if (!book || !quiz) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Library", item: `${SITE_URL}/library` },
      { "@type": "ListItem", position: 3, name: book.title, item: `${SITE_URL}/library/${book.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <Breadcrumbs items={[{ label: "Free Library", href: "/library" }, { label: book.title }]} />

        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">{book.kicker} · Free</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{book.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{book.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {book.highlights.map((h) => (
              <li key={h} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{h}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs font-semibold text-slate-500">For {book.exams.join(" · ")} · {book.edition}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`#page-1`} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> Start reading
            </a>
            <a href={`#${LIBRARY_QUIZ_ANCHOR}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              <ClipboardCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" /> Jump to {book.mcqCount} MCQs
            </a>
          </div>
        </header>

        <div className="mt-8">
          <EbookPageReader
            title={book.title}
            srcBase={libraryPageBase(book.slug)}
            pages={book.readerPages}
            pageWidth={book.pageWidth}
            pageHeight={book.pageHeight}
            sections={book.sections}
            hotspots={LIBRARY_HOTSPOTS[book.slug] ?? []}
            eventPrefix="library_book"
            eventKey="book"
            eventId={book.slug}
            anchorTarget={LIBRARY_QUIZ_ANCHOR}
            pageAnchors
          />
        </div>

        <LibraryQuiz
          quiz={quiz}
          bookTitle={book.title}
          pyqCount={book.pyqCount}
          practice={book.practice}
          anchorId={LIBRARY_QUIZ_ANCHOR}
        />

        <nav aria-label="Keep practising" className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-slate-950">Keep practising {book.subject}</h2>
          <p className="mt-1 text-sm text-slate-600">Real UPSC previous-year questions with explanations, topic by topic.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={book.practice.href} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-500">
              {book.practice.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {book.archives.map((a) => (
              <Link key={a.href} href={a.href} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
                {a.label}
              </Link>
            ))}
            <Link href="/library" className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              All free eBooks
            </Link>
          </div>
        </nav>
      </section>
    </main>
  );
}
