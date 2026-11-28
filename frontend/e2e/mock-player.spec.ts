import { test, expect, type Page } from "@playwright/test";
// Synthetic API fixture tests of the learner UI (the API is intercepted). These do NOT claim
// authenticated staging acceptance; the real routes are covered by scripts/test-mock-routes.cjs
// and the database engine was exercised directly on staging.
const BLUEPRINT: Record<string, number> = {
  History: 22, Geography: 18, Polity: 15, Economy: 13, "Science & Tech": 35,
  "Current Affairs": 9, Environment: 4, "International Relations": 2, Security: 2,
};
const marking = { correctPoints: 15, wrongPoints: 5, pointsDivisor: 18, maxMarks: 100 };
const subjects: string[] = Object.entries(BLUEPRINT).flatMap(([s, n]) => Array<string>(n).fill(s));
const questions = subjects.map((subject, i) => ({
  id: `q${i + 1}`, number: i + 1, subject,
  stem: (i + 1) % 5 === 0
    ? { text: `Consider the following statements about ${subject}:`, statements: [
        "The first placeholder statement is deliberately long enough to wrap on a 320px screen so we can check legibility.",
        "The second placeholder statement.", "The third placeholder statement.",
      ] }
    : { text: `Synthetic ${subject} question ${i + 1}: Calculate $x^2 + 2x + 1$.` },
  options: ["A", "B", "C", "D"].map((key) => ({ key, text: `Choice ${key} for question ${i + 1}` })),
}));
const difficulty = (i: number) => ["EASY", "MODERATE", "HARD"][i % 3];

async function mockApi(page: Page, opts: { patchFails?: boolean } = {}) {
  const answers: Record<string, { question_id: string; selected_option: string | null; marked_for_review: boolean }> = {};
  let status = "IN_PROGRESS";
  const test = { id: "11111111-1111-4111-8111-111111111111", code: "CDS-GK-M00-DEMO", title: "CDS GK Demo Mock (dummy questions)",
    duration_seconds: 7200, expected_questions: 120, correct_points: 15, wrong_points: 5, points_divisor: 18, max_marks: "100.00", blueprint: BLUEPRINT };
  await page.route("**/api/mock/**", async (route) => {
    const req = route.request();
    const path = new URL(req.url()).pathname;
    if (path.endsWith("/tests")) return route.fulfill({ json: { tests: [test] } });
    if (path.endsWith("/responses")) {
      if (opts.patchFails) return route.fulfill({ status: 503, json: { error: "Synthetic offline failure" } });
      const p = req.postDataJSON();
      answers[p.questionId] = { question_id: p.questionId, selected_option: p.selected, marked_for_review: p.markedForReview };
      return route.fulfill({ json: { saved: true } });
    }
    if (path.endsWith("/submit")) { status = "SUBMITTED"; return route.fulfill({ json: { result: {} } }); }
    if (path.endsWith("/result")) {
      if (status === "IN_PROGRESS") return route.fulfill({ status: 409, json: { error: "Submit test before viewing results" } });
      const review = questions.map((q, i) => {
        const sel = answers[q.id]?.selected_option ?? null;
        const outcome = sel === null ? "UNANSWERED" : sel === "A" ? "CORRECT" : "INCORRECT";
        return { questionId: q.id, position: q.number, subject: q.subject, topic: `${q.subject} (dummy)`, difficulty: difficulty(i), selected: sel, correct: "A", outcome,
          marks: outcome === "CORRECT" ? 0.83 : outcome === "INCORRECT" ? -0.28 : 0, markedForReview: answers[q.id]?.marked_for_review ?? false,
          timeSpentSeconds: 0, explanation: `Explanation for question ${q.number}: option A is correct.`, question: q };
      });
      const c = review.filter((r) => r.outcome === "CORRECT").length, w = review.filter((r) => r.outcome === "INCORRECT").length;
      const bucket = (key: string, rows: typeof review) => {
        const cc = rows.filter((r) => r.outcome === "CORRECT").length, ww = rows.filter((r) => r.outcome === "INCORRECT").length;
        return { key, total: rows.length, correct: cc, incorrect: ww, unanswered: rows.length - cc - ww, attempted: cc + ww, accuracyPercent: cc + ww ? Math.round((cc / (cc + ww)) * 10000) / 100 : 0 };
      };
      return route.fulfill({ json: {
        status, title: test.title,
        summary: { score: Math.round(((c * 15 - w * 5) / 18) * 100) / 100, max_marks: 100, correct_count: c, incorrect_count: w, unanswered_count: 120 - c - w, attempted: c + w, accuracyPercent: c + w ? Math.round((c / (c + w)) * 10000) / 100 : 0 },
        marking, analysis: {
          subjects: Object.keys(BLUEPRINT).map((s) => bucket(s, review.filter((r) => r.subject === s))),
          difficulties: ["EASY", "MODERATE", "HARD"].map((d) => bucket(d, review.filter((r) => r.difficulty === d))),
        }, review,
      } });
    }
    if (path.endsWith("/sessions")) return route.fulfill({ json: { sessionId: "22222222-2222-4222-8222-222222222222", resumed: false }, status: 201 });
    return route.fulfill({ json: {
      serverNow: new Date().toISOString(),
      session: { id: "22222222-2222-4222-8222-222222222222", title: test.title, code: test.code, status, deadline: new Date(Date.now() + 7200000).toISOString(), expired: false, marking, durationSeconds: 7200 },
      questions, responses: Object.values(answers),
    } });
  });
}
const noOverflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);

for (const [width, name] of [[320, "mobile-320"], [390, "mobile-390"], [1280, "desktop"]] as const) {
  test(`CDS GK mock flow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mockApi(page);
    await page.goto("/mock/cds-gk");
    await expect(page.getByRole("heading", { name: "CDS GK Demo Mock (dummy questions)" })).toBeVisible();
    await expect(page.getByText("+0.83 / -0.28")).toBeVisible();
    await expect(page.getByRole("article").getByText("100", { exact: true })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({ path: `test-results/mock-catalogue-${name}.png`, fullPage: true });

    await page.getByRole("button", { name: "Start mock" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("button", { name: "Begin test" })).toBeDisabled();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Begin test" }).click();
    await expect(page).toHaveURL(/\/mock\/cds-gk\/22222222/);
    await expect(page.getByText("QUESTION 1 / 120")).toBeVisible();
    await expect(page.getByText("DP practice question").first()).toBeVisible();
    await expect(page.getByRole("main").getByText(/PYQ/)).toHaveCount(0);
    await expect(page.getByRole("timer")).toBeVisible();

    await page.getByRole("radio").first().click();                       // answer Q1 = A
    await expect(page.getByRole("radio").first()).toBeChecked();
    await page.getByRole("button", { name: "Mark for Review", exact: true }).click();
    await expect(page.getByRole("button", { name: "Unmark Review" })).toBeEnabled();
    await page.getByRole("button", { name: "Save & Next" }).click();
    await expect(page.getByText("QUESTION 2 / 120")).toBeVisible();
    await page.getByRole("radio").nth(1).click();                         // Q2 = B (wrong)
    await expect(page.getByRole("radio").nth(1)).toBeChecked();
    // Jump to the first statement-type question (Q5).
    if (width < 1024) await page.getByRole("button", { name: "Question palette", exact: true }).click();
    await page.getByRole("button", { name: /^Question 5, /, }).click();
    await expect(page.getByText("QUESTION 5 / 120")).toBeVisible();
    await expect(page.getByRole("list", { name: "Statements" })).toBeVisible();
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({ path: `test-results/mock-player-${name}.png`, fullPage: false });

    await page.reload();                                                  // resume
    await expect(page.getByText("QUESTION 5 / 120")).toBeVisible();
    if (width < 1024) await page.getByRole("button", { name: "Question palette", exact: true }).click();
    await expect(page.getByRole("button", { name: "Question 1, answered, marked for review", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Question 2, answered", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Question 6, not visited", exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Submit test", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("2 answered · 118 unanswered · 1 marked for review.")).toBeVisible();
    await page.screenshot({ path: `test-results/mock-submit-${name}.png` });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Submit test", exact: true }).click();
    await page.getByRole("button", { name: "Confirm submission" }).click();

    // 1 correct (+0.83), 1 wrong (-0.28): (15-5)/18 = 0.56
    await expect(page.getByTestId("score")).toContainText("0.56");
    await expect(page.getByTestId("score")).toContainText("100.00");
    await expect(page.getByText("+0.83 per correct answer, −0.28 per wrong answer")).toBeVisible();
    await expect(page.getByRole("region", { name: "By subject" })).toBeVisible();
    await expect(page.getByRole("region", { name: "By difficulty" })).toBeVisible();
    await expect(page.getByText("Correct answer: A").first()).toBeVisible();
    await expect(page.getByText(/Explanation for question 2/)).toBeVisible();
    await expect(page.getByRole("radio")).toHaveCount(0);
    expect(await noOverflow(page)).toBe(true);
    await page.screenshot({ path: `test-results/mock-result-${name}.png`, fullPage: false });
    await page.reload();
    await expect(page.getByTestId("score")).toContainText("0.56");
  });
}

test("failed save keeps the answer on screen, retries in the background and never claims saved", async ({ page }) => {
  await mockApi(page, { patchFails: true });
  await page.goto("/mock/cds-gk");
  await page.getByRole("button", { name: "Start mock" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Begin test" }).click();
  await page.getByRole("radio").first().click();
  await expect(page.getByRole("radio").first()).toBeChecked();            // optimistic, no freeze
  await expect(page.getByText(/retrying \(1 unsaved\)/)).toBeVisible();
  await expect(page.getByText("All responses saved")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Reload saved attempt" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Save & Next" })).toBeEnabled(); // navigation still works
  await page.getByRole("button", { name: "Save & Next" }).click();
  await expect(page.getByText("QUESTION 2 / 120")).toBeVisible();
});

test("signed-out learner sees centered, dismissible sign-in prompt without scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 650 });
  await page.route("**/api/mock/tests", (r) => r.fulfill({ status: 401, json: { error: "Sign in required" } }));
  await page.goto("/mock/cds-gk");
  const dialog = page.getByRole("dialog", { name: "Sign in to attempt this mock" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.y).toBeGreaterThanOrEqual(0);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(650);
  await expect(page.getByRole("link", { name: "Sign in with Defence Pathshala" })).toHaveAttribute("href", /auth.*next=/);
  await page.getByRole("button", { name: "Close sign in prompt" }).click();
  await expect(dialog).not.toBeVisible();
});

test("sign-in failure after guest starts mock opens dialog and allows closing and retry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 650 });
  await mockApi(page);
  await page.route("**/api/mock/sessions", (r) => r.fulfill({ status: 401, json: { error: "Sign in required" } }));
  await page.goto("/mock/cds-gk");
  await page.getByRole("button", { name: "Start free mock 01" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Begin test" }).click();
  const dialog = page.getByRole("dialog", { name: "Sign in to attempt this mock" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.getByRole("button", { name: "Start free mock 01" }).click();
  await expect(page.getByRole("button", { name: "Begin test" })).toBeVisible();
});
