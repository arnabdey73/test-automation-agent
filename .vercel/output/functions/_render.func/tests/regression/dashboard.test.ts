import { test, expect } from '@playwright/test';

test.describe('Regression Tests - Dashboard Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display correct total tests count', async ({ page }) => {
    const totalTests = await page.locator(':text("Total Tests")').locator('xpath=../..').locator('text=60');
    await expect(totalTests).toBeVisible();
  });

  test('should display correct passing tests count', async ({ page }) => {
    const passingTests = await page.locator(':text("Passing")').locator('xpath=../..').locator('text=55');
    await expect(passingTests).toBeVisible();
  });

  test('should display correct failing tests count', async ({ page }) => {
    const failingTests = await page.locator(':text("Failing")').locator('xpath=../..').locator('text=4');
    await expect(failingTests).toBeVisible();
  });

  test('should have run buttons for each test suite', async ({ page }) => {
    const runButtons = page.locator('button:text("Run Suite")');
    await expect(runButtons).toHaveCount(2);
  });
});
