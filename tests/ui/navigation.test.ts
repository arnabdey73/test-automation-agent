import { test, expect } from '@playwright/test';

test.describe('UI Tests - Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Test Automation Agent/);
  });

  test('should navigate to test suites page', async ({ page }) => {
    await page.click('text=Test Suites');
    await expect(page).toHaveURL('/tests');
    await expect(page.locator('h2')).toContainText('Test Suites');
  });

  test('should navigate to reports page', async ({ page }) => {
    await page.click('text=Reports');
    await expect(page).toHaveURL('/reports');
    await expect(page.locator('h2')).toContainText('Test Reports');
  });

  test('should navigate to config page', async ({ page }) => {
    await page.click('text=Configuration');
    await expect(page).toHaveURL('/config');
    await expect(page.locator('h2')).toContainText('Configuration');
  });
});
