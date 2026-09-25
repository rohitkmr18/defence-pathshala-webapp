import { getQuestionBankMeta } from "@/lib/question-bank";
import QuestionBankExplorer from "@/components/question-bank/QuestionBankExplorer";

export default async function QuestionBankPage() {
  const meta = await getQuestionBankMeta();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Defence Pathshala
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            PYQ Insights
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Explore UPSC question patterns across exams, years, cycles,
            subjects, topics and difficulty using the proprietary PYQ
            Intelligence database.
          </p>
        </div>

        <QuestionBankExplorer meta={meta} />
      </div>
    </main>
  );
}