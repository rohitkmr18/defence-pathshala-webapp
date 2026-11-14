import { SITE_URL } from "@/lib/seo-metadata";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Escape HTML-significant characters before embedding editorial data in a script. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function articleSchema(input: {
  path: string;
  headline: string;
  description?: string | null;
  citations: string[];
}) {
  const url = `${SITE_URL}${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: input.headline,
    description: input.description || undefined,
    inLanguage: "en",
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    citation: [...new Set(input.citations)].filter((value) => /^https?:\/\//.test(value)),
  };
}

export function bookSchema(book: {
  slug: string; title: string; description: string; publishedOn: string; pageCount: number;
}) {
  const url = `${SITE_URL}/library/${book.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": `${url}#book`,
    url,
    name: book.title,
    description: book.description,
    bookFormat: "https://schema.org/EBook",
    datePublished: book.publishedOn,
    numberOfPages: book.pageCount,
    inLanguage: "en",
    isAccessibleForFree: true,
    publisher: { "@id": ORGANIZATION_ID },
  };
}
