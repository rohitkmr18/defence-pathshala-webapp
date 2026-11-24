"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackLearningEvent } from "@/lib/learning-events";
import { rememberExamMode, rememberPaperChoice } from "@/lib/learner-mode";
import { defaultTabForMode, liveExams, ndaModeLive } from "@/lib/exam-registry";

// Landing order: CDS, CAPF AC, NDA, AFCAT (NDA appears once one of its papers is live).
const HERO_ORDER = ["cds", "capf", "nda", "afcat"];
const exams = liveExams()
  .filter((exam) => exam.slug !== "nda" || ndaModeLive())
  .sort((a, b) => HERO_ORDER.indexOf(a.slug) - HERO_ORDER.indexOf(b.slug));
const NDA_ENTRY_TAB = defaultTabForMode("nda") ?? "nda-maths";
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
  const nda = exam === "nda";
  // Each UPSC exam opens on its own first paper: CDS/CAPF on GS, NDA on its first live paper.
  const entryPaper = nda ? NDA_ENTRY_TAB : "gs";
  const params = `origin=home&paper=${entryPaper}&exam=${nda ? "NDA" : exam === "capf" ? "CAPF-AC" : "CDS"}`;
  const practice = afcat ? "/afcat" : `/dashboard/practice?${params}`;
  function rememberUpscChoice() {
    rememberExamMode(nda ? "nda" : "cds");
    rememberPaperChoice(entryPaper);
  }
  function intent() {
    if (afcat) rememberExamMode("afcat");
    else rememberUpscChoice();
    trackLearningEvent("landing_practice_intent", { exam, destination: practice });
  }
  return (
    <section aria-label="Exam preparation" className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-7 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold tracking-widest text-blue-300">{exams.map((item) => (item.slug === "capf" ? "CAPF AC" : item.label)).join(" · ")}</p>
        <h1 className="mt-3 text-[1.75rem] font-black leading-tight tracking-tight min-[375px]:text-[2rem] sm:text-5xl lg:text-6xl"><span className="block text-white">Real Questions.</span><span className="block text-blue-400">Smarter Preparation.</span></h1>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex max-w-full items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/15 px-3 py-2 text-center text-xs font-semibold leading-snug text-emerald-100 shadow-sm sm:px-4 sm:text-sm">
            <span className="mr-2 inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
            A Free Initiative for Defence Aspirants
          </span>
        </div>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-lg">Understand defence exam patterns, practise previous year questions and learn where you need to improve.</p>
        <fieldset className="mt-4">
          <legend className="mx-auto mb-2 text-sm text-slate-300">Choose your exam</legend>
          <div className={`grid ${exams.length > 3 ? "grid-cols-2 min-[400px]:grid-cols-4" : "grid-cols-3"} gap-2 mx-auto max-w-sm`}>
            {exams.map((item) => <button key={item.slug} type="button" aria-pressed={exam === item.slug} className={`min-h-12 rounded-xl px-2 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 border ${exam === item.slug ? "border-blue-400 bg-blue-600 text-white" : "border-slate-500 text-slate-200 hover:bg-slate-800"}`} onClick={() => {
              setExam(item.slug);
              const url = new URL(window.location.href);
              url.searchParams.set("exam", item.slug);
              window.history.pushState(null, "", url);
              trackLearningEvent("landing_exam_selection", { exam: item.slug });
            }}>{item.slug === "capf" ? "CAPF AC" : item.label}</button>)}
          </div>
        </fieldset>
        <div className="mx-auto mt-4 grid max-w-sm gap-2">
          <Link href={practice} onClick={intent} className={`${linkClass} w-full bg-blue-600 text-white hover:bg-blue-500`}>{afcat ? "Explore AFCAT Mocks" : exam === "capf" ? "Start CAPF AC Practice" : nda ? "Start NDA Practice" : "Start CDS Practice"}</Link>
          {!afcat && <Link href={`/dashboard/question-bank?${params}`} onClick={() => {
            rememberUpscChoice();
            trackLearningEvent("home_tile_click", { tile: "decode_pyqs", exam });
          }} className={`${linkClass} w-full border border-blue-400/50 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20`}>Explore Previous Year Questions</Link>}
        </div>
        <div className="mx-auto mt-4 max-w-md rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-3">
          <p className="text-xs font-semibold leading-relaxed text-slate-200 sm:text-sm">Built by <span className="font-bold text-white">Rohit</span> · <span className="font-bold text-blue-300">CAPF AC AIR 163</span> · <span className="font-bold text-white">IIT Kanpur</span> · <span className="font-bold text-blue-300">CDS written cleared 4×</span></p>
        </div>
      </div>
    </section>
  );
}
