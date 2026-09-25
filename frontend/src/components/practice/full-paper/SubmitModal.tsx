"use client";

import { AlertCircle, Clock, CheckCircle2, Bookmark, XCircle } from "lucide-react";
import { formatTime } from "./ExamHeader";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
  answered: number;
  unanswered: number;
  marked: number;
  timeRemaining: number;
}

export default function SubmitModal({
  isOpen,
  onClose,
  onConfirm,
  total,
  answered,
  unanswered,
  marked,
  timeRemaining,
}: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h2 id="submit-modal-title" className="text-xl font-bold text-slate-900">
              Submit Examination?
            </h2>
            <p className="text-xs text-slate-500">
              Review your attempt summary before finishing.
            </p>
          </div>
        </div>

        {/* Time Remaining pill */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs">
          <span className="font-medium text-slate-500">Time Remaining:</span>
          <span className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* Breakdown Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-700">Answered</p>
              <p className="text-lg font-bold text-emerald-950">{answered}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-amber-100 bg-amber-50/50 p-3">
            <XCircle className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-xs text-amber-700">Unanswered</p>
              <p className="text-lg font-bold text-amber-950">{unanswered}</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/50 p-3">
            <div className="flex items-center gap-2.5">
              <Bookmark className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-xs text-purple-700">Marked for Review</p>
                <p className="text-sm font-semibold text-purple-950">
                  {marked} question{marked !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <span className="text-xs text-purple-600">
              {answered > 0 ? "Included in submission" : ""}
            </span>
          </div>
        </div>

        {/* Warning if unanswered */}
        {unanswered > 0 && (
          <p className="mt-4 text-center text-xs text-slate-500">
            You have <strong className="text-amber-700">{unanswered} unattempted</strong>{" "}
            questions out of {total}.
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Resume Paper
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800"
          >
            Confirm & Finish
          </button>
        </div>
      </div>
    </div>
  );
}
