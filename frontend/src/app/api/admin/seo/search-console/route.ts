import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_MONITOR_URLS,
  DEFAULT_SEARCH_CONSOLE_SITE,
  getSearchConsoleOverview,
  inspectSearchConsoleUrl,
  isSearchConsoleConfigured,
  listSearchConsoleSites,
  listSearchConsoleSitemaps,
  querySearchConsolePerformance,
  submitSearchConsoleSitemap,
} from "@/lib/google-search-console";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function isAuthorized(request: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY || "";
  const cronSecret = process.env.CRON_SECRET || "";
  const headerKey = request.headers.get("x-admin-key") || "";
  const authorization = request.headers.get("authorization") || "";
  const bearer = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  return Boolean(
    (adminKey && headerKey && safeEqual(adminKey, headerKey)) ||
      (adminKey && bearer && safeEqual(adminKey, bearer)) ||
      (cronSecret && bearer && safeEqual(cronSecret, bearer)),
  );
}

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function integrationUnavailable(error: unknown) {
  const message = error instanceof Error ? error.message : "Search Console request failed";
  const status = /not configured/i.test(message) ? 503 : 502;
  return NextResponse.json({ error: message }, { status });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  const action = request.nextUrl.searchParams.get("action") || "overview";

  if (!isSearchConsoleConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        siteUrl: DEFAULT_SEARCH_CONSOLE_SITE,
        requiredEnvironmentVariables: [
          "GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL",
          "GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY",
        ],
      },
      { status: 503 },
    );
  }

  try {
    switch (action) {
      case "sites":
        return NextResponse.json(await listSearchConsoleSites());

      case "sitemaps":
        return NextResponse.json(await listSearchConsoleSitemaps());

      case "inspect": {
        const url = request.nextUrl.searchParams.get("url");
        if (!url) {
          return NextResponse.json(
            { error: "url query parameter is required" },
            { status: 400 },
          );
        }
        return NextResponse.json({
          siteUrl: DEFAULT_SEARCH_CONSOLE_SITE,
          url,
          result: await inspectSearchConsoleUrl(url),
        });
      }

      case "performance": {
        const pageContains =
          request.nextUrl.searchParams.get("page_contains") || "/pyqs/";
        return NextResponse.json({
          siteUrl: DEFAULT_SEARCH_CONSOLE_SITE,
          pageContains,
          result: await querySearchConsolePerformance({
            dimensions: ["page"],
            pageContains,
            rowLimit: 1000,
          }),
        });
      }

      case "overview": {
        const requestedUrls = request.nextUrl.searchParams.getAll("url");
        const urls = requestedUrls.length > 0 ? requestedUrls : DEFAULT_MONITOR_URLS;
        return NextResponse.json(await getSearchConsoleOverview(urls));
      }

      default:
        return NextResponse.json(
          {
            error: "Unsupported action",
            supportedActions: [
              "overview",
              "sites",
              "sitemaps",
              "inspect",
              "performance",
            ],
          },
          { status: 400 },
        );
    }
  } catch (error) {
    return integrationUnavailable(error);
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorized();

  if (!isSearchConsoleConfigured()) {
    return NextResponse.json(
      { error: "Google Search Console integration is not configured" },
      { status: 503 },
    );
  }

  const action = request.nextUrl.searchParams.get("action");

  if (action !== "submit-sitemap") {
    return NextResponse.json(
      { error: "Only action=submit-sitemap is supported for POST" },
      { status: 400 },
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      sitemapUrl?: string;
    };
    const sitemapUrl =
      body.sitemapUrl || "https://www.defencepathshala.in/sitemap.xml";

    await submitSearchConsoleSitemap(sitemapUrl);

    return NextResponse.json({
      submitted: true,
      siteUrl: DEFAULT_SEARCH_CONSOLE_SITE,
      sitemapUrl,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    return integrationUnavailable(error);
  }
}
