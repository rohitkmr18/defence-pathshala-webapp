import { Suspense } from "react";
import type { Metadata } from "next";
import CapfP2Evaluator from "@/components/capf-p2/CapfP2Evaluator";

export const metadata: Metadata = {
  title: "CAPF Paper II Answer Evaluator – Defence Pathshala",
  robots: { index: false, follow: false },
};

export default function CapfPaper2EvaluatorPage() {
  return (
    <Suspense fallback={null}>
      <CapfP2Evaluator />
    </Suspense>
  );
}
