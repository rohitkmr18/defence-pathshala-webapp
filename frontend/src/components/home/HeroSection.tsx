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
    <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-9 text-white sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold tracking-widest text-blue-300">CDS · CAPF AC · AFCAT</p>
        <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">Stop Guessing.<br /><span className="text-blue-400">Start Preparing Smarter.</span></h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg">Decode previous year questions, practise across subjects, take exam-style mocks, and turn your performance into a smarter study plan.</p>
        <fieldset className="mt-6">
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
        <p className="mt-3 min-h-10 text-sm text-slate-300" aria-live="polite">{afcat ? "AFCAT: full-length written mocks in the dedicated AFCAT engine." : exam === "capf" ? "CAPF AC: Paper I practice and full-paper mocks." : "CDS: GK, English and Mathematics practice. Full-paper mocks cover GK."}</p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={practice} onClick={intent} className={`${linkClass} bg-blue-600 text-white hover:bg-blue-500`}>{afcat ? "Explore Free AFCAT Mocks" : "Start Free Practice"} →</Link>
          <Link href={afcat ? "/afcat" : `/dashboard/question-bank?${params}`} className={`${linkClass} border border-slate-500 hover:bg-slate-800`}>{afcat ? "See Mock Coverage" : "Decode PYQs"}</Link>
        </div>
        <p className="mt-3 text-xs text-slate-400">{afcat ? "Sign in to save your mock performance." : "Try targeted practice without signing in. Sign in for full-paper mocks and saved progress."}</p>
        {exam === "cds" && <div className="mt-4 grid grid-cols-3 gap-2 mx-auto max-w-sm text-sm">{["english", "maths"].map((paper) => <Link key={paper} href={`/dashboard/practice?paper=${paper}&exam=CDS&origin=home`} onClick={() => { rememberExamMode("cds"); rememberPaperChoice(paper as "english" | "maths"); trackLearningEvent("landing_practice_intent", { exam: "cds", paper }); }} className="inline-flex min-h-11 items-center px-3 text-blue-300 underline underline-offset-4">{paper === "maths" ? "Mathematics" : "English"} practice →</Link>)}</div>}
      </div>
    </section>
  );
}
