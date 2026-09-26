import { Suspense } from "react";
import { getQuestionBankMeta } from "@/lib/question-bank";
import QuestionBankExplorer from "@/components/question-bank/QuestionBankExplorer";

export const metadata = {
  title: "PYQ Insights – Defence Pathshala",
  description:
    "Explore UPSC question patterns across exams, years, cycles, subjects, topics and difficulty using the proprietary PYQ Intelligence database.",
};

export default async function QuestionBankPage() {
  const meta = await getQuestionBankMeta();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
        <div className="mb-7 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">
            Defence Pathshala
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            PYQ Insights
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Explore UPSC question patterns across exams, years, cycles,
            subjects, topics and difficulty using the proprietary PYQ
            Intelligence database.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="animate-pulse space-y-6">
                <div className="h-6 w-48 rounded bg-slate-200" />
                <div className="flex gap-3">
                  <div className="h-10 w-24 rounded-full bg-slate-100" />
                  <div className="h-10 w-24 rounded-full bg-slate-100" />
                </div>
                <div className="h-64 rounded-2xl bg-slate-100" />
              </div>
            </div>
          }
        >
          <QuestionBankExplorer meta={meta} />
        </Suspense>
      </div>
    </main>
  );
}