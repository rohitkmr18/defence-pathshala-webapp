"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const EXAMS = ["CDS", "CAPF-AC", "NDA", "AFCAT", "UPSC-CSE"];
const YEARS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032"];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [targetYear, setTargetYear] = useState("");

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const progress = useMemo(() => (step / 3) * 100, [step]);

  async function finishSetup() {
    try {
      setLoading(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          target_year: targetYear,
          target_exams: selectedExams,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile.");
      }

      setCompleted(true);

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("Failed to save your onboarding.");
    } finally {
      setLoading(false);
    }
  }

  function nextStep() {
    if (step === 1 && fullName.trim() === "") return;
    if (step === 2 && selectedExams.length === 0) return;

    if (step === 3) {
      finishSetup();
      return;
    }

    setStep(step + 1);
  }

  function previousStep() {
    setStep(Math.max(step - 1, 1));
  }

  if (completed) {
    return (
      <main className="min-h-screen bg-[#F8F8F7] flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-3xl bg-white p-10 shadow-[0_24px_80px_rgba(0,0,0,0.08)] text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black text-white text-3xl">
            ✓
          </div>

          <h1 className="mt-8 text-3xl font-bold">
            You're all set.
          </h1>

          <p className="mt-4 text-gray-600 leading-7">
            Building your personalized PYQ Intelligence Dashboard...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F8F7] flex items-center justify-center px-4 py-8 sm:px-5 sm:py-10">
      <div className="w-full max-w-2xl rounded-2xl sm:rounded-[32px] border border-black/5 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.08)] p-6 sm:p-8 md:p-10">

        {/* Brand */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white font-bold text-lg">
            DP
          </div>

          <div>
            <h2 className="font-semibold text-lg">Defence Pathshala</h2>
            <p className="text-sm text-gray-500">
              Personalized Preparation Setup
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="mb-3 flex justify-between text-sm text-gray-500">
            <span>Step {step} of 3</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-black"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Animated Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >

            {/* STEP 1 */}
            {step === 1 && (
              <section className="space-y-8">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                    Let's personalize your preparation.
                  </h1>

                  <p className="mt-5 text-lg text-gray-600 leading-8">
                    We'll build a preparation system tailored to your target
                    exams, revision gaps, and PYQ performance.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["📊", "Subject-wise Analytics"],
                    ["🎯", "Avoidable Mistakes"],
                    ["🧠", "Adaptive Revision"],
                    ["⚡", "PYQ Intelligence"],
                  ].map(([icon, text]) => (
                    <motion.div
                      key={text}
                      whileHover={{ y: -3 }}
                      className="rounded-2xl border border-black/5 bg-[#FAFAFA] p-5"
                    >
                      <div className="text-2xl">{icon}</div>
                      <p className="mt-3 font-medium">{text}</p>
                    </motion.div>
                  ))}
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-lg outline-none transition focus:border-black"
                  />
                </div>
              </section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <section>
                <h1 className="text-4xl font-bold tracking-tight">
                  Which exams are you preparing for?
                </h1>

                <p className="mt-4 text-lg text-gray-600">
                  Select one or more exams.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  {EXAMS.map((exam) => {
                    const selected = selectedExams.includes(exam);

                    return (
                      <motion.button
                        key={exam}
                        type="button"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                          setSelectedExams((prev) =>
                            selected
                              ? prev.filter((e) => e !== exam)
                              : [...prev, exam]
                          )
                        }
                        className={`rounded-full px-6 py-3 text-sm font-medium border transition-all ${
                          selected
                            ? "bg-black text-white border-black shadow-lg"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                      >
                        {selected ? `✓ ${exam}` : exam}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-black/5 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Selected Exams</p>

                  <p className="mt-2 text-xl font-semibold">
                    {selectedExams.length
                      ? selectedExams.join(", ")
                      : "None selected"}
                  </p>
                </div>
              </section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <section>
                <h1 className="text-4xl font-bold tracking-tight">
                  Choose your target year
                </h1>

                <p className="mt-4 text-lg text-gray-600">
                  We'll personalize your roadmap based on your target cycle.
                </p>

                <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {YEARS.map((year) => {
                    const selected = targetYear === year;

                    return (
                      <motion.button
                        key={year}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setTargetYear(year)}
                        className={`rounded-2xl border px-5 py-5 transition-all ${
                          selected
                            ? "bg-black text-white border-black shadow-lg"
                            : "bg-white border-gray-300 hover:border-black"
                        }`}
                      >
                        {year}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl border border-black/5 bg-gray-50 p-5">
                  <p className="text-sm text-gray-500">Preparing For</p>

                  <p className="mt-2 text-2xl font-bold">
                    {targetYear || "Select a year"}
                  </p>
                </div>
              </section>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between">

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={previousStep}
            disabled={step === 1 || loading}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium transition hover:border-black disabled:opacity-40"
          >
            Back
          </motion.button>

          <motion.button
            whileHover={{
              scale:
                loading ||
                (step === 1 && !fullName.trim()) ||
                (step === 2 && selectedExams.length === 0) ||
                (step === 3 && !targetYear)
                  ? 1
                  : 1.02,
            }}
            whileTap={{
              scale:
                loading ||
                (step === 1 && !fullName.trim()) ||
                (step === 2 && selectedExams.length === 0) ||
                (step === 3 && !targetYear)
                  ? 1
                  : 0.98,
            }}
            onClick={nextStep}
            disabled={
              loading ||
              (step === 1 && !fullName.trim()) ||
              (step === 2 && selectedExams.length === 0) ||
              (step === 3 && !targetYear)
            }
            className="rounded-xl bg-black px-6 py-3 text-white font-medium transition hover:bg-neutral-800 disabled:opacity-40"
          >
            {loading
              ? "Saving..."
              : step === 3
              ? "Complete Setup"
              : "Continue"}
          </motion.button>

        </div>

      </div>
    </main>
  );
}