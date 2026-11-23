import { test, expect } from "@playwright/test";
for (const width of [320, 390, 1440]) {
  for (const exam of ["cds", "capf"]) {
    test(`${exam} archive at ${width}px: SSR, navigation, canonical and practice entry`, async ({ page, request }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route(/google-analytics|googletagmanager|posthog/, route => route.abort());
      const response = await request.get(`/pyqs/${exam}`);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(html).toContain("Previous Year Questions");
      expect(html).toContain("12");
      await page.goto(`/pyqs/${exam}`);
      await expect(page.locator("h1")).toContainText(exam === "cds" ? "CDS PYQs" : "CAPF AC PYQs");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.defencepathshala.in/pyqs/${exam}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const hamburger = page.getByRole("button", { name: "Open menu" });
      await expect(hamburger).toBeVisible();
      await hamburger.click();
      await expect(page.getByRole("navigation", { name: "Site menu" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Site menu" }).getByRole("link", { name: "CDS PYQs" })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Site menu" }).getByRole("link", { name: "CAPF PYQs" })).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("navigation", { name: "Site menu" })).toHaveCount(0);
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const breadcrumb = schemas.map(s => JSON.parse(s)).find(s => s["@type"] === "BreadcrumbList");
      expect(breadcrumb.itemListElement[1].item).toBe(`https://www.defencepathshala.in/pyqs/${exam}`);
      await expect(page.getByRole("heading", {
        name: exam === "cds"
          ? "How to practise CDS PYQ questions topic-wise"
          : "How to practise CAPF AC Paper I PYQs",
      })).toBeVisible();
      if (exam === "cds") {
        await expect(page.getByRole("heading", { name: "Choose your CDS paper" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Practice English" })).toHaveAttribute("href", /paper=english/);
        await expect(page.getByRole("link", { name: "Practice English" })).toHaveAttribute("href", /origin=seo_cds_english/);
        await expect(page.getByText("No eligible questions yet")).toBeVisible();
        await expect(page.getByRole("link", { name: "Choose CDS paper" })).toHaveAttribute("href", "#choose-cds-paper");
      }
      const cta = exam === "cds"
        ? page.getByRole("link", { name: "Start General Knowledge (GK) practice" })
        : page.getByRole("link", { name: "Start CAPF AC PYQ practice", exact: true });
      await expect(cta).toHaveAttribute("href", new RegExp(`origin=seo_${exam}_archive`));
      await page.screenshot({ path: testInfo.outputPath(`${exam}-${width}.png`), fullPage: true });
      await cta.click();
      await expect(page).toHaveURL(url => url.pathname === "/dashboard/practice"
        && url.searchParams.get("exam") === (exam === "cds" ? "CDS" : "CAPF-AC")
        && url.searchParams.get("origin") === `seo_${exam}_archive`);
      await expect(page.getByRole("heading", { name: "Choose Your Practice Workflow" })).toBeVisible();
    });
  }
}
test("invalid routes, sitemap membership and admin protection", async ({ request }) => {
  for (const path of ["/pyqs/unsupported", "/pyqs/cds/9999", "/pyqs/cds/not-a-subject"]) {
    expect((await request.get(path)).status()).toBe(404);
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("https://www.defencepathshala.in/pyqs/cds</loc>");
  expect(xml).toContain("https://www.defencepathshala.in/pyqs/capf</loc>");
  expect(xml).not.toContain("/dashboard/");
  expect((await request.get("/api/admin/seo/search-console?action=performance")).status()).toBe(401);
});


test("singular PYQ aliases 301 redirect to canonical plural routes", async ({ request }) => {
  const aliases = [
    ["/pyq/cds", "/pyqs/cds"],
    ["/pyq/capf", "/pyqs/capf"],
    ["/pyq/cds/2024", "/pyqs/cds/2024"],
    ["/pyq/capf/2025", "/pyqs/capf/2025"],
    ["/pyq/cds/2024/history", "/pyqs/cds/2024/history"],
    ["/pyq/cds?origin=seo", "/pyqs/cds?origin=seo"],
  ] as const;

  for (const [alias, canonical] of aliases) {
    const result = await request.get(alias, { maxRedirects: 0 });
    expect(result.status(), alias).toBe(301);
    const location = result.headers()["location"];
    expect(new URL(location, "http://127.0.0.1:4558").pathname
      + new URL(location, "http://127.0.0.1:4558").search, alias).toBe(canonical);
  }

  // /pyq/[questionId] is an existing exact-question player route, not an SEO alias.
  // A broad /pyq/:path* redirect would break login, question recovery and answer flows.
  for (const exactQuestionPath of ["/pyq/MISSING", "/pyq/CDS_II_2026_GK_011"]) {
    const response = await request.get(exactQuestionPath, { maxRedirects: 0 });
    expect(response.status(), exactQuestionPath).not.toBe(301);
    expect(response.headers()["location"] ?? "", exactQuestionPath).not.toContain("/pyqs/");
  }

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.status()).toBe(200);
  const sitemap = await sitemapResponse.text();
  expect(sitemap).not.toMatch(/<loc>https:\/\/www\.defencepathshala\.in\/pyq\//);
  expect(sitemap).toContain("<loc>https://www.defencepathshala.in/pyqs/cds</loc>");
  expect(sitemap).toContain("<loc>https://www.defencepathshala.in/pyqs/capf</loc>");
});

test("public identity and internal crawl controls", async ({ request }) => {
  for (const path of ["/", "/afcat", "/library", "/library/economy-decoded", "/about", "/exams/cds", "/pyqs/cds/history"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain(`rel="canonical" href="https://www.defencepathshala.in${path === "/" ? "" : path}"`);
    if (path !== "/") expect(html, path).not.toContain('rel="canonical" href="https://www.defencepathshala.in"');
    expect(html, path).toContain('name="twitter:title"');
    expect(html.replace(/<script[\s\S]*?<\/script>/g, ""), path).toMatch(/<h1[ >]/);
  }
  for (const path of ["/afcat/lab", "/afcat/visual-preview"]) {
    const html = await (await request.get(path)).text();
    expect(html, path).toContain('name="robots" content="noindex, nofollow"');
    expect(html, path).not.toContain('rel="canonical" href="https://www.defencepathshala.in"');
  }
  const html = await (await request.get("/library/economy-decoded")).text();
  expect(html).toContain('"@type":"Book"');
  expect(html).toContain('https://www.defencepathshala.in/#organization');
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /dashboard$");
  expect(robots).toContain("Sitemap: https://www.defencepathshala.in/sitemap.xml");
});

for (const width of [320, 390, 1440]) {
  test(`public library and AFCAT journey at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/google-analytics|googletagmanager|posthog/, route => route.abort());
    for (const path of ["/library", "/library/economy-decoded", "/afcat"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.defencepathshala.in${path}`);
    }
    await page.getByRole("link", { name: "Explore AFCAT mocks", exact: true }).click();
    await expect(page).toHaveURL(/#available-mocks$/);
  });
}

test("Batch 2: chapter summaries are present in initial HTML for six free ebooks", async ({ request }) => {
  const books = [
    "physics-decoded",
    "chemistry-decoded",
    "economy-decoded",
    "polity-decoded",
    "biology-decoded",
    "vocab-decoded",
  ];
  for (const slug of books) {
    const path = `/library/${slug}`;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain('id="ebook-learning-outline"');
    expect(html, path).toContain('href="#page-');
    expect(html, path).toContain('href="#practice"');
    expect(html, path).toContain('rel="canonical" href="https://www.defencepathshala.in');
    expect(html, path).toContain('"@type":"Book"');
  }
});

test("Batch 2: current affairs guidance is server-rendered and retains canonical", async ({ request }) => {
  const response = await request.get("/current-affairs");
  expect(response.status()).toBe(200);
  const html = await response.text();
  expect(html).toContain('id="ca-study-method"');
  expect(html).toContain("How to revise daily current affairs for defence exams");
  expect(html).toContain('rel="canonical" href="https://www.defencepathshala.in/current-affairs"');
});

for (const width of [320, 390, 1440]) {
  test(`Batch 2: ebook chapter links target actual reader anchors at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/google-analytics|googletagmanager|posthog/, route => route.abort());
    await page.goto("/library/economy-decoded");
    await expect(page.getByRole("heading", { name: "What does Economy Decoded cover?" })).toBeVisible();
    const chapter = page.locator("section[aria-labelledby='ebook-learning-outline'] a[href^='#page-']").first();
    await expect(chapter).toBeVisible();
    const href = await chapter.getAttribute("href");
    expect(href).toMatch(/^#page-\d+$/);
    await expect(page.locator(href!)).toHaveCount(1);
    await chapter.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

for (const width of [320, 390, 1440]) {
  test(`Knowledge Hub listing and article at ${width}px: SSR, SEO, accessibility and navigation`, async ({ page, request }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/google-analytics|googletagmanager|posthog/, route => route.abort());
    const listing = await request.get("/learn");
    expect(listing.status()).toBe(200);
    const listingHtml = await listing.text();
    expect(listingHtml).toContain("Synthetic CDS PYQ Revision Guide");
    expect(listingHtml).toContain('href="/learn/qa-cds-pyq-guide"');
    await page.goto("/learn");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Understand the concept. Practise the exam.");
    await expect(page.getByRole("link", { name: "Synthetic CDS PYQ Revision Guide" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`knowledge-list-${width}.png`), fullPage: true });

    await page.getByRole("link", { name: "Synthetic CDS PYQ Revision Guide" }).click();
    await expect(page).toHaveURL(/\/learn\/qa-cds-pyq-guide$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Synthetic CDS PYQ Revision Guide");
    await expect(page.getByRole("heading", { name: "How to diagnose a CDS PYQ mistake" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Start relevant practice" })).toHaveAttribute("href", "/pyqs/cds");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.defencepathshala.in/learn/qa-cds-pyq-guide");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
    expect(jsonLd.some(s => s["@type"] === "Article" && s.headline === "Synthetic CDS PYQ Revision Guide")).toBe(true);
    expect(jsonLd.some(s => s["@type"] === "BreadcrumbList")).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`knowledge-article-${width}.png`), fullPage: true });

    const raw = await request.get("/learn/qa-cds-pyq-guide");
    expect(raw.status()).toBe(200);
    expect(await raw.text()).toContain("How to diagnose a CDS PYQ mistake");
  });
}

test("Knowledge Hub: published-only sitemap and invalid article routes", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toContain("<loc>https://www.defencepathshala.in/learn</loc>");
  expect(xml).toContain("<loc>https://www.defencepathshala.in/learn/qa-cds-pyq-guide</loc>");
  for (const url of ["/learn/this-does-not-exist", "/learn/%3Cscript%3E"]) {
    const response = await request.get(url);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("noindex");
  }
});

test("GSC server diagnostics reject anonymous requests without contacting Google", async ({ request }) => {
  for (const action of ["sites", "sitemaps", "inspect", "performance"]) {
    const response = await request.get(`/admin/seo/search-console?action=${action}`);
    expect(response.status(), action).toBe(404);
    const html = await response.text();
    expect(html).not.toContain("sc-domain:defencepathshala.in");
    expect(html).not.toContain("Google diagnostic failed");
  }
});

test("Batch 3A: CAPF and CDS archives accurately describe eligible question coverage", async ({ request }) => {
  for (const [path, expected] of [
    // Isolated upstream intentionally contains only 2026 History rows for each exam.
    ["/pyqs/capf/2026", "not necessarily the complete official paper or answer key"],
    ["/pyqs/cds/2026", "not necessarily the complete official paper or answer key"],
    ["/pyqs/capf/history", "not a claim about complete exam-paper weightage"],
    ["/pyqs/cds/history", "not a claim about complete exam-paper weightage"],
    ["/pyqs/capf/2026/history", "Share of Available PYQs"],
    ["/pyqs/cds/2026/history", "Share of Available PYQs"],
  ] as const) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html, path).toContain(expected);
    expect(html, path).not.toContain("full answer keys and performance tracking");
    expect(html, path).not.toContain("Complete solutions, explanations, and pattern intelligence");
    expect(html, path).toContain('rel="canonical" href="https://www.defencepathshala.in');
  }
});

test("Batch 3B: source-limited PYQ evidence matrix is SSR and correctly denominated", async ({ request }) => {
  for (const exam of ["cds", "capf"]) {
    const path = `/pyqs/${exam}`;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    expect(html).toContain('id="pyq-evidence"');
    expect(html).toContain("PYQ inventory by year and subject");
    expect(html.replace(/<!-- -->/g, "")).toContain("12 currently eligible questions");
    expect(html).toContain("Zero means no eligible question");
    expect(html).toContain(`href="/pyqs/${exam}/2026"`);
    expect(html).toContain(`href="/pyqs/${exam}/history"`);
    expect(html).toContain('rel="canonical" href="https://www.defencepathshala.in');
    expect(html).not.toContain("predicted topic weightage");
  }
});
