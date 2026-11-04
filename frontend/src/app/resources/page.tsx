import Link from "next/link";
import type { Metadata } from "next";
import { publicResources } from "@/lib/learning-resources";

export const metadata: Metadata = {
  title: "Free Defence Exam Resources",
  description: "Free NDA, CDS and CAPF geography, current affairs and revision resources from Defence Pathshala.",
};
export default function ResourcesPage() {
  const resources = publicResources();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-semibold text-blue-700">← Defence Pathshala</Link>
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Free learning resources</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Study smarter with Defence Pathshala</h1>
          <p className="mt-3 max-w-xl text-slate-600">High-quality exam resources, reviewed before publication.</p>
        </div>
        {resources.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="font-semibold">Resources are being prepared</h2>
            <p className="mt-2 text-sm text-slate-600">Our public resource library will appear here after editorial review.</p>
            <Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/dashboard">Explore PYQs →</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {resources.map((resource) => (
              <article key={resource.slug} className="rounded-2xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-medium uppercase text-blue-700">{resource.type}</p>
                <h2 className="mt-2 text-lg font-bold">{resource.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{resource.description}</p>
                <Link className="mt-4 inline-block font-semibold text-blue-700" href={`/resources/${resource.slug}`}>Open resource →</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
