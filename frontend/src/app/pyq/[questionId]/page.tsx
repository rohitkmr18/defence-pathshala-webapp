import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerProfile } from "@/lib/profile-server";
import { EXACT_PYQ_ID } from "@/lib/exact-pyq";
import SessionPageClient from "@/app/dashboard/practice/session/SessionPageClient";

export const dynamic = "force-dynamic";
export default async function ExactPyqPage({ params, searchParams }: {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<{ edition?: string; monthly?: string }>;
}) {
  const { questionId } = await params;
  if (!EXACT_PYQ_ID.test(questionId)) notFound();
  const { edition, monthly } = await searchParams;
  const date = typeof edition === "string" && /^\d{4}-\d{2}-\d{2}$/.test(edition) ? edition : null;
  const fromMonthly = monthly === "2026-10" && date === "2026-10-14";
  const next = `/pyq/${encodeURIComponent(questionId)}${date ? `?edition=${date}${fromMonthly ? "&monthly=2026-10" : ""}` : ""}`;
  await getServerProfile(next);
  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6"><div className="mx-auto max-w-3xl">
    <Suspense fallback={<p role="status">Loading your linked PYQ…</p>}>
      <SessionPageClient mode="instant" exactQuestionId={questionId} origin="current_affairs_pyq"
        returnTo={fromMonthly ? "/current-affairs/monthly/2026-10/sample" : date ? `/current-affairs/${date}` : "/current-affairs"} />
    </Suspense>
  </div></main>;
}
