import { test, expect, type BrowserContext } from "@playwright/test";

const target = "/pyq/CDS_II_2026_GK_011?edition=2030-01-01";
async function signIn(context: BrowserContext) {
  const token = `${Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")}.${Buffer.from(JSON.stringify({ sub: "22222222-2222-4222-a222-222222222222", exp: 4102444800, aud: "authenticated", role: "authenticated" })).toString("base64url")}.synthetic`;
  const session = { access_token: token, refresh_token: "synthetic", expires_at: 4102444800,
    expires_in: 3600, token_type: "bearer", user: { id: "22222222-2222-4222-a222-222222222222", user_metadata: {} } };
  await context.addCookies([{ name: "sb-127-auth-token", value: `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`,
    domain: "127.0.0.1", path: "/" }]);
}
test.beforeEach(async ({ request }) => { await request.post("http://127.0.0.1:4547/__qa", { data: {} }); });

test("complete mobile editorial, safe citations/table, exact link and unchanged daily quiz", async ({ page }, testInfo) => {
  const dialogs: string[] = []; page.on("dialog", dialog => { dialogs.push(dialog.message()); void dialog.dismiss(); });
  await page.goto("/current-affairs/2030-01-01");
  const first = page.locator("details").first();
  await expect(first.getByRole("heading", { name: "Approved section" })).toBeVisible();
  await expect(first.getByText("Second paragraph — भारत.")).toBeVisible();
  await expect(first.getByRole("table")).toBeVisible();
  await expect(first.getByRole("link", { name: "Primary citation" })).toHaveAttribute("href", "https://pib.gov.in/test");
  await expect(first.getByRole("link", { name: /CDS_II_2026_GK_011/ })).toHaveAttribute("href", target);
  await expect(page.getByRole("heading", { name: "Test today’s Current Affairs" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(dialogs).toEqual([]);
  expect(await first.locator('a[href^="javascript:"]').count()).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("editorial-mobile.png"), fullPage: true });
  await testInfo.attach("Mobile editorial (synthetic QA)", { path: testInfo.outputPath("editorial-mobile.png"), contentType: "image/png" });
});

test("guest login and onboarding retain exact target, then existing player saves authoritative attempt and analytics", async ({ page, context, request }, testInfo) => {
  await page.goto(target);
  await expect(page).toHaveURL(/\/auth\/login\?/);
  expect(new URL(page.url()).searchParams.get("next")).toBe(target);
  await signIn(context);
  await request.post("http://127.0.0.1:4547/__qa", { data: { complete: false } });
  await page.goto("/auth/continue?next=" + encodeURIComponent(target));
  await expect(page).toHaveURL(/\/onboarding\?/);
  expect(new URL(page.url()).searchParams.get("next")).toBe(target);
  await request.post("http://127.0.0.1:4547/__qa", { data: { complete: true } });
  const promptResponse = page.waitForResponse(response => response.url().includes("/api/practice/questions?"));
  await page.goto("/auth/continue?next=" + encodeURIComponent(target));
  await expect(page).toHaveURL(target);
  const prompt = await (await promptResponse).json();
  expect(prompt.questions).toHaveLength(1);
  expect(prompt.questions[0].question_id).toBe("CDS_II_2026_GK_011");
  expect(prompt.questions[0]).not.toHaveProperty("final_opt");
  expect(prompt.questions[0]).not.toHaveProperty("explanation");
  await expect(page.getByText("Synthetic exact linked question: which option is two?")).toBeVisible();
  await expect(page.getByText("Synthetic answer explanation: two is B.")).toHaveCount(0);
  await page.evaluate(() => { window.addEventListener("dp_question_attempted", event => {
    (window as unknown as { qaAttempt: unknown }).qaAttempt = (event as CustomEvent).detail;
  }); });
  await page.getByRole("radio", { name: "B Two" }).click();
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.getByText("Synthetic answer explanation: two is B.")).toBeVisible();
  const data = await (await request.get("http://127.0.0.1:4547/__qa")).json();
  expect(data.attempts).toHaveLength(1);
  expect(data.attempts[0].question_id).toBe("11111111-1111-4111-a111-111111111111");
  expect(data.attempts[0].is_correct).toBe(true);
  expect(data.sessions[0].question_ids).toEqual(["11111111-1111-4111-a111-111111111111"]);
  expect(await page.evaluate(() => (window as unknown as { qaAttempt: { is_correct: boolean } }).qaAttempt.is_correct)).toBe(true);
  await expect(page.getByRole("link", { name: "Back to Current Affairs" })).toHaveAttribute("href", "/current-affairs/2030-01-01");
  await page.screenshot({ path: testInfo.outputPath("exact-pyq-mobile.png"), fullPage: true });
});

test("missing or withheld PYQ never falls back to a different question", async ({ page, context, request }) => {
  await signIn(context);
  await page.goto("/pyq/MISSING");
  await expect(page.getByRole("alert").filter({ hasText: "This linked PYQ is unavailable" })).toContainText("This linked PYQ is unavailable");
  await expect(page.getByText("Synthetic exact linked question: which option is two?")).toHaveCount(0);
  await request.post("http://127.0.0.1:4547/__qa", { data: { eligible: false } });
  await page.goto(target);
  await expect(page.getByRole("alert").filter({ hasText: "This linked PYQ is unavailable" })).toContainText("This linked PYQ is unavailable");
  await expect(page.getByRole("button", { name: "Check Answer" })).toHaveCount(0);
});


test("a failed attempt save keeps answer hidden and permits an exact-question retry", async ({ page, context, request }) => {
  await signIn(context);
  await page.goto(target);
  await page.getByRole("radio", { name: "B Two" }).click();
  await page.route("**/api/practice/attempt", route => route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"Synthetic outage"}' }));
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Your answer could not be saved" })).toBeVisible();
  await expect(page.getByText("Synthetic answer explanation: two is B.")).toHaveCount(0);
  await page.unroute("**/api/practice/attempt");
  await page.getByRole("button", { name: "Check Answer" }).click();
  await expect(page.getByText("Synthetic answer explanation: two is B.")).toBeVisible();
  const data = await (await request.get("http://127.0.0.1:4547/__qa")).json();
  expect(data.attempts).toHaveLength(1);
  expect(data.attempts[0].question_id).toBe("11111111-1111-4111-a111-111111111111");
});
