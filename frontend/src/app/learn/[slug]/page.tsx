import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedKnowledgeArticle, safePracticePath, safeSourceUrl } from "@/lib/knowledge-hub";
import { pageMetadata, SITE_URL } from "@/lib/seo-metadata";
import { serializeJsonLd } from "@/lib/seo-schema";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedKnowledgeArticle(slug);
  if (!article) return { robots: { index: false, follow: false } };
  return pageMetadata({
    title: article.title, description: article.description, path: `/learn/${article.slug}`,
    type: "article", ...(article.image_url?.startsWith("https://") ? { image: article.image_url } : {}),
  });
}

export default async function KnowledgeArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedKnowledgeArticle(slug);
  if (!article) notFound();
  const url = `${SITE_URL}/learn/${article.slug}`;
  const sources = article.sources.filter((source) => safeSourceUrl(source.url));
  const schema = {
    "@context": "https://schema.org", "@type": "Article", "@id": `${url}#article`,
    headline: article.title, description: article.description, mainEntityOfPage: url,
    datePublished: article.published_at, ...(article.updated_at ? { dateModified: article.updated_at } : {}),
    author: { "@type": "Person", name: article.author_name },
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(article.image_url?.startsWith("https://") ? { image: article.image_url } : {}),
    ...(sources.length ? { citation: sources.map((s) => s.url) } : {}),
  };
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Learn", item: `${SITE_URL}/learn` },
      { "@type": "ListItem", position: 3, name: article.title, item: url },
    ],
  };
  const practice = safePracticePath(article.related_practice_url);
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-blue-700"><Link href="/">Home</Link> / <Link href="/learn">Learn</Link> / {article.category}</nav>
        <header className="mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-700">{article.category}{article.exam ? ` · ${article.exam}` : ""}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">{article.description}</p>
          <p className="mt-5 text-sm text-slate-600">By {article.author_name}{article.reviewed_by ? ` · Reviewed by ${article.reviewed_by}` : ""} · Published <time dateTime={article.published_at}>{new Date(article.published_at).toLocaleDateString("en-IN", { timeZone: "UTC", dateStyle: "medium" })}</time></p>
        </header>
        <div className="mt-10 space-y-6 leading-8">
          {article.blocks.map((block, index) => block.type === "heading"
            ? <h2 key={index} className="pt-5 text-2xl font-bold">{block.text}</h2>
            : block.type === "list"
              ? <ul key={index} className="list-disc space-y-2 pl-6">{(block.items ?? []).map((item, i) => <li key={i}>{item}</li>)}</ul>
              : <p key={index} className="text-slate-800">{block.text}</p>)}
        </div>
        {sources.length > 0 && <section className="mt-12 border-t pt-6" aria-label="Sources">
          <h2 className="text-xl font-bold">Sources and references</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">{sources.map((source) => <li key={source.url}><a href={source.url} rel="noopener noreferrer" target="_blank" className="text-blue-700 underline">{source.label}</a></li>)}</ul>
        </section>}
        {practice && <aside className="mt-10 rounded-xl bg-blue-50 p-6">
          <h2 className="text-lg font-bold">Test your understanding</h2>
          <p className="mt-2">Practise related questions on Defence Pathshala.</p>
          <Link href={practice} className="mt-4 inline-block font-semibold text-blue-700 underline">Start relevant practice</Link>
        </aside>}
        <footer className="mt-12 border-t pt-6"><Link href="/learn" className="text-blue-700 underline">Browse more guides</Link></footer>
      </article>
    </main>
  );
}
