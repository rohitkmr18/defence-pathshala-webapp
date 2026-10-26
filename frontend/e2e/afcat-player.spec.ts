import { test, expect } from "@playwright/test";
// Synthetic API fixture tests. These do NOT claim authenticated staging acceptance.
for (const width of [320, 390, 1280]) {
  test(`player navigation, persistence, review and submission at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const answers: Record<
      string,
      {
        question_id: string;
        selected_option: string | null;
        marked_for_review: boolean;
      }
    > = {};
    let status = "IN_PROGRESS";
    const questions = Array.from({ length: 100 }, (_, i) => ({
      id: `q${i + 1}`,
      number: i + 1,
      section:
        i < 30
          ? "ENGLISH"
          : i < 55
            ? "GENERAL_AWARENESS"
            : i < 75
              ? "NUMERICAL_ABILITY"
              : "REASONING_MILITARY_APTITUDE",
      stem: { text: `Synthetic question ${i + 1}. Calculate $x^2 + 2x + 1$.` },
      options: ["A", "B", "C", "D"].map((key) => ({
        key,
        content: { text: `Choice ${key}` },
      })),
    }));
    await page.route("**/api/afcat/**", async (route) => {
      const path = new URL(route.request().url()).pathname;
      let body: unknown;
      if (path.endsWith("/tests"))
        body = {
          tests: [
            {
              id: "test",
              title: "Synthetic QA mock",
              expected_questions: 100,
              duration_seconds: 7200,
            },
          ],
        };
      else if (path.endsWith("/responses")) {
        const p = route.request().postDataJSON();
        answers[p.questionId] = {
          question_id: p.questionId,
          selected_option: p.selected,
          marked_for_review: p.markedForReview,
        };
        body = { saved: true };
      } else if (path.endsWith("/submit")) {
        status = "SUBMITTED";
        body = { result: {} };
      } else if (path.endsWith("/result"))
        body = {
          status,
          summary: {
            score: 3,
            max_marks: 300,
            correct_count: 1,
            incorrect_count: 0,
            unanswered_count: 99,
          },
          sections: [],
        };
      else if (path.endsWith("/sessions"))
        body = { sessionId: "synthetic-session" };
      else
        body = {
          serverNow: new Date().toISOString(),
          session: {
            id: "synthetic-session",
            title: "Synthetic QA mock",
            status,
            deadline: new Date(Date.now() + 7200000).toISOString(),
            expired: false,
          },
          questions,
          responses: Object.values(answers),
        };
      await route.fulfill({ json: body });
    });
    await page.goto("/afcat/lab");
    await page.getByRole("button", { name: /Synthetic QA mock/ }).click();
    await expect(
      page.getByRole("heading", { name: "Question 1", exact: true }),
    ).toBeVisible();
    await page.getByRole("radio").first().press("Space");
    await expect(page.getByRole("radio").first()).toBeChecked();
    await expect(page.getByRole("radio").first()).toBeEnabled();
    await page
      .getByRole("button", { name: "Mark for Review", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Unmark Review" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Clear Response" }).click();
    await expect(page.getByRole("radio").first()).not.toBeChecked();
    await expect(
      page.getByRole("button", { name: "Unmark Review" }),
    ).toBeEnabled();
    await page.getByRole("radio").first().press("Space");
    await expect(
      page.getByRole("button", { name: "Save & Next" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Save & Next" }).click();
    await expect(
      page.getByRole("heading", { name: "Question 2", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Question 2", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Previous", exact: true }).click();
    await expect(page.getByRole("radio").first()).toBeChecked();
    if (width < 1024)
      await page
        .getByRole("button", { name: "Question palette", exact: true })
        .click();
    await expect(
      page.getByRole("button", {
        name: "Question 1, answered, marked for review",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Question 2, visited, unanswered",
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Question 3, not visited",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/afcat-player-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Submit test", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page
      .getByRole("button", { name: "Submit test", exact: true })
      .click();
    await page.getByRole("button", { name: "Confirm submission" }).click();
    await expect(
      page.getByRole("region", { name: "Exam results" }),
    ).toBeVisible();
    await expect(page.getByRole("radio").first()).toBeDisabled();
    await page.reload();
    await expect(
      page.getByRole("region", { name: "Exam results" }),
    ).toBeVisible();
  });
}
test("failed save blocks navigation and never claims saved", async ({
  page,
}) => {
  await page.route("**/api/afcat/**", async (route) => {
    if (route.request().method() === "PATCH")
      return route.fulfill({
        status: 503,
        json: { error: "Synthetic offline failure" },
      });
    await route.fulfill({
      json: {
        serverNow: new Date().toISOString(),
        session: {
          id: "qa",
          title: "QA",
          status: "IN_PROGRESS",
          deadline: new Date(Date.now() + 60000).toISOString(),
        },
        questions: [1, 2].map((n) => ({
          id: "q" + n,
          number: n,
          section: "ENGLISH",
          stem: { text: "Synthetic" },
          options: ["A", "B", "C", "D"].map((key) => ({
            key,
            content: { text: key },
          })),
        })),
        responses: [],
      },
    });
  });
  await page.goto("/afcat/lab?session=qa");
  await page.getByRole("radio").first().press("Space");
  await expect(page.getByRole("alert").filter({ hasText: "Synthetic offline failure" })).toContainText(
    "Synthetic offline failure",
  );
  await expect(
    page.getByRole("button", { name: "Save & Next" }),
  ).toBeDisabled();
  await expect(page.getByRole("radio").first()).not.toBeChecked();
});
