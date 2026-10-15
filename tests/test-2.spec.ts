import { test, expect } from '@playwright/test';

test('verify playwright documentation homepage and navigation', async ({ page }) => {
  await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Playwright/);

  const getStartedBtn = page.getByRole('link', { name: 'Get started' });
  await expect(getStartedBtn).toBeVisible();
});