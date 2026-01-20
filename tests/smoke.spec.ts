import { test, expect } from '@playwright/test';

test('Smoke Test: Home Page & Auth Entry', async ({ page }) => {
    // 1. Visit Home - Wait for DOM
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // 2. Validate Page Title and Branding (Broader Selector)
    // Using getByText to avoid role strictness issues during hydration
    await expect(page.getByText('Stylernow').first()).toBeVisible();

    // 3. Verify Auth Entry Points
    // Check for ANY login button
    const loginButton = page.getByRole('button', { name: /Ingresar/i }).first();
    await expect(loginButton).toBeVisible();
});
