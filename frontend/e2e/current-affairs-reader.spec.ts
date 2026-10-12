import { test, expect } from "@playwright/test";
import published from "../../scripts/test-support/published-editorial-2026-10-12.json";
import { createHash } from "node:crypto";

const control = "http://127.0.0.1:4547/__qa";
const edition = "/current-affairs/2030-01-01";
test.beforeEach(async ({ request }) => { await request.post(control, { data: { mode: "reader" } }); });

for (const viewport of [{ width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
  test(`briefing and complete reader at ${viewport.width}px`, async ({ page, request }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.goto(edition);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await expect(page.locator('#briefing')).toContainText('3 stories');
    await expect(page.locator('#briefing')).toContainText('6 MCQs');
    const quizEntry = page.getByRole('link', { name: 'Daily Knowledge Check — 6 MCQs' });
    const bounds = await quizEntry.boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThan(viewport.height - 65);
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(await overflow()).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`briefing-${viewport.width}.png`), fullPage: true });
    await testInfo.attach(`Briefing ${viewport.width}px (isolated fixture)`, { path: testInfo.outputPath(`briefing-${viewport.width}.png`), contentType: 'image/png' });
    await page.getByRole('link', { name: 'Start Reading' }).click();
  await expect(page).toHaveURL(/#story-1$/);
    const first = page.locator('#story-1');
    await expect(first).toHaveAttribute('open', '');
    for (const label of ['What Happened?', 'Why It Matters:', 'Key Exam Facts', 'Static – Current Affairs Linkage:', 'Conceptual Linkage', 'Unknown approved heading', 'Exam Edge.', 'Future Question Angles?']) {
      await expect(first.getByRole('heading', { level: 3, name: label, exact: true })).toBeVisible();
    }
    await expect(first.getByText('Second paragraph — भारत.')).toBeVisible();
    await expect(first.getByText('Why It Matters is explained in this sentence, which must remain normal prose.')).toHaveJSProperty('tagName', 'P');
    await expect(first.getByText('The exact question tests the related concept; retain this explanatory PYQ analysis.')).toBeVisible();
    await expect(first.getByRole('table')).toBeVisible();
    if (viewport.width < 768) expect(await first.getByRole('region', { name: 'Editorial table' }).evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
    await expect(first.getByRole('link', { name: 'Primary citation' })).toHaveAttribute('href', 'https://pib.gov.in/test');
    await expect(first.locator('em')).toContainText('emphasis');
    await expect(first.getByText('Complete footnote content.')).toBeVisible();
    expect(await overflow()).toBe(true);
    const body = first.locator('.editorial-copy');
    const typography = await body.evaluate(el => ({ font: parseFloat(getComputedStyle(el).fontSize), line: parseFloat(getComputedStyle(el).lineHeight) }));
    expect(typography.font).toBeGreaterThanOrEqual(16);
    expect(typography.line / typography.font).toBeGreaterThanOrEqual(1.65);
    await page.screenshot({ path: testInfo.outputPath(`reader-${viewport.width}.png`), fullPage: true });
    await testInfo.attach(`Reader ${viewport.width}px (isolated fixture)`, { path: testInfo.outputPath(`reader-${viewport.width}.png`), contentType: 'image/png' });
    const source = (await (await request.get(control)).json()).source;
    expect(createHash('sha256').update(source.source).digest('hex')).toBe(source.sha256);
    await first.getByRole('link', { name: 'Take the daily quiz' }).click();
    await expect(page).toHaveURL(/#daily-quiz$/);
    await expect(page.getByRole('button', { name: 'Check Answer' })).toBeVisible();
    await page.getByRole('navigation', { name: 'Edition navigation' }).getByRole('link', { name: 'Next', exact: true }).click();
    await expect(page).toHaveURL('/current-affairs/2030-01-02');
  });
}

test('keyboard disclosure, same anchor reopen, browser back, reduced motion and 200% zoom', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(edition + '#story-2');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  const summary = page.locator('#story-2 summary');
  await expect(page.locator('#story-2')).toHaveAttribute('open', '');
  await summary.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#story-2')).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space'); await expect(page.locator('#story-2')).toHaveAttribute('open', '');
  expect(await summary.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
  await page.goto(edition);
  await page.getByRole('link', { name: 'Start Reading' }).click();
  await expect(page).toHaveURL(/#story-1$/);
  await page.locator('#story-1 summary').click();
  await page.getByRole('link', { name: 'Start Reading' }).click();
  await expect(page).toHaveURL(/#story-1$/);
  await expect(page.locator('#story-1')).toHaveAttribute('open', '');
  await page.locator('#story-1').getByRole('link', { name: 'Take the daily quiz' }).click();
  await expect(page).toHaveURL(/#daily-quiz$/);
  await page.goBack(); await expect(page).toHaveURL(/#story-1$/);
  await page.evaluate(() => { document.documentElement.style.zoom = '2'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(page.locator('#story-1 summary')).toBeVisible();
});

test('legacy, broken JSON and malformed optional metadata retain content and consistent disclosure', async ({ page, request }) => {
  for (const mode of ['legacy', 'malformed', 'optional']) {
    await request.post(control, { data: { mode } });
    await page.goto(edition);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await page.locator('#story-1 summary').click();
    if (mode === 'optional') await expect(page.locator('#story-1').getByText('Second paragraph — भारत.')).toBeVisible();
    else await expect(page.locator('#story-1').getByText('Exact approved event', { exact: false })).toBeVisible();
    if (mode !== 'legacy') await expect(page.getByRole('status').filter({ hasText: 'Some edition details' })).toBeVisible();
    if (mode === 'optional') await expect(page.locator('#story-1').getByRole('link', { name: /Attempt this PYQ/ })).toHaveCount(0);
  }
});

test('genuine missing edition and temporary fetch failure show different honest states', async ({ page, request }) => {
  await page.goto('/current-affairs/2030-02-20');
  await expect(page.getByRole('heading', { name: 'No edition for this date' })).toBeVisible();
  await request.post(control, { data: { failure: true } });
  await page.goto(edition);
  await expect(page.getByRole('heading', { name: 'Current Affairs is temporarily unavailable' })).toBeVisible();
  await expect(page.getByText('Synthetic backend outage')).toHaveCount(0);
  await request.post(control, { data: {} });
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Daily Current Affairs', exact: true })).toBeVisible();
});

test('daily quiz retains original options, key, explanation, order and attempt contract', async ({ page, request }) => {
  await request.post(control, { data: {} });
  await page.goto(edition);
  await page.getByRole('link', { name: 'Daily Knowledge Check — 3 MCQs' }).click();
  const option = page.getByRole('button', { name: 'B Two', exact: true });
  await option.click(); await expect(option).toHaveAttribute('aria-pressed', 'true');
  const attempt = page.waitForRequest(req => req.url().includes('/api/current-affairs/attempt') && req.method() === 'POST');
  await page.getByRole('button', { name: 'Check Answer' }).click();
  expect((await attempt).postDataJSON()).toMatchObject({ mcqId: 'mcq-0-0', selectedOption: 'B' });
  await expect(page.getByText('Correct — keep it.')).toBeVisible();
  await expect(page.getByText('Second explanation paragraph.')).toBeVisible();
  await expect(page.getByText('Complete exam edge', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next Question' }).click();
  await expect(page.getByText('Question 2 of 3')).toBeVisible();
  await expect(page.getByText('Synthetic MCQ 1?', { exact: false })).toBeVisible();
});

test('published 12 October manuscript, SEO, exact PYQs and accessible briefing at all target viewports', async ({ page }, testInfo) => {
  const source = JSON.parse(published.approved_editorial_source);
  const axe = (await import('axe-core')).default;
  for (const viewport of [{ width: 375, height: 812 }, { width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 1440, height: 1000 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/current-affairs/2026-10-12');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/current-affairs\/2026-10-12$/);
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
    await expect(page.locator('details[open]')).toHaveCount(0);
    await expect(page.locator('#briefing')).toContainText('3 stories');
    await expect(page.locator('#briefing')).toContainText('4 MCQs');
    const entry = await page.getByRole('link', { name: 'Daily Knowledge Check — 4 MCQs' }).boundingBox();
    expect(entry!.y + entry!.height).toBeLessThan(viewport.height - 65);
    expect((await page.locator('#story-1 summary').boundingBox())!.y).toBeLessThan(viewport.height - 180);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath(`published-briefing-${viewport.width}.png`), fullPage: true });
    const notes = page.locator('details').last();
    await notes.locator('summary').click();
    await expect(notes).toContainText(published.summary);
    await expect(notes).toContainText(published.title);
    await notes.locator('summary').click();
    await testInfo.attach(`Published 12 October briefing ${viewport.width}px (local read-only snapshot)`, { path: testInfo.outputPath(`published-briefing-${viewport.width}.png`), contentType: 'image/png' });
    await page.addScriptTag({ content: axe.source });
    const audit = async () => page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context: string, options: unknown) => Promise<{ violations: { id: string; description: string }[] }> } }).axe;
      return axe.run('.ca-edition', { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } });
    });
    expect((await audit()).violations).toEqual([]);
    for (const [index, story] of source.stories.entries()) {
      const reader = page.locator(`#story-${index + 1}`);
      await reader.locator('summary').click();
      const text = (await reader.innerText()).replace(/\s+/g, ' ');
      // The actual approved manuscript is plain Markdown; check every textual line,
      // including citations and explanatory PYQ prose. ID references may move to cards.
      for (const line of story.editorialMarkdown.split('\n').map((s: string) => s.trim()).filter(Boolean)) {
        const expected = line.replace(/^#{1,6}\s+/, '').replace(/^[-*+]\s+/, '').replace(/^\d+[.)]\s+/, '').replace(/\*\*/g, '').replace(/\s+/g, ' ');
        expect(text, `Story ${index + 1}: ${line}`).toContain(expected);
      }
      for (const id of story.linkedPyqIds) await expect(reader.getByRole('link', { name: new RegExp(id) })).toHaveAttribute('href', `/pyq/${id}?edition=2026-10-12`);
      await expect(reader.getByRole('link', { name: story.sourceName, exact: true })).toHaveAttribute('href', story.sourceUrl);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect((await audit()).violations).toEqual([]);
      if (index === 0) {
        await page.screenshot({ path: testInfo.outputPath(`published-reader-${viewport.width}.png`), fullPage: true });
        await testInfo.attach(`Published reader ${viewport.width}px`, { path: testInfo.outputPath(`published-reader-${viewport.width}.png`), contentType: 'image/png' });
      }
    }
  }
});


test('story to exact PYQ login and browser return retains edition then reaches quiz', async ({ page }) => {
  await page.goto(edition);
  await page.getByRole('link', { name: 'Start Reading' }).click();
  await expect(page).toHaveURL(/#story-1$/);
  await page.locator('#story-1').getByRole('link', { name: /CDS_II_2026_GK_011/ }).click();
  await expect(page).toHaveURL(/\/auth\/login\?/);
  expect(new URL(page.url()).searchParams.get('next')).toBe('/pyq/CDS_II_2026_GK_011?edition=2030-01-01');
  await page.goBack();
  await expect(page).toHaveURL(/\/current-affairs\/2030-01-01#story-1$/);
  await expect(page.locator('#story-1')).toHaveAttribute('open', '');
  await page.locator('#story-1').getByRole('link', { name: 'Take the daily quiz' }).click();
  await expect(page).toHaveURL(/#daily-quiz$/);
});

test('complete approved manuscript and semantic disclosure are included in server HTML', async ({ request }) => {
  const html = await (await request.get('http://127.0.0.1:4548/current-affairs/2026-10-12')).text();
  expect(html).toContain('The six-year mission aims to achieve self-sufficiency in pulses by 2030–31');
  expect(html).toContain('The initiative seeks to strengthen domestic pulses production, improve farmer incentives and reduce India’s dependence on imports.');
  expect(html).toContain('id="story-1"');
  expect(html).toContain('<summary');
  expect(html).toContain('https://www.pib.gov.in/PressReleseDetailm.aspx');
});
