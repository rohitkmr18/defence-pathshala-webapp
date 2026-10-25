import { importPKCS8, SignJWT } from "jose";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const WEBMASTERS_BASE = "https://www.googleapis.com";
const URL_INSPECTION_BASE = "https://searchconsole.googleapis.com";
const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters";

export const DEFAULT_SEARCH_CONSOLE_SITE =
  process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || "sc-domain:defencepathshala.in";

export const DEFAULT_MONITOR_URLS = [
  "https://www.defencepathshala.in/pyqs/cds",
  "https://www.defencepathshala.in/pyqs/capf",
  "https://www.defencepathshala.in/pyqs/cds/history",
  "https://www.defencepathshala.in/pyqs/cds/history/modern-history",
] as const;

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export type SearchAnalyticsRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export type UrlInspectionResult = {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      robotsTxtState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      crawledAs?: string;
      referringUrls?: string[];
      googleCanonical?: string;
      userCanonical?: string;
    };
  };
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function normalizeEnvString(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string") return parsed;
    } catch {
      // Fall through to conservative quote stripping below.
    }
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function normalizePrivateKey(value: string): string {
  return normalizeEnvString(value)
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();
}

async function getGoogleAccessToken(): Promise<string> {
  const clientEmail = normalizeEnvString(
    requiredEnv("GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL"),
  );
  const privateKey = normalizePrivateKey(
    requiredEnv("GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY"),
  );

  const signingKey = await importPKCS8(privateKey, "RS256");
  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({
    scope: SEARCH_CONSOLE_SCOPE,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setAudience(GOOGLE_TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(signingKey);

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as GoogleTokenResponse;
  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        `Google OAuth token exchange failed with ${response.status}`,
    );
  }

  return payload.access_token;
}

async function googleFetch<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const accessToken = await getGoogleAccessToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${accessToken}`,
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const bodyText = await response.text();
  let payload: unknown = null;

  if (bodyText) {
    try {
      payload = JSON.parse(bodyText);
    } catch {
      payload = bodyText;
    }
  }

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null
        ? JSON.stringify(payload)
        : String(payload || "");
    throw new Error(
      `Search Console API request failed (${response.status}): ${detail}`,
    );
  }

  return payload as T;
}

export function isSearchConsoleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL &&
      process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY,
  );
}

export async function listSearchConsoleSites() {
  return googleFetch<{
    siteEntry?: Array<{
      siteUrl?: string;
      permissionLevel?: string;
    }>;
  }>(`${WEBMASTERS_BASE}/webmasters/v3/sites`);
}

export async function listSearchConsoleSitemaps(
  siteUrl = DEFAULT_SEARCH_CONSOLE_SITE,
) {
  const encodedSite = encodeURIComponent(siteUrl);
  return googleFetch<{
    sitemap?: Array<{
      path?: string;
      lastSubmitted?: string;
      isPending?: boolean;
      isSitemapsIndex?: boolean;
      type?: string;
      lastDownloaded?: string;
      warnings?: string;
      errors?: string;
      contents?: Array<{
        type?: string;
        submitted?: string;
        indexed?: string;
      }>;
    }>;
  }>(`${WEBMASTERS_BASE}/webmasters/v3/sites/${encodedSite}/sitemaps`);
}

export async function submitSearchConsoleSitemap(
  sitemapUrl: string,
  siteUrl = DEFAULT_SEARCH_CONSOLE_SITE,
) {
  const encodedSite = encodeURIComponent(siteUrl);
  const encodedSitemap = encodeURIComponent(sitemapUrl);
  return googleFetch<unknown>(
    `${WEBMASTERS_BASE}/webmasters/v3/sites/${encodedSite}/sitemaps/${encodedSitemap}`,
    { method: "PUT" },
  );
}

export async function inspectSearchConsoleUrl(
  inspectionUrl: string,
  siteUrl = DEFAULT_SEARCH_CONSOLE_SITE,
) {
  return googleFetch<UrlInspectionResult>(
    `${URL_INSPECTION_BASE}/v1/urlInspection/index:inspect`,
    {
      method: "POST",
      body: JSON.stringify({
        inspectionUrl,
        siteUrl,
        languageCode: "en-US",
      }),
    },
  );
}

export async function querySearchConsolePerformance(args?: {
  siteUrl?: string;
  startDate?: string;
  endDate?: string;
  dimensions?: Array<"query" | "page" | "country" | "device" | "date">;
  pageContains?: string;
  rowLimit?: number;
}) {
  const siteUrl = args?.siteUrl || DEFAULT_SEARCH_CONSOLE_SITE;
  const encodedSite = encodeURIComponent(siteUrl);

  const today = new Date();
  const end = args?.endDate
    ? new Date(`${args.endDate}T00:00:00Z`)
    : new Date(today.getTime() - 3 * 86_400_000);
  const start = args?.startDate
    ? new Date(`${args.startDate}T00:00:00Z`)
    : new Date(end.getTime() - 27 * 86_400_000);

  const asDate = (date: Date) => date.toISOString().slice(0, 10);

  const body: Record<string, unknown> = {
    startDate: asDate(start),
    endDate: asDate(end),
    dimensions: args?.dimensions || ["page"],
    rowLimit: Math.min(Math.max(args?.rowLimit || 500, 1), 25_000),
    dataState: "final",
  };

  if (args?.pageContains) {
    body.dimensionFilterGroups = [
      {
        groupType: "and",
        filters: [
          {
            dimension: "page",
            operator: "contains",
            expression: args.pageContains,
          },
        ],
      },
    ];
  }

  return googleFetch<{
    rows?: SearchAnalyticsRow[];
    responseAggregationType?: string;
  }>(
    `${WEBMASTERS_BASE}/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );
}

export async function getSearchConsoleOverview(
  urls: readonly string[] = DEFAULT_MONITOR_URLS,
) {
  const [sites, sitemaps, performance, inspections] = await Promise.all([
    listSearchConsoleSites(),
    listSearchConsoleSitemaps(),
    querySearchConsolePerformance({
      dimensions: ["page"],
      pageContains: "/pyqs/",
      rowLimit: 500,
    }),
    Promise.all(
      urls.map(async (url) => ({
        url,
        result: await inspectSearchConsoleUrl(url),
      })),
    ),
  ]);

  return {
    siteUrl: DEFAULT_SEARCH_CONSOLE_SITE,
    generatedAt: new Date().toISOString(),
    sites,
    sitemaps,
    performance,
    inspections,
  };
}
