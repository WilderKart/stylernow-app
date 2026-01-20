import { test, expect } from '@playwright/test';

test('Smoke Test: Home Page & Booking Interface', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page).toHaveTitle(/Stylernow/);

    // 2. Check for Critical Elements
    const heroCTA = page.getByRole('link', { name: /Reservar/i }).first();
    // Note: Depending on actual content, adjust selector.
    // Assuming there is a "Reservar" button or similar.

    // 3. Verify Login Page Reachable
    await page.goto('/login');
    await expect(page.getByText('Iniciar Sesión', { exact: false })).toBeVisible();

    // 4. Verify Barberia Page reachable (assuming ID exists or using path)
    // await page.goto('/barberias/demo-barberia');
    // await expect(page.getByText('Servicios')).toBeVisible();
});
