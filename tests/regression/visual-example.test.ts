import { test, expect } from '@playwright/test';

// Visual regression test for the dashboard
test('dashboard visual regression', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('/');
  
  // Wait for the content to be fully loaded
  await page.waitForSelector('.dashboard-content', { state: 'visible' });
  
  // Take a screenshot for visual comparison
  await page.screenshot({
    path: './test-artifacts/dashboard-full.png',
    fullPage: true
  });
  
  // Test specific components for visual regression
  
  // Header section
  await expect(page.locator('header')).toBeVisible();
  await page.locator('header').screenshot({
    path: './test-artifacts/dashboard-header.png'
  });
  
  // Test summary card
  await expect(page.locator('.test-summary-card')).toBeVisible();
  await page.locator('.test-summary-card').screenshot({
    path: './test-artifacts/dashboard-test-summary.png'
  });
  
  // Recent test runs table
  await expect(page.locator('.recent-test-runs')).toBeVisible();
  await page.locator('.recent-test-runs').screenshot({
    path: './test-artifacts/dashboard-recent-runs.png'
  });
});

// Visual regression test for the test suites page
test('test suites page visual regression', async ({ page }) => {
  // Navigate to the test suites page
  await page.goto('/tests');
  
  // Wait for content to be visible
  await page.waitForSelector('.test-suites-list', { state: 'visible' });
  
  // Take a screenshot of the entire page
  await page.screenshot({
    path: './test-artifacts/test-suites-full.png',
    fullPage: true
  });
  
  // Test specific components
  
  // Test suite cards
  await expect(page.locator('.test-suite-card')).toBeVisible();
  await page.locator('.test-suite-card').first().screenshot({
    path: './test-artifacts/test-suite-card.png'
  });
});
