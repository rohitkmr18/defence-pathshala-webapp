import { test, expect } from '@playwright/test';
for (const width of [320, 390, 1440]) {
  test(`landing at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crack the Pattern.Master the Exam.');
    const capf = page.getByRole('button', { name: 'CAPF AC', exact: true });
    await capf.focus(); await page.keyboard.press('Enter');
    await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('link', { name: 'Start CAPF AC Practice' })).toHaveAttribute('href', /exam=CAPF-AC/);
    await expect(page.getByRole('region', { name: 'Exam preparation' }).getByRole('link', { name: 'Decode PYQs' })).toHaveAttribute('href', /exam=CAPF-AC/);
    await page.reload(); await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'AFCAT', exact: true }).click();
    await expect(page.getByRole('link', { name: /Explore AFCAT Mocks/ })).toHaveAttribute('href', '/afcat');
    await expect(page.getByRole('region', { name: 'Exam preparation' }).getByRole('link')).toHaveCount(1);
    await page.goBack(); await expect(capf).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'CDS', exact: true }).click();
    const hero = page.getByRole('region', { name: 'Exam preparation' });
    await expect(hero.getByRole('link')).toHaveCount(2);
    await expect(hero.getByText('Built by Rohit · CAPF AC AIR 163 · IIT Kanpur · CDS ×4')).toBeVisible();
    const ca = page.getByRole('region', { name: 'Current Affairs That Actually Matter.' });
    await expect(ca.getByRole('link')).toHaveCount(3);
    await expect(ca.getByRole('link', { name: /Daily Current Affairs/ })).toHaveAttribute('href', '/current-affairs');
    await expect(ca.getByRole('link', { name: /Daily CA Quiz/ })).toHaveAttribute('href', /current-affairs\/2030-01-01#quiz/);
    await expect(ca.getByRole('link', { name: /Monthly CA Capsule/ })).toHaveAttribute('href', /current-affairs\/monthly\//);
    expect(await hero.evaluate(el => el.nextElementSibling?.getAttribute('aria-labelledby'))).toBe('home-current-affairs');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('script[src*="googletagmanager"]').count()).toBe(0);
    const events = await page.evaluate(() => (window as unknown as { dataLayer?: IArguments[] }).dataLayer?.map(item => item[1]));
    expect(events).toContain('landing_view');
    expect(events).toContain('landing_exam_selection');
    await page.screenshot({ path: `../test-results/landing-refined-${width}.png`, fullPage: true });
    await expect(page.getByRole('link', { name: 'Start CDS Practice', exact: true })).toHaveAttribute('href', /origin=home&paper=gs&exam=CDS/);
  });
}

test('daily quiz entry targets the rendered edition quiz', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('region', { name: 'Current Affairs That Actually Matter.' }).getByRole('link', { name: /Daily CA Quiz/ }).click();
  await expect(page).toHaveURL(/current-affairs\/2030-01-01#quiz/);
  await expect(page.locator('#quiz')).toBeVisible();
});
