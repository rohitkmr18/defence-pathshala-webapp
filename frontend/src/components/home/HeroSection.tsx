"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackLearningEvent } from "@/lib/learning-events";
import { rememberExamMode, rememberPaperChoice } from "@/lib/learner-mode";
import { liveExams } from "@/lib/exam-registry";

const exams = liveExams().filter((exam) => exam.slug !== "nda");
const linkClass = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400";

export default function HeroSection() {
  const [exam, setExam] = useState("cds");
  useEffect(() => {
    const sync = () => {
      const value = new URLSearchParams(window.location.search).get("exam");
      setExam(exams.some((item) => item.slug === value) ? value! : "cds");
    };
    sync();
    window.addEventListener("popstate", sync);
    trackLearningEvent("landing_view", { surface: "home" });
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const afcat = exam === "afcat";
  const params = `origin=home&paper=gs&exam=${exam === "capf" ? "CAPF-AC" : "CDS"}`;
  const practice = afcat ? "/afcat" : `/dashboard/practice?${params}`;
  function intent() {
    rememberExamMode(afcat ? "afcat" : "cds");
    if (!afcat) rememberPaperChoice("gs");
    trackLearningEvent("landing_practice_intent", { exam, destination: practice });
  }
  return (
    <section aria-label="Exam preparation" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-7 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold tracking-widest text-blue-300">CDS · CAPF AC · AFCAT</p>
        <h1 className="mt-3 text-[1.75rem] font-black leading-tight tracking-tight min-[375px]:text-[2rem] sm:text-5xl lg:text-6xl"><span className="block text-white">Crack the Pattern.</span><span className="block text-blue-400">Master the Exam.</span></h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-lg">Authentic PYQs, smart practice, exam-style mocks and performance insights — all in one place.</p>
        <fieldset className="mt-4">
          <legend className="mx-auto mb-2 text-sm text-slate-300">Choose your exam</legend>
          <div className="grid grid-cols-3 gap-2 mx-auto max-w-sm">
            {exams.map((item) => <button key={item.slug} type="button" aria-pressed={exam === item.slug} className={`min-h-12 rounded-xl px-2 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 border ${exam === item.slug ? "border-blue-400 bg-blue-600 text-white" : "border-slate-500 text-slate-200 hover:bg-slate-800"}`} onClick={() => {
              setExam(item.slug);
              const url = new URL(window.location.href);
              url.searchParams.set("exam", item.slug);
              window.history.pushState(null, "", url);
              trackLearningEvent("landing_exam_selection", { exam: item.slug });
            }}>{item.slug === "capf" ? "CAPF AC" : item.label}</button>)}
          </div>
        </fieldset>
        <div className="mx-auto mt-4 max-w-sm">
          <Link href={practice} onClick={intent} className={`${linkClass} w-full bg-blue-600 text-white hover:bg-blue-500`}>{afcat ? "Explore AFCAT Mocks" : exam === "capf" ? "Start CAPF AC Practice" : "Start CDS Practice"}</Link>
        </div>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-slate-300">By Rohit · CAPF AC AIR 163 · IIT Kanpur · CDS ×4</p>
      </div>
    </section>
  );
}
