"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, CheckCircle2, Compass, GraduationCap, Shield, Sparkles, Target } from "lucide-react";
import type { Profile } from "@/lib/profile/types";
import { authUrl, safeAuthNext } from "@/lib/auth-redirect";
import { createSetupSaver } from "@/lib/onboarding-save";

const EXAMS = [
  { id: "CDS", name: "CDS", description: "Combined Defence Services", icon: GraduationCap },
  { id: "CAPF-AC", name: "CAPF AC", description: "Assistant Commandant", icon: Shield },
  { id: "AFCAT", name: "AFCAT", description: "Air Force Common Admission Test", icon: Compass },
] as const;

export default function OnboardingForm({ profile, next }: { profile: Profile; next: string }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [targetYear, setTargetYear] = useState(profile.target_year?.toString() ?? "");
  const [selectedExams, setSelectedExams] = useState<string[]>(
    EXAMS.map(({ id }) => id).filter((id) => profile.target_exams.includes(id)),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const save = useRef(createSetupSaver());

  function toggleExam(exam: string) {
    setSelectedExams((current) =>
      current.includes(exam) ? current.filter((item) => item !== exam) : [...current, exam],
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || selectedExams.length === 0) return;
    busy.current = true;
    setSaving(true);
    setError(null);
    try {
      await save.current({
        full_name: fullName,
        target_year: targetYear,
        target_exams: selectedExams,
      });
      // Request fresh server state instead of following a prefetched redirect.
      window.location.replace(safeAuthNext(next));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your setup was not saved. Please retry.");
      busy.current = false;
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[0.85fr_1.15fr] lg:py-8">
        <aside className="relative hidden overflow-hidden rounded-l-[28px] bg-[#07162e] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">DP</span>
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Defence Pathshala</p>
              <p className="text-xs text-slate-400">Your preparation, intelligently guided.</p></div>
          </div>
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <Sparkles className="h-4 w-4" /> Personalised preparation
            </div>
            <h2 className="max-w-sm text-5xl font-black leading-[1.1] tracking-tight">
              One goal.<br /><span className="text-blue-400">A smarter route.</span>
            </h2>
            <p className="max-w-sm text-base leading-7 text-slate-300">
              Tell us where you're headed. We'll tailor your question practice, exam intelligence and progress tracking around your goals.
            </p>
            <div className="space-y-4 border-t border-white/10 pt-6 text-sm text-slate-200">
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" /> Targeted PYQ practice</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" /> Performance intelligence</p>
              <p className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-blue-400" /> Personalised next steps</p>
            </div>
          </div>
          <p className="relative text-xs text-slate-500">Defence Pathshala · Built for serious aspirants</p>
        </aside>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8 lg:rounded-r-[28px] lg:border lg:border-l-0 lg:border-slate-200 lg:bg-white lg:px-12 lg:py-12 lg:shadow-xl lg:shadow-slate-200/50">
          <form onSubmit={submit} className="w-full max-w-xl space-y-7">
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="flex items-center gap-2.5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">DP</span>
                <span className="text-sm font-bold tracking-tight">Defence Pathshala</span></div>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">Quick setup</span>
            </div>
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Target className="h-3.5 w-3.5" /> Your preparation profile
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Make your preparation yours.</h1>
              <p className="text-sm leading-6 text-slate-500 sm:text-base">Choose your target exams to get a more relevant learning experience. You can update your goals later.</p>
            </div>

            <fieldset disabled={saving} className="space-y-3">
              <legend className="mb-3 text-sm font-bold text-slate-800">
                Which exams are you preparing for? <span className="font-normal text-slate-500">Select one or more</span>
              </legend>
              <div className="grid gap-3">
                {EXAMS.map(({ id, name, description, icon: Icon }) => {
                  const active = selectedExams.includes(id);
                  return <label key={id} className={`group flex min-h-[78px] cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-colors focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${active ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                    <input type="checkbox" name="target_exams" value={id} checked={active}
                      onChange={() => toggleExam(id)} className="sr-only" />
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1"><span className="block text-base font-bold">{name}</span>
                      <span className="block text-xs text-slate-500 sm:text-sm">{description}</span></span>
                    <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white"}`}>
                      {active && <Check className="h-4 w-4" />}
                    </span>
                  </label>;
                })}
              </div>
              {selectedExams.length === 0 && <p className="text-xs text-slate-500">Select at least one exam to continue.</p>}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="full-name" className="block text-sm font-bold text-slate-800">Your name <span className="font-normal text-slate-400">(optional)</span></label>
                <input id="full-name" autoComplete="name" maxLength={200} value={fullName} disabled={saving}
                  onChange={(event) => setFullName(event.target.value)} placeholder="How should we call you?"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="space-y-2">
                <label htmlFor="target-year" className="block text-sm font-bold text-slate-800">Target year <span className="font-normal text-slate-400">(optional)</span></label>
                <select id="target-year" value={targetYear} disabled={saving} onChange={(event) => setTargetYear(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <option value="">Not decided yet</option>
                  {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>

            {error && <div role="alert" className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p>{error}</p><p>Your inputs are preserved. Please retry.</p>
              <Link href={authUrl("/auth/login", next)} className="font-semibold underline">Sign in again if your session expired</Link>
            </div>}

            <div className="space-y-3">
              <button type="submit" disabled={saving || selectedExams.length === 0}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? "Saving your preferences…" : "Let's get started"}
                {!saving && <ArrowRight className="h-5 w-5" />}
              </button>
              <p className="text-center text-xs text-slate-500">Free to begin · Your preferences can be changed later</p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
