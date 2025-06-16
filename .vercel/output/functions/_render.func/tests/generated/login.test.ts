import { test, expect } from '@playwright/test';

/**
 * Login page test suite
 * Generated from login-spec.json
 */

// Test successful login with valid credentials
test('successful login with valid credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');
  
  // Verify we're on the login page
  await expect(page.locator('h1:has-text("Login")')).toBeVisible();
  
  // Enter valid username
  await page.fill('input[name="username"]', 'testuser@example.com');
  
  // Enter valid password
  await page.fill('input[name="password"]', 'Password123!');
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Verify redirection to dashboard
  await expect(page).toHaveURL(/dashboard/);
  
  // Verify user's name is visible in header
  await expect(page.locator('header')).toContainText('Test User');
});

// Test failed login with invalid credentials
test('failed login with invalid credentials', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');
  
  // Verify we're on the login page
  await expect(page.locator('h1:has-text("Login")')).toBeVisible();
  
  // Enter invalid username
  await page.fill('input[name="username"]', 'invalid@example.com');
  
  // Enter invalid password
  await page.fill('input[name="password"]', 'wrongpassword');
  
  // Click the login button
  await page.click('button[type="submit"]');
  
  // Verify error message is displayed
  await expect(page.locator('.error-message')).toBeVisible();
  await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  
  // Verify user remains on login page
  await expect(page).toHaveURL(/login/);
});

// Test password reset
test('password reset functionality', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');
  
  // Click on forgot password link
  await page.click('text=Forgot Password?');
  
  // Verify we're on the reset password page
  await expect(page).toHaveURL(/reset-password/);
  
  // Enter email for password reset
  await page.fill('input[type="email"]', 'testuser@example.com');
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Verify success message
  await expect(page.locator('.success-message')).toBeVisible();
  await expect(page.locator('.success-message')).toContainText('password reset instructions');
});
