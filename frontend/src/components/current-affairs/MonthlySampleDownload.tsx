"use client";
import { trackLearningEvent } from "@/lib/learning-events";
import type { MonthlyContext } from "./MonthlyInteractions";
export default function MonthlySampleDownload({ context }: { context: MonthlyContext }) {
  return <a href="/monthly/2026-10-free-sample.pdf" download
    className="mt-3 inline-flex min-h-12 items-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
    onClick={() => trackLearningEvent("monthly_ca_sample_pdf_clicked", { ...context, artifact_id: "2026-10-free-sample-v1", content_hash: "7cb1c2c344a5406af1f352d11e65f25736afadfa788a20525159a3acc5ef4377", content_id: "bcadb490-b39a-4f11-befd-fa8e15bf480b" })}>
    Download the free sample PDF
  </a>;
}
