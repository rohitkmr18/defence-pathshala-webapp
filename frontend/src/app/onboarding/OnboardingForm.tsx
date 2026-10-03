"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/profile/types";
import { authUrl, safeAuthNext } from "@/lib/auth-redirect";
import { createSetupSaver } from "@/lib/onboarding-save";

export default function OnboardingForm({ profile, next }: { profile: Profile; next: string }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [targetYear, setTargetYear] = useState(profile.target_year?.toString() ?? "");
  const [examChoice, setExamChoice] = useState(
    profile.target_exams.includes("CDS") && profile.target_exams.includes("CAPF-AC") ? "both" :
    profile.target_exams.find((exam) => exam === "CDS" || exam === "CAPF-AC") ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const save = useRef(createSetupSaver());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current || !examChoice) return;
    busy.current = true;
    setSaving(true);
    setError(null);
    try {
      await save.current({ full_name: fullName, target_year: targetYear,
        target_exams: examChoice === "both" ? ["CDS", "CAPF-AC"] : [examChoice] });
      // Fresh request avoids a prefetched incomplete-profile redirect.
      window.location.replace(safeAuthNext(next));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your setup was not saved. Please retry.");
      busy.current = false;
      setSaving(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#F8F8F7] p-6">
    <form onSubmit={submit} className="w-full max-w-xl space-y-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm sm:p-10">
      <p className="text-sm font-semibold">Defence Pathshala</p>
      <h1 className="text-3xl font-bold">Set up your preparation</h1>
      <fieldset disabled={saving} className="space-y-3">
        <legend className="mb-3 font-medium">Which exam are you preparing for? (required)</legend>
        {[["CDS", "CDS"], ["CAPF-AC", "CAPF AC"], ["both", "Both"]].map(([value, label]) =>
          <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4">
            <input type="radio" name="exam" value={value} required checked={examChoice === value}
              onChange={() => setExamChoice(value)} />{label}
          </label>)}
      </fieldset>
      <div>
        <label htmlFor="full-name" className="mb-2 block font-medium">Name (optional)</label>
        <input id="full-name" autoComplete="name" maxLength={200} value={fullName} disabled={saving}
          onChange={(event) => setFullName(event.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3" />
      </div>
      <div>
        <label htmlFor="target-year" className="mb-2 block font-medium">Target year (optional)</label>
        <select id="target-year" value={targetYear} disabled={saving} onChange={(event) => setTargetYear(event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3">
          <option value="">Not decided yet</option>
          {[2026, 2027, 2028, 2029, 2030, 2031, 2032].map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>
      {error && <div role="alert" className="space-y-2 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        <p>{error}</p>
        <p>Your inputs are kept. Retry using the button below.</p>
        <Link href={authUrl("/auth/login", next)} className="underline">Sign in again if your session expired</Link>
      </div>}
      <button type="submit" disabled={saving || !examChoice}
        className="w-full rounded-xl bg-black px-5 py-3 font-semibold text-white disabled:opacity-50">
        {saving ? "Saving…" : "Start my preparation"}
      </button>
    </form>
  </main>;
}
