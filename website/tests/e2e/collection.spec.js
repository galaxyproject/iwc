import { test, expect } from "@playwright/test";

test("Collection page loads correctly", async ({ page }) => {
    await page.goto("/collection/single-cell/");
    await expect(page).toHaveTitle(/Single Cell/);
    await expect(page.locator("h1")).toContainText("Single Cell Workflows");
});

test("Collection page shows workflows", async ({ page }) => {
    await page.goto("/collection/single-cell/");

    // Wait for workflow cards to appear (Vue hydration + data load)
    const workflowCards = page.locator('[id^="workflow-"]');
    await expect(workflowCards.first()).toBeVisible({ timeout: 15000 });

    const count = await workflowCards.count();
    expect(count).toBeGreaterThan(0);
});

test("Collection page back link works", async ({ page }) => {
    await page.goto("/collection/single-cell/");

    const backLink = page.locator('a:has-text("Back")').first();
    if (await backLink.isVisible()) {
        await backLink.click();
        await expect(page).toHaveURL("/");
    }
});
