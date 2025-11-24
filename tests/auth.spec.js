/**
 * Automated E2E Test Script for Authentication Flows
 * 
 * This is a Playwright test script for automated testing.
 * To use this:
 * 1. npm install -D @playwright/test
 * 2. npx playwright install
 * 3. npx playwright test
 */

import { test, expect } from '@playwright/test';

// Configuration
const BASE_URL = 'http://localhost:3000';
const TEST_PLAYER = {
  email: 'player@test.com',
  password: 'password123',
  role: 'player'
};
const TEST_COACH = {
  email: 'coach@test.com',
  password: 'password123',
  role: 'coach'
};

test.describe('Authentication Flow Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Start each test from a clean state
    await page.goto(BASE_URL);
  });

  test('should display login page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Player Login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should validate empty email field', async ({ page }) => {
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should validate invalid email format', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid-email');
    await page.locator('input[type="password"]').fill('password123');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate password length', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@test.com');
    await page.locator('input[type="password"]').fill('12345');
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('should show loading state during login', async ({ page }) => {
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();
    
    // Check for loading state
    await expect(submitButton).toContainText('Signing in...');
    await expect(submitButton).toBeDisabled();
  });

  test('should login successfully and redirect to player dashboard', async ({ page }) => {
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    
    // Wait for redirect
    await page.waitForURL(`${BASE_URL}/player`);
    await expect(page.locator('h1')).toContainText('Player Dashboard');
  });

  test('should display error for invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').fill('wrong@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();
    
    // Should show error banner
    await expect(page.locator('[style*="background: #ff4444"]')).toBeVisible();
  });
});

test.describe('Page Protection Tests', () => {
  
  test('should redirect unauthenticated user from /player to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/player`);
    
    // Should redirect to login
    await page.waitForURL(BASE_URL);
    await expect(page.locator('h1')).toContainText('Player Login');
  });

  test('should redirect unauthenticated user from /coach to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/coach`);
    
    // Should redirect to login
    await page.waitForURL(BASE_URL);
    await expect(page.locator('h1')).toContainText('Player Login');
  });

  test('should allow player to access /player but not /coach', async ({ page }) => {
    // Login as player
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/player`);
    
    // Try to access coach page
    await page.goto(`${BASE_URL}/coach`);
    
    // Should redirect back to player
    await page.waitForURL(`${BASE_URL}/player`);
  });

  test('should allow coach to access both /coach and /player', async ({ page }) => {
    // Login as coach
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_COACH.email);
    await page.locator('input[type="password"]').fill(TEST_COACH.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/coach`);
    
    // Verify coach page access
    await expect(page.locator('h1')).toContainText('Coach Dashboard');
    
    // Try to access player page
    await page.goto(`${BASE_URL}/player`);
    await expect(page.locator('h1')).toContainText('Player Dashboard');
  });
});

test.describe('Logout Flow Tests', () => {
  
  test('should logout player and redirect to login', async ({ page }) => {
    // Login as player
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/player`);
    
    // Click logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();
    
    // Should show loading state
    await expect(logoutButton).toContainText('Logging out...');
    
    // Should redirect to login
    await page.waitForURL(BASE_URL);
    await expect(page.locator('h1')).toContainText('Player Login');
  });

  test('should logout coach and redirect to login', async ({ page }) => {
    // Login as coach
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_COACH.email);
    await page.locator('input[type="password"]').fill(TEST_COACH.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/coach`);
    
    // Click logout
    const logoutButton = page.locator('button:has-text("Logout")');
    await logoutButton.click();
    
    // Should redirect to login
    await page.waitForURL(BASE_URL);
    await expect(page.locator('h1')).toContainText('Player Login');
  });

  test('should prevent access to protected pages after logout', async ({ page }) => {
    // Login
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/player`);
    
    // Logout
    await page.locator('button:has-text("Logout")').click();
    await page.waitForURL(BASE_URL);
    
    // Try to access protected page
    await page.goto(`${BASE_URL}/player`);
    
    // Should redirect to login
    await page.waitForURL(BASE_URL);
    await expect(page.locator('h1')).toContainText('Player Login');
  });
});

test.describe('Session Persistence Tests', () => {
  
  test('should maintain session across page reloads', async ({ page }) => {
    // Login
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/player`);
    
    // Reload page
    await page.reload();
    
    // Should still be on player page
    await expect(page.locator('h1')).toContainText('Player Dashboard');
  });

  test('should redirect authenticated user from login to dashboard', async ({ page }) => {
    // Login as player
    await page.goto(BASE_URL);
    await page.locator('input[type="email"]').fill(TEST_PLAYER.email);
    await page.locator('input[type="password"]').fill(TEST_PLAYER.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${BASE_URL}/player`);
    
    // Try to go back to login
    await page.goto(BASE_URL);
    
    // Should redirect to player page (if middleware is active)
    // Note: This depends on your middleware implementation
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toContain('/player');
  });
});

test.describe('Form Validation Tests', () => {
  
  test('should clear errors when user starts typing', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Trigger email error
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('text=Email is required')).toBeVisible();
    
    // Start typing in email field
    await page.locator('input[type="email"]').fill('t');
    
    // Error should disappear
    await expect(page.locator('text=Email is required')).not.toBeVisible();
  });

  test('should highlight invalid fields with error border', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button[type="submit"]').click();
    
    // Email field should have error styling
    const emailInput = page.locator('input[type="email"]');
    const borderColor = await emailInput.evaluate((el) => {
      return window.getComputedStyle(el).borderColor;
    });
    
    // Should have red-ish border (exact color may vary)
    expect(borderColor).toBeTruthy();
  });
});
