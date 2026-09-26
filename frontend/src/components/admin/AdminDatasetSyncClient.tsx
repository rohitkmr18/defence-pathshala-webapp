"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Database,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  FileCheck,
} from "lucide-react";

interface SyncStats {
  current_db_count: number;
  incoming_sheet_count: number;
  new_questions: number;
  updated_questions: number;
  sheet_id: string;
  worksheet_name: string;
}

interface SyncReport {
  success: boolean;
  inserted: number;
  updated: number;
  total: number;
  dry_run: boolean;
  duration_seconds: number;
  worksheet: string;
  timestamp: string;
}

interface ToastState {
  type: "success" | "error";
  title: string;
  message: string;
}

interface AdminDatasetSyncClientProps {
  userEmail: string;
}

export default function AdminDatasetSyncClient({
  userEmail,
}: AdminDatasetSyncClientProps) {
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [worksheetName, setWorksheetName] = useState("questions");
  const [dryRun, setDryRun] = useState(false);
  const [syncReport, setSyncReport] = useState<SyncReport | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Auto-dismiss toast after 6 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadStats = useCallback(
    async (showLoading = true) => {
      if (showLoading) setStatsLoading(true);
      try {
        const res = await fetch(
          `/api/admin/sync-stats?worksheet_name=${encodeURIComponent(
            worksheetName
          )}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch sync stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        setToast({
          type: "error",
          title: "Failed to Fetch Sheet Preview",
          message:
            err?.message ||
            "Unable to connect to Google Sheets or calculate sync diff.",
        });
      } finally {
        if (showLoading) setStatsLoading(false);
      }
    },
    [worksheetName]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function handleSyncDataset() {
    setSyncLoading(true);
    setToast(null);

    try {
      const url = `/api/admin/sync-dataset?worksheet_name=${encodeURIComponent(
        worksheetName
      )}&dry_run=${dryRun ? "true" : "false"}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Database synchronization failed on backend."
        );
      }

      const report: SyncReport = {
        success: data.success,
        inserted: data.inserted,
        updated: data.updated,
        total: data.total,
        dry_run: data.dry_run,
        duration_seconds: data.duration_seconds,
        worksheet: data.worksheet || worksheetName,
        timestamp: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setSyncReport(report);

      setToast({
        type: "success",
        title: data.dry_run
          ? "Dry Run Simulation Complete"
          : "Dataset Synchronized Successfully",
        message: data.dry_run
          ? `Plan verified: ${data.inserted} to insert, ${data.updated} to update (${data.total} total).`
          : `Live sync finished in ${data.duration_seconds}s: ${data.inserted} new inserted, ${data.updated} updated (${data.total} total).`,
      });

      // Refresh numbers
      await loadStats(false);
    } catch (err: any) {
      setToast({
        type: "error",
        title: "Synchronization Error",
        message:
          err?.message ||
          "An unexpected error occurred while syncing with Supabase.",
      });
    } finally {
      setSyncLoading(false);
    }
  }

  const sheetUrl = stats?.sheet_id
    ? `https://docs.google.com/spreadsheets/d/${stats.sheet_id}/edit`
    : "https://docs.google.com/spreadsheets/d/1bufEL9Fe-JtQLI8kSvdsI8T-4dSdiqaVBA-5pnoFuVY/edit";

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      {/* ── Toast Notification ────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-start gap-3 rounded-2xl p-4 shadow-xl border ${
              toast.type === "success"
                ? "bg-white border-emerald-200 text-slate-900 ring-4 ring-emerald-500/10"
                : "bg-white border-red-200 text-slate-900 ring-4 ring-red-500/10"
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-bold tracking-tight text-slate-900">
                {toast.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Header Section ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Control Center</span>
          </div>

          <h1 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Dataset Synchronization
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Bidirectional sync pipeline connecting Google Sheets to Supabase
            PostgreSQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-blue-600"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Open Google Sheet</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </a>

          <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin: {userEmail}</span>
          </div>
        </div>
      </div>

      {/* ── Main Stat Card (4 Requirements) ───────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Live Dataset Comparison
            </h2>
            <p className="text-xs text-slate-500">
              Comparing Supabase <code className="text-blue-600 font-semibold">questions</code> table against sheet tab <code className="text-slate-800 font-semibold">{worksheetName}</code>
            </p>
          </div>

          <button
            onClick={() => loadStats(true)}
            disabled={statsLoading || syncLoading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 shadow-2xs transition hover:bg-slate-50 disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${statsLoading ? "animate-spin text-blue-600" : ""}`}
            />
            <span>Refresh Preview</span>
          </button>
        </div>

        {/* 4 Required Metric Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Current Database Count */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 transition hover:shadow-md hover:border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Database Count
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600">
                <Database className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-900">
                  {stats?.current_db_count?.toLocaleString() ?? 0}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Verified rows in Supabase
              </p>
            </div>
          </div>

          {/* 2. Incoming Sheet Count */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 transition hover:shadow-md hover:border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Incoming Sheet Count
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600">
                <FileSpreadsheet className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-900">
                  {stats?.incoming_sheet_count?.toLocaleString() ?? 0}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                Rows in Google Sheet
              </p>
            </div>
          </div>

          {/* 3. New Questions */}
          <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5 transition hover:shadow-md hover:border-emerald-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                New Questions
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <PlusCircle className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="h-9 w-24 bg-emerald-200/60 animate-pulse rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-emerald-700">
                    +{stats?.new_questions?.toLocaleString() ?? 0}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    to insert
                  </span>
                </div>
              )}
              <p className="mt-1 text-xs text-emerald-600">
                IDs missing from database
              </p>
            </div>
          </div>

          {/* 4. Updated Questions */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-blue-50/30 p-5 transition hover:shadow-md hover:border-blue-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Updated Questions
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <RefreshCw className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              {statsLoading ? (
                <div className="h-9 w-24 bg-blue-200/60 animate-pulse rounded-lg" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-blue-700">
                    {stats?.updated_questions?.toLocaleString() ?? 0}
                  </p>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                    to refresh
                  </span>
                </div>
              )}
              <p className="mt-1 text-xs text-blue-600">
                Existing IDs with latest edits
              </p>
            </div>
          </div>
        </div>

        {/* ── Sync Control Bar ────────────────────────────────────────── */}
        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label
                htmlFor="worksheet-name"
                className="block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Worksheet Tab
              </label>
              <input
                id="worksheet-name"
                type="text"
                value={worksheetName}
                onChange={(e) => setWorksheetName(e.target.value)}
                placeholder="questions"
                className="mt-1.5 w-44 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <label className="flex items-center gap-2.5 mt-5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-700">
                Dry Run Only (Preview without DB write)
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSyncDataset}
              disabled={syncLoading || statsLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold shadow-md transition active:scale-[0.98] ${
                dryRun
                  ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20"
              } disabled:opacity-60 disabled:pointer-events-none`}
            >
              {syncLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {dryRun ? "Simulate Dry Run" : "Sync Latest Dataset"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Sync Loading Banner ────────────────────────────────────────── */}
      {syncLoading && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">
                Running Dataset Pipeline...
              </p>
              <p className="text-xs text-blue-700 mt-0.5">
                Fetching Google Sheet, validating schema & difficulty metrics, and
                upserting records to Supabase. This typically takes 5–8 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sync Report (Requirement) ─────────────────────────────────── */}
      {syncReport && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.04)] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  syncReport.dry_run
                    ? "bg-slate-100 text-slate-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {syncReport.dry_run
                    ? "Dry Run Simulation Report"
                    : "Execution Report — Sync Complete"}
                </h3>
                <p className="text-xs text-slate-500">
                  Worksheet: <span className="font-semibold">{syncReport.worksheet}</span> | Executed at {syncReport.timestamp}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Status: OK</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                New Inserted
              </span>
              <p className="mt-2 text-2xl font-black text-emerald-600">
                {syncReport.inserted}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Brand new PYQs</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Updated Rows
              </span>
              <p className="mt-2 text-2xl font-black text-blue-600">
                {syncReport.updated}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Existing questions</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Processed
              </span>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {syncReport.total}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Valid records</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                <span>Duration</span>
              </span>
              <p className="mt-2 text-2xl font-black text-slate-900">
                {syncReport.duration_seconds}s
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">Pipeline time</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50/60 border border-blue-100 p-4 flex items-center justify-between text-xs text-blue-800">
            <span className="font-semibold flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-600" />
              Target Conflict Key: <code className="bg-white/80 px-2 py-0.5 rounded border border-blue-200 font-bold">question_id</code>
            </span>
            <span className="text-slate-500">
              Supabase table: <strong className="text-slate-800">questions</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
