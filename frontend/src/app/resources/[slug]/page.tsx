import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResourceQuiz from "@/components/resources/ResourceQuiz";
import { cycloneQuestions } from "@/lib/cyclone-quiz";
import { resources } from "@/lib/learning-resources";

export const dynamicParams = false;
export function generateStaticParams() {
  return resources.filter(r => r.status === "published" && r.visibility !== "token_gated").map(r => ({ slug: r.slug }));
}
export async function generateMetadata({params}: {params: Promise<{slug:string}>}): Promise<Metadata> {
  const {slug} = await params;
  const resource = resources.find(r => r.slug === slug && r.status === "published" && r.visibility !== "token_gated");
  if (!resource) return {title:"Resource unavailable", robots:{index:false,follow:false}};
  return { title: resource.title, description: resource.description, robots: {index:resource.visibility === "public", follow:resource.visibility === "public"}, referrer: "no-referrer" };
}
export default async function ResourcePage({params}: {params: Promise<{slug:string}>}) {
  const {slug} = await params;
  const resource = resources.find(r => r.slug === slug && r.status === "published" && r.visibility !== "token_gated");
  if (!resource) notFound();
  if (resource.slug !== "cyclone-geography" || resource.type !== "quiz") notFound();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:py-16">
      <ResourceQuiz title={resource.title} questions={cycloneQuestions} />
    </main>
  );
}
