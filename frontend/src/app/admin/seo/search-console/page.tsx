import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_SEARCH_CONSOLE_SITE,
  inspectSearchConsoleUrl,
  isSearchConsoleConfigured,
  listSearchConsoleSites,
  listSearchConsoleSitemaps,
  querySearchConsolePerformance,
} from "@/lib/google-search-console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

const CDS_URL = "https://www.defencepathshala.in/pyqs/cds";
type Action = "sites" | "sitemaps" | "inspect" | "performance";
type DimensionChoice = "page" | "query,page";
type Params = { action?: string; period?: string; dimensions?: string; start_row?: string };

// This deliberately does NOT reuse checkIsAdmin(): its legacy user_metadata/email
// fallbacks are not appropriate for access to privileged SEO reporting.
async function assertTrustedAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  if (error || !user) notFound();

  if (user.app_metadata?.role === "admin") return;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError || profile?.role !== "admin") notFound();
}

function errorCategory(error: unknown): string {
  // Never display raw Google errors: they may contain details not meant for HTML.
  const message = error instanceof Error ? error.message : "";
  if (/not configured|private key|pkcs#8/i.test(message)) return "Server credentials are missing or invalid.";
  if (/invalid_grant|invalid_client|oauth|token exchange/i.test(message)) return "Google rejected the service-account authentication.";
  if (/403|permission|access denied|insufficient/i.test(message)) return "Google refused access. Verify property access and API enablement.";
  if (/404|not found/i.test(message)) return "Google could not find the requested resource.";
  if (/429|quota|rate limit/i.test(message)) return "Google API rate limit reached.";
  return "Google diagnostic failed. Check secure server logs and API configuration.";
}

function reportingDates(days: 28 | 90) {
  // Search Console final data can lag; consistently end three complete UTC days ago.
  const end = new Date(Date.now() - 3 * 86_400_000);
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  return { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };
}

export default async function SearchConsoleDiagnostics({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  await assertTrustedAdmin();
  const params = await searchParams;

  const action: Action | null = (
    ["sites", "sitemaps", "inspect", "performance"].includes(params.action || "")
      ? params.action as Action
      : null
  );
  const period: 28 | 90 = params.period === "90" ? 90 : 28;
  const dimensions: DimensionChoice = params.dimensions === "query,page" ? "query,page" : "page";
  const rawStart = params.start_row || "0";
  const startRow = /^\\d{1,6}$/.test(rawStart) ? Number(rawStart) : 0;
  const dates = reportingDates(period);
  let output: unknown = null;
  let error: string | null = null;

  if (action) {
    if (!isSearchConsoleConfigured()) {
      error = "Google Search Console service-account credentials are not configured in this environment.";
    } else {
      try {
        switch (action) {
          case "sites": {
            const sites = await listSearchConsoleSites();
            const property = sites.siteEntry?.find((s) => s.siteUrl === DEFAULT_SEARCH_CONSOLE_SITE);
            output = {
              property: DEFAULT_SEARCH_CONSOLE_SITE,
              found: Boolean(property),
              permissionLevel: property?.permissionLevel || null,
            };
            break;
          }
          case "sitemaps": {
            const result = await listSearchConsoleSitemaps();
            output = { property: DEFAULT_SEARCH_CONSOLE_SITE, sitemaps: result.sitemap || [] };
            break;
          }
          case "inspect": {
            const result = await inspectSearchConsoleUrl(CDS_URL);
            output = {
              property: DEFAULT_SEARCH_CONSOLE_SITE,
              url: CDS_URL,
              indexStatus: result.inspectionResult?.indexStatusResult || null,
            };
            break;
          }
          case "performance": {
            const result = await querySearchConsolePerformance({
              ...dates,
              dimensions: dimensions.split(",") as Array<"query" | "page">,
              startRow,
              rowLimit: 1000,
            });
            output = {
              property: DEFAULT_SEARCH_CONSOLE_SITE,
              reportingPeriod: dates,
              dimensions,
              startRow,
              rowCount: result.rows?.length ?? 0,
              rows: result.rows || [],
              note: "Query-level rows exclude anonymized searches and must not be summed as site totals. Google dates use Pacific Time. For another page of rows, increase start_row by 1000.",
            };
            break;
          }
        }
      } catch (e) {
        error = errorCategory(e);
      }
    }
  }

  const base = "/admin/seo/search-console";
  const url = (a: Action, p: 28 | 90 = 28, d: DimensionChoice = "page", offset = 0) =>
    `${base}?action=${a}&period=${p}&dimensions=${encodeURIComponent(d)}&start_row=${offset}`;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <p className="text-sm font-semibold text-blue-700">Defence Pathshala · Private administrator tool</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Search Console diagnostics</h1>
        <p className="mt-2 text-sm text-slate-600">
          Read-only Google diagnostics executed by the Vercel server. No API key, service-account
          credential, or token is sent to the browser.
        </p>
      </header>
      <nav aria-label="Search Console diagnostics" className="flex flex-wrap gap-3 text-sm font-semibold">
        <Link prefetch={false} className="rounded-lg border p-3" href={url("sites")}>1. Verify property</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("sitemaps")}>2. Check sitemaps</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("inspect")}>3. Inspect CDS</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("performance", 28, "page")}>4. Pages — 28 days</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("performance", 28, "query,page")}>5. Queries + pages — 28 days</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("performance", 90, "page")}>6. Pages — 90 days</Link>
        <Link prefetch={false} className="rounded-lg border p-3" href={url("performance", 90, "query,page")}>7. Queries + pages — 90 days</Link>
      </nav>
      {action && (
        <section className="rounded-xl border bg-white p-5" aria-label="Diagnostic result">
          <h2 className="text-lg font-bold">{action} result</h2>
          {error
            ? <p role="alert" className="mt-3 text-red-700">{error}</p>
            : <pre className="mt-4 max-h-[65vh] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-4 text-xs text-slate-800">{JSON.stringify(output, null, 2)}</pre>}
          {action === "performance" && !error && (
            <Link prefetch={false} className="mt-4 inline-block rounded-lg border p-3 text-sm font-semibold" href={url(action, period, dimensions, startRow + 1000)}>
              Next 1000 rows (if available)
            </Link>
          )}
        </section>
      )}
      <p className="text-xs text-slate-500">
        This page is never indexed, and does not change Search Console configuration, sitemaps or indexing requests.
        A verified administrator session is required for every request.
      </p>
    </main>
  );
}
