"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuestionBankMeta } from "@/lib/question-bank";
import {
  getQuestionBank,
  type QuestionBankPayload,
} from "@/lib/question-bank-client";
import DonutChart from "@/components/charts/DonutChart";

interface Props {
  meta: QuestionBankMeta;
}

export default function QuestionBankExplorer({ meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const readList = (key: string) =>
    searchParams.get(key)?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];

  const [selectedExams, setSelectedExams] = useState<string[]>(() => {
    const initial = readList("exam");
    return initial.length ? initial : meta.exams[0]?.value ? [meta.exams[0].value] : [];
  });

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const exam of selectedExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.years ?? []) {
        years.add(item);
      }
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [meta.exams, selectedExams]);

  const availableCycles = useMemo(() => {
    const cycles = new Set<string>();
    for (const exam of selectedExams) {
      for (const item of meta.exams.find((entry) => entry.value === exam)?.cycles ?? []) {
        cycles.add(item);
      }
    }
    return Array.from(cycles).sort();
  }, [meta.exams, selectedExams]);

  const [selectedYears, setSelectedYears] = useState<number[]>(() => {
    const initial = readList("year").map(Number).filter(Number.isFinite);
    if (initial.length) return initial;
    const firstExam = meta.exams.find((entry) => entry.value === selectedExams[0]);
    return firstExam?.years[0] ? [firstExam.years[0]] : [];
  });

  const [selectedCycles, setSelectedCycles] = useState<string[]>(() => {
    const initial = readList("cycle");
    if (initial.length) return initial;
    const firstExam = meta.exams.find((entry) => entry.value === selectedExams[0]);
    return firstExam?.cycles[0] ? [firstExam.cycles[0]] : [];
  });
  const [data, setData] = useState<QuestionBankPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const activeYears = selectedYears.filter((item) => availableYears.includes(item));
  const activeCycles = selectedCycles.filter((item) => availableCycles.includes(item));

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedExams.length) params.set("exam", selectedExams.join(","));
    if (activeYears.length) params.set("year", activeYears.join(","));
    if (activeCycles.length) params.set("cycle", activeCycles.join(","));

    router.replace(`/dashboard/question-bank?${params.toString()}`, {
      scroll: false,
    });
  }, [activeCycles, activeYears, router, selectedExams]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      try {
        const result = await getQuestionBank({
          exams: selectedExams,
          years: activeYears,
          cycles: activeCycles,
        });

        if (!cancelled) {
          setData(result);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [activeCycles, activeYears, selectedExams]);

  const selectedExamLabels = selectedExams.map(
    (value) => meta.exams.find((item) => item.value === value)?.label ?? value
  );

  function toggleValue<T>(values: T[], value: T) {
    return values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value];
  }

  return (
    <section
      aria-busy={loading}
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="mb-8">
        <span className="inline-block rounded-full border border-blue-200/80 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 shadow-2xs mb-2">
          Explore
        </span>

        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Explore PYQ Insights
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Select multiple exams, years and cycles to compare question patterns.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Exam */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Exam
          </label>

          <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-300 p-2">
            {meta.exams.map((item) => (
              <label
                key={item.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedExams.includes(item.value)}
                  onChange={() => setSelectedExams((current) => toggleValue(current, item.value))}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Year */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Year
          </label>

          <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-300 p-2">
            {availableYears.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={activeYears.includes(item)}
                  onChange={() => setSelectedYears((current) => toggleValue(current, item))}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cycle */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Cycle
          </label>

          {availableCycles.length ? (
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-gray-300 p-2">
              {availableCycles.map((item) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={activeCycles.includes(item)}
                    onChange={() => setSelectedCycles((current) => toggleValue(current, item))}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-400">
              Not applicable
            </div>
          )}
        </div>
      </div>

      {/* Live Selection Preview */}
      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
          Current Selection
        </p>

        <div className="mt-3 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-blue-200/80 bg-white px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            {selectedExamLabels.length ? selectedExamLabels.join(", ") : "No exams"}
          </span>

          <span className="rounded-full border border-blue-200/80 bg-white px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
            {activeYears.length ? activeYears.join(", ") : "All years"}
          </span>

          {activeCycles.length > 0 && (
            <span className="rounded-full border border-blue-200/80 bg-white px-3.5 py-1 text-xs font-bold text-blue-700 shadow-2xs">
              Cycles {activeCycles.join(", ")}
            </span>
          )}
        </div>
      </div>

      {data && (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions</p>
            <p className="mt-1.5 text-3xl font-black text-slate-900">
              {data.summary.questions}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subjects</p>
            <p className="mt-1.5 text-3xl font-black text-blue-600">
              {data.summary.subjects}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Exam</p>
            <p className="mt-1.5 truncate text-lg font-bold text-slate-900">
              {selectedExamLabels.join(", ") || "All exams"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Year</p>
            <p className="mt-1.5 text-3xl font-black text-slate-900">
              {activeYears.length ? activeYears.join(", ") : "All years"}
            </p>
          </div>
        </section>
      )}

      {data && (
        <>
          <section className="mt-8">
            <DonutChart
              title="Subject Distribution"
              subtitle="Question Intelligence"
              centerLabel="Questions"
              centerValue={data.summary.questions}
              data={data.subjects}
            />
          </section>

          <section className="mt-8">
            <DonutChart
              title="Difficulty Distribution"
              subtitle="Question Intelligence"
              centerLabel="Questions"
              centerValue={data.summary.questions}
              data={data.difficulty}
            />
          </section>

          <section className="mt-8">
            <DonutChart
              title="Question Pattern Distribution"
              subtitle="Question Intelligence"
              centerLabel="Questions"
              centerValue={data.summary.questions}
              data={data.questionPatterns}
            />
          </section>

          <section className="mt-8">
            <DonutChart
              title="Question Type Distribution"
              subtitle="Question Intelligence"
              centerLabel="Questions"
              centerValue={data.summary.questions}
              data={data.questionTypes}
            />
          </section>
        </>
      )}
    </section>
  );
}