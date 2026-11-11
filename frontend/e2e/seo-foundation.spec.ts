import { test, expect } from "@playwright/test";
for (const width of [320, 390, 1440]) {
  for (const exam of ["cds", "capf"]) {
    test(`${exam} archive at ${width}px: SSR, navigation, canonical and practice entry`, async ({ page, request }) => {
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
      if (width < 1280) {
        await page.getByText("Explore exams and PYQs", { exact: true }).click();
        await expect(page.locator('details a[href="/pyqs/cds"]')).toBeVisible();
        await expect(page.locator('details a[href="/pyqs/capf"]')).toBeVisible();
      }
      const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
      const breadcrumb = schemas.map(s => JSON.parse(s)).find(s => s["@type"] === "BreadcrumbList");
      expect(breadcrumb.itemListElement[1].item).toBe(`https://www.defencepathshala.in/pyqs/${exam}`);
      const cta = page.getByRole("link", { name: `Start ${exam === "cds" ? "CDS" : "CAPF AC"} PYQ practice`, exact: true });
      await expect(cta).toHaveAttribute("href", new RegExp(`origin=seo_${exam}_archive`));
      await page.screenshot({ path: `../test-results/seo/${exam}-${width}.png`, fullPage: true });
      await cta.click();
      await expect(page).toHaveURL(new RegExp(`/dashboard/practice\\?exam=${exam === "cds" ? "CDS" : "CAPF-AC"}`));
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
