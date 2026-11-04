import { test, expect } from "@playwright/test";

test("twelve complex diagrams remain legible and select independently on mobile", async ({ page }) => {
  await page.goto("/afcat/visual-preview");
  await expect(page.getByRole("heading", { name: "AFCAT Complex Diagram Benchmarks" })).toBeVisible();
  const picker = page.getByLabel("Benchmark case");
  await expect(picker.locator("option")).toHaveCount(12);
  for (let i = 0; i < 12; i++) {
    await picker.selectOption(String(i));
    await expect(page.getByRole("heading", { name: `Question ${i+1}` })).toBeVisible();
    const stemDiagram = page.getByRole("button", { name: /^Enlarge diagram:/ }).first();
    await expect(stemDiagram).toBeVisible();
    await expect(stemDiagram.locator("img")).toHaveJSProperty("complete", true);
    expect(await stemDiagram.locator("img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.getByRole("radio")).toHaveCount(4);
    await page.getByRole("radio").nth(i % 4).check();
    await expect(page.getByText(`Selected option: ${"ABCD"[i%4]}`, { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("zoom can be closed with Escape, focus returns and choice is unchanged", async ({ page }) => {
  await page.goto("/afcat/visual-preview");
  const radio = page.getByRole("radio").first();
  await radio.check();
  const trigger = page.getByRole("button", { name: /^Enlarge diagram:/ }).first();
  await trigger.focus();
  await trigger.click();
  await expect(page.getByRole("dialog", { name: /^Enlarged diagram:/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close enlarged diagram" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close enlarged diagram" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(radio).toBeChecked();
});

test("mobile option illustrations stay inside viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/afcat/visual-preview");
  await expect(page.locator("fieldset img")).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const image = page.locator("fieldset img").first();
  const rect = await image.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(320);
});
