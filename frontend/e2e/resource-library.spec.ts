import { expect, test } from "@playwright/test";

test.describe("Resource Library campaign acceptance", () => {
  test("public catalogue does not disclose the unlisted Cyclone quiz", async ({ page }) => {
    await page.goto("/resources");
    await expect(page.getByRole("heading", { name: /study smarter with defence pathshala/i })).toBeVisible();
    await expect(page.getByText("Cyclone Geography — 5 MCQs")).toHaveCount(0);
    await expect(page.locator('a[href*="cyclone-geography"]')).toHaveCount(0);
  });

  test("unlisted link opens the interactive quiz on mobile and scores accurately", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/resources/cyclone-geography");
    await expect(page.getByRole("heading", { name: "Cyclone Geography — 5 MCQs" })).toBeVisible();
    const selections = [1, 2, 0, 1, 2];
    for (let i = 0; i < selections.length; i++) {
      await expect(page.getByText(`Question ${i + 1} of 5`)).toBeVisible();
      await page.locator('input[type="radio"]').nth(selections[i]).check();
      if (i < selections.length - 1) {
        await page.getByRole("button", { name: "Next question" }).click();
      }
    }
    await page.reload();
    // Deliberately document MVP limitation: in-memory selections are not refresh-persistent.
    await expect(page.getByText("Question 1 of 5")).toBeVisible();
    for (let i = 0; i < selections.length; i++) {
      await page.locator('input[type="radio"]').nth(selections[i]).check();
      await page.getByRole("button", { name: i === 4 ? "See results" : "Next question" }).click();
    }
    await expect(page.getByText("5/5")).toBeVisible();
    await expect(page.getByText("Your score")).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText("Question 1 of 5")).toBeVisible();
  });

  test("unpublished or unknown resources are inaccessible", async ({ page }) => {
    const response = await page.goto("/resources/not-a-real-resource");
    expect(response?.status()).toBe(404);
  });

  test("unlisted page is marked noindex", async ({ page }) => {
    await page.goto("/resources/cyclone-geography");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
});
