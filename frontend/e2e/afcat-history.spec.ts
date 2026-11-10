import { test, expect } from "@playwright/test";

test("previously finalized retired and published mock results appear before new-mock CTA", async ({ page }) => {
  await page.route("**/api/afcat/tests", r => r.fulfill({ json: { tests: [{ id: "live-mock", code: "AFCAT-FM02-V1", title: "Full Mock 01", expected_questions: 100, duration_seconds: 7200, max_marks: 300 }] } }));
  await page.route("**/api/afcat/dashboard", r => r.fulfill({ json: {
    inProgress: null, bestScore: 124, averageScore: 105,
    attempts: [
      { sessionId: "retired-session", title: "Original AFCAT mock (retired)", status: "SUBMITTED", score: 124, maxMarks: 300, correct: 45, incorrect: 11, unanswered: 44, completedAt: "2026-10-29T12:00:00Z", questionTimeSeconds: null, timeSeconds: 0 },
      { sessionId: "published-session", title: "AFCAT Full Mock 01", status: "EXPIRED", score: 86, maxMarks: 300, correct: 31, incorrect: 7, unanswered: 62, completedAt: "2026-10-30T12:00:00Z", questionTimeSeconds: 120, timeSeconds: 0 },
    ],
  } }));
  await page.goto("/afcat/dashboard");
  await expect(page.getByRole("heading", { name: "Your saved AFCAT results" })).toBeVisible();
  await expect(page.getByText("Original AFCAT mock (retired)")).toBeVisible();
  await expect(page.getByText("AFCAT Full Mock 01", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "View analysis" })).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "Attempt another mock" })).toBeVisible();
  const saved = await page.getByRole("heading", { name: "Your saved AFCAT results" }).boundingBox();
  const newMock = await page.getByRole("heading", { name: "Attempt another mock" }).boundingBox();
  expect(saved && newMock && saved.y < newMock.y).toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("unauthenticated learner is offered history restoration, not an empty first attempt", async ({ page }) => {
  await page.route("**/api/afcat/tests", r => r.fulfill({ json: { tests: [] } }));
  await page.route("**/api/afcat/dashboard", r => r.fulfill({ status: 401, json: { error: "Sign in required" } }));
  await page.goto("/afcat/dashboard");
  await expect(page.getByRole("heading", { name: "Sign in to restore your AFCAT history" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in to view saved results" })).toHaveAttribute("href", /auth\/login/);
  await expect(page.getByText("No finalized AFCAT results for this signed-in account")).toHaveCount(0);
});

test("temporary API error preserves history semantics and offers retry", async ({ page }) => {
  await page.route("**/api/afcat/tests", r => r.fulfill({ json: { tests: [] } }));
  await page.route("**/api/afcat/dashboard", r => r.fulfill({ status: 503, json: { error: "Temporarily unavailable" } }));
  await page.goto("/afcat/dashboard");
  await expect(page.getByRole("heading", { name: "Saved AFCAT history could not be loaded" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Retry history" })).toBeVisible();
  await expect(page.getByText("No finalized AFCAT results for this signed-in account")).toHaveCount(0);
});