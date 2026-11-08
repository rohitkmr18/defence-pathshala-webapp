import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ChevronRight, ListChecks } from "lucide-react";
import { getDailyCurrentAffairsList } from "@/lib/current-affairs";
import { formatMonthLabel, isValidMonthKey, monthKeyOf, summariseMonths } from "@/lib/current-affairs-calendar";
import MonthlyCapsuleCard from "@/components/current-affairs/MonthlyCapsuleCard";
import { getMonthlyCapsule } from "@/lib/monthly-capsules";
import { pageMetadata } from "@/lib/seo-metadata";

export const revalidate = 300;

async function loadMonth(month: string) {
  if (!isValidMonthKey(month)) return null;
  const posts = await getDailyCurrentAffairsList();
  const inMonth = posts.filter((p) => monthKeyOf(p.date) === month);
  if (inMonth.length === 0) return null;
  const months = summariseMonths(posts.map((p) => p.date)).map((m) => m.month); // newest first
  const index = months.indexOf(month);
  return {
    posts: inMonth,
    newer: index > 0 ? months[index - 1] : null,
    older: index >= 0 && index < months.length - 1 ? months[index + 1] : null,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;
  const data = await loadMonth(month);
  if (!data) return {};
  const label = formatMonthLabel(month);
  return pageMetadata({
    title: `Current Affairs ${label} for Defence Exams`,
    description: `All ${data.posts.length} daily current affairs editions for ${label}, with exam-focused stories and MCQs for CDS, CAPF, AFCAT and NDA.`,
    path: `/current-affairs/month/${month}`,
  });
}

export default async function CurrentAffairsMonthPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const data = await loadMonth(month);
  if (!data) notFound();
  const label = formatMonthLabel(month);
  const stories = data.posts.reduce((n, p) => n + p.storyCount, 0);
  const mcqs = data.posts.reduce((n, p) => n + p.quizCount, 0);
  const capsule = getMonthlyCapsule(month);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link href="/current-affairs" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All Current Affairs
        </Link>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Monthly archive</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{`Current Affairs — ${label}`}</h1>
          <p className="mt-3 text-sm text-slate-600 sm:text-base">
            {data.posts.length} {data.posts.length === 1 ? "edition" : "editions"} · {stories} stories · {mcqs} MCQs
          </p>
        </header>

        {capsule && (
          <div className="mt-8">
            <MonthlyCapsuleCard capsule={capsule} />
          </div>
        )}

        <ul className="mt-8 space-y-3">
          {data.posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/current-affairs/${post.date}`}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:p-6"
              >
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{post.formattedDate}
                  </span>
                  <h2 className="mt-2 text-lg font-bold text-slate-950">{post.stories[0]?.headline ?? `Daily Current Affairs — ${post.formattedDate}`}</h2>
                  <div className="mt-2 flex gap-4 text-xs font-semibold text-slate-500">
                    <span>{post.storyCount} stories</span>
                    <span className="inline-flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" aria-hidden="true" />{post.quizCount} MCQs</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <nav aria-label="Other months" className="mt-8 flex flex-wrap justify-between gap-3">
          {data.older ? (
            <Link href={`/current-affairs/month/${data.older}`} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              ← {formatMonthLabel(data.older)}
            </Link>
          ) : <span />}
          {data.newer && (
            <Link href={`/current-affairs/month/${data.newer}`} className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700">
              {formatMonthLabel(data.newer)} →
            </Link>
          )}
        </nav>
      </section>
    </main>
  );
}
