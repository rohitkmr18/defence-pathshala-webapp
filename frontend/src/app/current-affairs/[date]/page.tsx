import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Layers, Sparkles } from "lucide-react";
import {
  getCurrentAffairsByDate,
  getAdjacentDays,
} from "@/lib/current-affairs";
import SlideViewer from "@/components/current-affairs/SlideViewer";
import NavigationButtons from "@/components/current-affairs/NavigationButtons";

export const revalidate = 60;
export const dynamic = "force-dynamic";

interface DayPageProps {
  params: Promise<{
    date: string;
  }>;
}

export async function generateMetadata({ params }: DayPageProps) {
  const { date } = await params;
  const post = await getCurrentAffairsByDate(date);

  return {
    title: post
      ? `${post.formattedDate} · Daily Current Affairs | Defence Pathshala`
      : "Daily Current Affairs Brief",
    description: post?.summary || "Exam-focused daily visual current affairs.",
  };
}

export default async function CurrentAffairsDayPage({ params }: DayPageProps) {
  const { date } = await params;
  const post = await getCurrentAffairsByDate(date);

  if (!post) {
    notFound();
  }

  const { prevDate, nextDate } = await getAdjacentDays(date);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-24">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/current-affairs"
            className="inline-flex items-center gap-1.5 rounded-xl text-xs font-bold text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Current Affairs</span>
          </Link>
        </div>

        {/* Hero Date Header Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {post.formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {post.isLatest && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Latest Edition</span>
                </span>
              )}
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {post.date}
              </span>
            </div>
          </div>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {post.title}
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {post.summary}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              <span>{post.slideCount} Carousel Slides</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>~{post.readingTimeMinutes} min reading time</span>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">
              UPSC CDS • CAPF • NDA
            </span>
          </div>
        </div>

        {/* Slide Carousel Viewer */}
        <section aria-label="Current Affairs Slide Viewer">
          <SlideViewer slides={post.slides} title={post.title} />
        </section>

        {/* Previous / Next Day Navigation Buttons */}
        <NavigationButtons
          prevDate={prevDate}
          nextDate={nextDate}
          currentDate={post.date}
        />
      </div>
    </main>
  );
}
