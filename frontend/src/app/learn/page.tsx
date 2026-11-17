import Link from "next/link";
import { pageMetadata } from "@/lib/seo-metadata";
import { getPublishedKnowledgeArticles } from "@/lib/knowledge-hub";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Defence Exam Guides, Concepts and PYQ Intelligence",
  description: "Explore reliable CDS, CAPF AC, NDA and AFCAT preparation guides, exam concepts and PYQ analysis from Defence Pathshala.",
  path: "/learn",
});
export default async function KnowledgeHubPage() {
  const articles = await getPublishedKnowledgeArticles();
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-blue-700"><Link href="/">Home</Link> / Learn</nav>
        <header className="my-10 max-w-3xl">
          <p className="font-semibold uppercase tracking-widest text-blue-700">Defence Pathshala Knowledge Hub</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">Understand the concept. Practise the exam.</h1>
          <p className="mt-4 text-lg leading-8 text-slate-700">Exam preparation strategies, concept explainers and PYQ intelligence to help you learn with evidence.</p>
        </header>
        <section aria-label="Published articles" className="grid gap-5 sm:grid-cols-2">
          {articles.map((article) => (
            <article key={article.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">{article.category}{article.exam ? ` · ${article.exam}` : ""}</p>
              <h2 className="mt-3 text-xl font-bold"><Link className="hover:text-blue-700" href={`/learn/${article.slug}`}>{article.title}</Link></h2>
              <p className="mt-3 leading-7 text-slate-700">{article.description}</p>
              <Link className="mt-4 inline-block font-semibold text-blue-700 underline underline-offset-4" href={`/learn/${article.slug}`}>Read article</Link>
            </article>
          ))}
          {!articles.length && <p className="text-slate-600">Editorial articles will appear here once reviewed and published.</p>}
        </section>
        <footer className="mt-14 border-t pt-6 text-sm"><Link className="text-blue-700 underline" href="/pyqs/cds">Explore CDS PYQs</Link> · <Link className="text-blue-700 underline" href="/pyqs/capf">Explore CAPF AC PYQs</Link></footer>
      </div>
    </main>
  );
}
