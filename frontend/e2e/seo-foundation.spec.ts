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
      if (exam === "cds") {
        await expect(page.getByRole("heading", { name: "Choose your CDS paper" })).toBeVisible();
        await expect(page.getByText("Currently eligible questions")).toHaveCount(0);
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
