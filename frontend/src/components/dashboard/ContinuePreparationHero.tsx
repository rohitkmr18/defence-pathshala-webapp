import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  name: string;
  exam: string;
  targetYear?: number | null;
  accuracy?: number;
  lastTopic?: string;
}

export default function ContinuePreparationHero({
  name,
  exam,
  targetYear,
  accuracy = 0,
  lastTopic = "Start your first practice",
}: Props) {
  const firstName = name?.trim()?.split(" ")[0] || "Aspirant";

  return (
    <section className="rounded-3xl bg-black p-8 text-white">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-400">
        Welcome back
      </p>

      <h1 className="mt-2 text-4xl font-bold">
        Hi, {firstName} 👋
      </h1>

      <p className="mt-4 text-2xl font-semibold">
        Continue your preparation
      </p>

      <p className="mt-3 max-w-xl text-gray-300">
        You're preparing for{" "}
        <strong>
          {exam}
          {targetYear ? ` ${targetYear}` : ""}
        </strong>
        . Pick up exactly where you left off.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-400">Accuracy</p>
          <p className="mt-1 text-3xl font-bold">{accuracy}%</p>
        </div>

        <div>
          <p className="text-sm text-gray-400">Focus</p>
          <p className="mt-1 text-xl font-semibold">{lastTopic}</p>
        </div>

        {targetYear && (
          <div>
            <p className="text-sm text-gray-400">Target</p>
            <p className="mt-1 text-xl font-semibold">{targetYear}</p>
          </div>
        )}
      </div>

      <Link
        href="/dashboard/practice"
        className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-100"
      >
        Continue Practice
        <ArrowRight className="ml-2 h-5 w-5" />
      </Link>
    </section>
  );
}