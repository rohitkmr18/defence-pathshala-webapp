"use client";

import { errorMessage } from "@/lib/error-message";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, X, Check, Loader2, Sparkles } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/profile";

export const TARGETS_UPDATED_EVENT = "defence_pathshala_targets_updated";

export function formatExamsLabel(exams?: string[] | string | null): string {
  if (!exams) return "";
  const arr = Array.isArray(exams) ? exams : [exams];
  if (arr.length === 0) return "";
  const cleaned = arr.map((e) => {
    const u = e.toUpperCase();
    if (u.includes("CAPF")) return "CAPF AC";
    if (u.includes("CDS")) return "CDS";
    if (u.includes("NDA")) return "NDA";
    if (u.includes("AFCAT")) return "AFCAT";
    return e.replace("-", " ");
  });
  if (cleaned.length === 1) return cleaned[0];
  if (cleaned.length === 2) return `${cleaned[0]} & ${cleaned[1]}`;
  return `${cleaned.slice(0, -1).join(", ")} & ${cleaned[cleaned.length - 1]}`;
}

export const TARGET_EXAMS_OPTIONS = [
  { id: "CDS", label: "CDS", full: "Combined Defence Services" },
  { id: "CAPF-AC", label: "CAPF AC", full: "Central Armed Police Forces" },
  { id: "NDA", label: "NDA", full: "National Defence Academy" },
  { id: "AFCAT", label: "AFCAT", full: "Air Force Common Admission Test" },
];

export const TARGET_YEARS_OPTIONS = [2026, 2027, 2028, 2029, 2030];

interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExams?: string[];
  initialYear?: number | null;
  onSuccess?: (updated: { target_exams: string[]; target_year: number | null }) => void;
}

export default function EditTargetModal(props: EditTargetModalProps) {
  if (!props.isOpen) return null;
  return <EditTargetForm key={`${props.initialExams?.join(",") ?? ""}:${props.initialYear ?? ""}`} {...props} />;
}

const EMPTY_TARGET_EXAMS: string[] = [];

function EditTargetForm({
  isOpen,
  onClose,
  initialExams = EMPTY_TARGET_EXAMS,
  initialYear = null,
  onSuccess,
}: EditTargetModalProps) {
  const router = useRouter();

  // Normalize initial exams (e.g. 'CAPF' -> 'CAPF-AC')
  const normalizeExam = (e: string) => {
    const upper = e.toUpperCase();
    if (upper.includes("CAPF")) return "CAPF-AC";
    if (upper.includes("CDS")) return "CDS";
    if (upper.includes("NDA")) return "NDA";
    if (upper.includes("AFCAT")) return "AFCAT";
    return e;
  };

  const [selectedExams, setSelectedExams] = useState<string[]>(() =>
    initialExams.map(normalizeExam).filter(Boolean)
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The form remounts when opened. Fetch missing preferences asynchronously.
  useEffect(() => {
    if (initialExams.length > 0) return;
    let cancelled = false;
    getProfile().then((profile) => {
      if (cancelled) return;
      if (profile?.target_exams?.length) {
        setSelectedExams(profile.target_exams.map(normalizeExam).filter(Boolean));
      }
      if (profile?.target_year) setSelectedYear(profile.target_year);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [initialExams]);

  if (!isOpen) return null;

  const toggleExam = (examId: string) => {
    setSelectedExams((prev) =>
      prev.includes(examId) ? prev.filter((id) => id !== examId) : [...prev, examId]
    );
  };

  const handleSave = async () => {
    if (selectedExams.length === 0) {
      setError("Please select at least one target exam.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateProfile({
        target_exams: selectedExams,
        target_year: selectedYear,
      });

      const detail = {
        target_exams: selectedExams,
        target_year: selectedYear,
      };

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(TARGETS_UPDATED_EVENT, { detail })
        );
      }

      onSuccess?.(detail);
      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(errorMessage(err, "Failed to update target preferences."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in zoom-in-95 duration-200 dark:border-slate-800 dark:bg-slate-900"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-2xs dark:bg-blue-950/60 dark:text-blue-400">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="modal-title"
              className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              Modify Target Preparation
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Update your target exams and year anytime. You can target multiple exams simultaneously.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-6">
          {/* Section 1: Exams (Multi-Select) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Target Exams <span className="text-blue-600 font-normal lowercase">(multi-select)</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedExams.length} selected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TARGET_EXAMS_OPTIONS.map((exam) => {
                const isSelected = selectedExams.includes(exam.id);
                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => toggleExam(exam.id)}
                    className={`flex flex-col items-start rounded-2xl p-3.5 text-left border transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 dark:bg-blue-950/50 dark:border-blue-500 dark:text-blue-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-extrabold text-sm sm:text-base">
                        {exam.label}
                      </span>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      {exam.full}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              💡 Tip: Aspirants targeting both CDS & CAPF AC can select both.
            </p>
          </div>

          {/* Section 2: Target Year (Single-Select) */}
          <div>
            <label className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Year
            </label>
            <div className="flex flex-wrap gap-2.5">
              {TARGET_YEARS_OPTIONS.map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setSelectedYear(isSelected ? null : yr)}
                    className={`rounded-xl px-4 py-2 text-sm font-bold border transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {yr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || selectedExams.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-500 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Save Targets</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
