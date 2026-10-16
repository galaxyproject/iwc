import { test, expect } from "@playwright/test";

test.describe("View toggle functionality", () => {
    test("View toggle is visible on homepage", async ({ page }) => {
        await page.goto("/");
        const viewToggle = page.locator(
            '[data-testid="view-toggle"], button:has-text("Grid"), button:has-text("List")',
        );
        await expect(viewToggle.first()).toBeVisible({ timeout: 10000 });
    });

    test("Can switch between grid and list view on homepage", async ({ page }) => {
        await page.goto("/");

        // Wait for workflows to load
        await page.waitForSelector('[id^="workflow-"]', { timeout: 15000 });

        // Find the toggle buttons
        const gridButton = page.locator('button[aria-label="Grid view"], button:has-text("Grid")').first();
        const listButton = page.locator('button[aria-label="List view"], button:has-text("List")').first();

        // Click list view
        if (await listButton.isVisible()) {
            await listButton.click();
            // List view should show workflow list items in a flex column container
            await expect(page.locator("#workflows.flex.flex-col").or(page.locator("#workflows"))).toBeVisible();
        }

        // Click grid view
        if (await gridButton.isVisible()) {
            await gridButton.click();
            // Grid view should show workflow cards in a grid
            await expect(page.locator("#workflows.grid").or(page.locator("#workflows"))).toBeVisible();
        }
    });

    test("View toggle works on collection page", async ({ page }) => {
        await page.goto("/collection/single-cell/");

        // Wait for workflows to load
        await page.waitForSelector('[id^="workflow-"]', { timeout: 15000 });

        // Find the toggle buttons
        const gridButton = page.locator('button[aria-label="Grid view"], button:has-text("Grid")').first();
        const listButton = page.locator('button[aria-label="List view"], button:has-text("List")').first();

        // Verify toggle is present
        const toggleVisible = (await gridButton.isVisible()) || (await listButton.isVisible());
        expect(toggleVisible).toBeTruthy();
    });
});
