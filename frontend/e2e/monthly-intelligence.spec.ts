import { test, expect, type BrowserContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const samplePath = "/current-affairs/monthly/2026-10/sample";
const productPath = "/current-affairs/monthly/2026-10";
const fixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../scripts/test-support/monthly-public-fixture.json"), "utf8"));
const approved = JSON.parse(fixture.approved_editorial_source).stories[0];

async function signIn(context: BrowserContext) {
  const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: "22222222-2222-4222-a222-222222222222", exp: 4102444800, aud: "authenticated", role: "authenticated" })).toString("base64url")}.synthetic`;
  const session = { access_token: token, refresh_token: "synthetic", expires_at: 4102444800,
    expires_in: 3600, token_type: "bearer", user: { id: "22222222-2222-4222-a222-222222222222", user_metadata: {} } };
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`, domain: "127.0.0.1", path: "/" }]);
}

test.beforeEach(async ({ request, page }) => {
  await request.post("http://127.0.0.1:4547/__qa", { data: {} });
  // Acceptance must never send traffic to production analytics.
  await page.route(/https:\/\/(?:www\.)?(?:google-analytics|googletagmanager)\.com\//, route => route.abort());
});

test("discovery, catalogue, price and honest release availability", async ({ page }) => {
  await page.goto("/current-affairs");
  await page.getByRole("link", { name: /Explore Monthly Intelligence/ }).click();
  await expect(page).toHaveURL("/current-affairs/monthly");
  await page.getByRole("link", { name: "Explore October edition" }).click();
  await expect(page).toHaveURL(productPath);
  await expect(page.getByText("₹79", { exact: true })).toBeVisible();
  await expect(page.getByText("Coming soon · Not yet available")).toBeVisible();
  await page.getByRole("button", { name: "View release availability" }).click();
  await page.getByRole("button", { name: "View release availability" }).click();
  await expect(page.getByRole("status")).toContainText("No payment is collected");
  await expect(page.getByRole("link", { name: /Buy|Pay|Checkout/i })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download the free sample PDF" })).toBeVisible();
  const events = await page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer);
  expect(events.filter(e => e[1] === "monthly_ca_release_availability_viewed")).toHaveLength(1);
  expect(events.filter(e => e[1] === "monthly_ca_purchase_intent_clicked")).toHaveLength(0);
  expect(events.filter(e => e[1] === "monthly_ca_sample_pdf_clicked")).toHaveLength(0);
  const workspace = page.getByRole("region", { name: "Illustrative monthly workspace" });
  await expect(workspace).toContainText("Working free sample");
  await expect(workspace.getByRole("button")).toHaveCount(0);
  await expect(workspace.getByRole("link")).toHaveCount(1);
  await expect(workspace).toContainText(approved.headline);
  for (const feature of ["Subject-wise monthly chapters", "Consolidated MCQ practice", "Linked PYQ connections", "Revision & progress workspace", "Monthly eBook companion"]) {
    await expect(workspace).toContainText(feature);
  }
  await expect(page.getByRole("region", { name: "Daily and monthly comparison" })).toContainText("Individual daily stories and quizzes");
  await page.getByRole("link", { name: "Try the free lesson" }).click();
  await expect(page).toHaveURL(samplePath);
  await expect.poll(async () => page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer.filter(e => e[1] === "monthly_ca_sample_opened").length)).toBe(1);
});

test("real approved lesson fidelity, guest keyboard MCQ, explanation and analytics", async ({ page, request }, testInfo) => {
  await page.goto(samplePath);
  for (let step = 0; step < 8; step++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => {
      const active = document.activeElement as HTMLElement;
      const rect = active.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= window.innerWidth && !active.closest("[inert]");
    })).toBe(true);
  }
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(approved.headline);
  const lesson = page.getByRole("article", { name: "Approved BIMSTEC lesson" });
  await expect(lesson).toHaveAttribute("data-source-story", fixture.current_affairs_stories[0].id);
  const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
  const rendered = normalize(await lesson.innerText());
  for (const line of approved.editorialMarkdown.split("\n").filter((line: string) => line.trim())) {
    const expected = line.replace(/^#{1,6}\s+/, "").replace(/^\d+\.\s+/, "")
      .replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    expect(rendered).toContain(normalize(expected));
  }
  // Every approved paragraph is rendered using the same Markdown renderer without summary substitution.
  for (const heading of ["What Happened?", "Why It Matters", "Key Exam Facts", "Static–Current Linkage", "Exam Edge", "Future Question Angles"]) {
    await expect(lesson.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  await expect(lesson.getByText("Pakistan is", { exact: false })).toContainText("not");
  await expect(lesson.getByRole("link", { name: "Ministry of Home Affairs / PIB" })).toHaveAttribute("href", approved.sourceUrl);
  // No other story from the same preserved approved document is serialized into the sample.
  for (const story of JSON.parse(fixture.approved_editorial_source).stories.slice(1)) {
    expect(await page.content()).not.toContain(story.headline);
  }
  await expect(page.getByRole("button", { name: "Check Answer" })).toBeDisabled();
  const statements = page.getByRole("list", { name: "Question statements" });
  await expect(statements.getByRole("listitem")).toHaveCount(3);
  await expect(statements.getByRole("listitem").nth(0)).toHaveText("1. The meeting took place in New Delhi.");
  await expect(statements.getByRole("listitem").nth(1)).toContainText("entered into force in March 2021.");
  await expect(statements.getByRole("listitem").nth(2)).toContainText("already entered into force.");
  const option = page.getByRole("button", { name: "A 1 and 2 only", exact: true });
  await option.focus();
  await page.keyboard.press("Enter");
  await expect(option).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Check Answer" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Answer feedback" })).toBeFocused();
  await expect(page.getByText(approved.mcqs[0].explanation, { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Guest practice");
  const state = await (await request.get("http://127.0.0.1:4547/__qa")).json();
  expect(state.caAttempts).toHaveLength(0);
  const events = await page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer);
  for (const name of ["monthly_ca_sample_opened", "monthly_ca_sample_story_viewed", "monthly_ca_sample_mcq_started", "monthly_ca_sample_mcq_completed"]) {
    const matching = events.filter(e => e[1] === name);
    expect(matching).toHaveLength(1);
    expect(matching[0][2]).toMatchObject({ edition_id: "2026-10", auth_state: "guest", deployment_environment: "development", content_id: fixture.current_affairs_stories[0].id });
  }
  expect(events.filter(e => String(e[1]).startsWith("current_affairs_quiz"))).toHaveLength(0);
  await page.screenshot({ path: testInfo.outputPath("sample-answer-mobile.png"), fullPage: true });
  await page.getByRole("button", { name: "Finish & Lock Revision" }).click();
  await expect(page.getByText("Sample quiz complete")).toBeVisible();
});

test("authenticated sample attempt persists through existing service and handles save outage", async ({ page, context, request }) => {
  await signIn(context);
  await page.goto(samplePath);
  await page.getByRole("button", { name: "A 1 and 2 only", exact: true }).click();
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.getByRole("status")).toContainText("Your answer was saved");
  const state = await (await request.get("http://127.0.0.1:4547/__qa")).json();
  expect(state.caAttempts).toHaveLength(1);
  expect(state.caAttempts[0].mcq_id).toBe(fixture.current_affairs_stories[0].current_affairs_mcqs[0].id);
  expect(state.caAttempts[0].is_correct).toBe(true);
  await page.reload();
  await page.route("**/api/current-affairs/attempt", route => route.fulfill({ status: 503, contentType: "application/json", body: "{}" }));
  await page.getByRole("button", { name: "B 2 and 3 only", exact: true }).click();
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.getByRole("status")).toContainText("could not be saved");
  await expect(page.getByText(approved.mcqs[0].explanation, { exact: true })).toBeVisible();
});

test("both exact PYQs retain destination through login and onboarding and return to sample", async ({ page, context, request }) => {
  for (const id of ["CDS_I_2026_GK_099", "CAPF_2022_P1_125"]) {
    await context.clearCookies();
    await page.goto(samplePath);
    await expect(page.getByText("Login is required to attempt and save linked PYQs. Your selected question will be preserved.")).toBeVisible();
    const link = page.getByRole("link").filter({ hasText: id });
    const target = `/pyq/${id}?edition=2026-10-14&monthly=2026-10`;
    await expect(link).toHaveAttribute("href", target);
    await link.click();
    await expect(page).toHaveURL(/\/auth\/login\?/);
    expect(new URL(page.url()).searchParams.get("next")).toBe(target);
    await signIn(context);
    await request.post("http://127.0.0.1:4547/__qa", { data: { complete: false } });
    await page.goto("/auth/continue?next=" + encodeURIComponent(target));
    await expect(page).toHaveURL(/\/onboarding\?/);
    expect(new URL(page.url()).searchParams.get("next")).toBe(target);
    await request.post("http://127.0.0.1:4547/__qa", { data: {} });
    await page.goto("/auth/continue?next=" + encodeURIComponent(target));
    await expect(page).toHaveURL(target);
    await expect(page.getByText("Synthetic exact linked question: which option is two?")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Current Affairs" })).toHaveAttribute("href", samplePath);
    await page.getByRole("radio", { name: "B Two" }).click();
    await page.getByRole("button", { name: "Check Answer" }).click();
    await expect(page.getByText("Synthetic answer explanation: two is B.")).toBeVisible();
    const state = await (await request.get("http://127.0.0.1:4547/__qa")).json();
    expect(state.attempts[0].is_correct).toBe(true);
  }
});

test("invalid editions, unpublished source and missing approval never leak a lesson", async ({ page, request }) => {
  for (const route of ["/current-affairs/monthly/2026-13", "/current-affairs/monthly/2026-09/sample", "/current-affairs/monthly/bad"]) {
    // Next's parent shell streams through Suspense, so notFound can have HTTP 200.
    await page.goto(route);
    await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content="noindex"]').first()).toBeAttached();
    expect(await page.content()).not.toContain(approved.headline);
  }
  for (const data of [{ monthlyPublished: false }, { monthlyApproved: false }]) {
    await request.post("http://127.0.0.1:4547/__qa", { data });
    await page.goto(samplePath);
    await expect(page.getByRole("heading", { name: "Sample temporarily unavailable" })).toBeVisible();
    expect(await page.content()).not.toContain(approved.headline);
  }
  await request.post("http://127.0.0.1:4547/__qa", { data: { eligible: false } });
  await page.goto(samplePath);
  await expect(page.getByRole("link").filter({ hasText: "CDS_I_2026_GK_099" })).toHaveCount(0);
  await expect(page.getByText("Some linked questions are currently unavailable")).toBeVisible();
});

test("mobile and desktop layouts, reading progress and navigation", async ({ page }, testInfo) => {
  const width = page.viewportSize()!.width;
  for (const route of ["/current-affairs/monthly", productPath, samplePath]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (route === productPath) {
      await expect(page.getByRole("link", { name: "Try the free lesson", exact: true })).toBeInViewport();
      await expect(page.locator("header").filter({ hasText: "Connected exam preparation" })).toContainText("consolidated revision");
    }
    await page.screenshot({ path: testInfo.outputPath(`monthly-${route.split("/").pop()}-${width}.png`), fullPage: true });
    await page.screenshot({ path: testInfo.outputPath(`first-viewport-${route.split("/").pop()}-${width}.png`) });
  }
  await page.getByRole("link", { name: "Try the MCQ", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Sample practice MCQ" })).toBeInViewport();
  await expect(page.getByRole("progressbar", { name: "Lesson reading progress" })).toBeInViewport();
  expect(await page.getByRole("progressbar", { name: "Lesson reading progress" }).getAttribute("value")).not.toBe("0");
});

test("sample PDF download is safe, genuine and instrumented without purchase intent", async ({ page, request }) => {
  await page.goto(productPath);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: "Download the free sample PDF" }).click(),
  ]);
  expect(download.suggestedFilename()).toBe("2026-10-free-sample.pdf");
  const response = await request.get("/monthly/2026-10-free-sample.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const events = await page.evaluate(() => (window as unknown as { dataLayer: unknown[][] }).dataLayer);
  expect(events.filter(e => e[1] === "monthly_ca_sample_pdf_clicked")).toHaveLength(1);
  expect(events.filter(e => e[1] === "monthly_ca_purchase_intent_clicked")).toHaveLength(0);
  await page.goto(samplePath);
  await expect(page.getByRole("article", { name: "Approved BIMSTEC lesson" })).toHaveAttribute("data-content-hash", "7cb1c2c344a5406af1f352d11e65f25736afadfa788a20525159a3acc5ef4377");
  for (const route of ["/monthly/2026-10-full.pdf", "/monthly/2026-10-snapshot.json"]) expect((await request.get(route)).status()).toBe(404);
});
