"use client";

import { motion } from "framer-motion";

type Props = {
  name: string;
  exams: string[];
  targetYear: number | null;
};

export default function WelcomeHero({
  name,
  exams,
  targetYear,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Defence Pathshala
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Welcome back, {name}
        </h1>

        <p className="text-gray-600">
          {exams.length ? exams.join(" • ") : "Choose your target exam"}
          {targetYear && ` • Target ${targetYear}`}
        </p>

        <button className="mt-4 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-gray-800">
          Continue Learning
        </button>
      </div>
    </motion.section>
  );
}