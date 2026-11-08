import { test, expect } from '@playwright/test';
for (const width of [320, 390, 1440]) {
  test(`landing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Stop Guessing.');
    const capf = page.getByRole('button', { name: 'CAPF AC', exact: true });
    await capf.focus(); await page.keyboard.press('Enter');
    await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('link', { name: 'Start Free Practice' })).toHaveAttribute('href', /exam=CAPF-AC/);
    await page.reload(); await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'AFCAT', exact: true }).click();
    await expect(page.getByRole('link', { name: /Explore Free AFCAT Mocks/ })).toHaveAttribute('href', '/afcat');
    await page.goBack(); await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'CDS', exact: true }).click();
    await expect(page.getByRole('link', { name: 'English practice →', exact: true })).toHaveAttribute('href', /paper=english&exam=CDS/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
    const events = await page.evaluate(() => (window as unknown as { dataLayer?: IArguments[] }).dataLayer?.map(item => item[1]));
    expect(events).toContain('landing_view');
    expect(events).toContain('landing_exam_selection');
    await page.screenshot({ path: `../test-results/landing-${width}.png`, fullPage: true });
    await expect(page.getByRole('link', { name: 'Start Free Practice →', exact: true })).toHaveAttribute('href', /origin=home&paper=gs&exam=CDS/);
  });
}
