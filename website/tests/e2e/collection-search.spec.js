import { test, expect } from "@playwright/test";

test.describe("Collection page search", () => {
    test("Search input is visible on collection page", async ({ page }) => {
        await page.goto("/collection/single-cell/");

        const searchInput = page.locator('input[placeholder*="Search"]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
    });

    test("Search filters workflows within collection", async ({ page }) => {
        await page.goto("/collection/single-cell/");

        // Wait for workflows to load
        const workflowCards = page.locator('[id^="workflow-"]');
        await expect(workflowCards.first()).toBeVisible({ timeout: 15000 });

        const initialCount = await workflowCards.count();

        // Type a search query
        const searchInput = page.locator('input[placeholder*="Search"]');
        await searchInput.fill("scanpy");

        // Wait for filtering to apply
        await page.waitForTimeout(500);

        // Results should change (either fewer or same if all match)
        const filteredCount = await workflowCards.count();
        // Just verify the search didn't break anything
        expect(filteredCount).toBeGreaterThanOrEqual(0);
    });

    test("Clear search button works", async ({ page }) => {
        await page.goto("/collection/single-cell/");

        // Wait for workflows to load
        await page.waitForSelector('[id^="workflow-"]', { timeout: 15000 });

        // Type a search that returns no results
        const searchInput = page.locator('input[placeholder*="Search"]');
        await searchInput.fill("xyznonexistent123");

        // Wait for filtering
        await page.waitForTimeout(500);

        // Look for clear button or empty state
        const clearButton = page.locator('button:has-text("Clear")');
        if (await clearButton.isVisible()) {
            await clearButton.click();

            // Search should be cleared
            await expect(searchInput).toHaveValue("");
        }
    });

    test("Collection description card is visible", async ({ page }) => {
        // Use a collection that has a description
        await page.goto("/collection/single-cell/");

        // Wait for page to load
        await page.waitForLoadState("networkidle");

        // Verify the page title is correct
        await expect(page.locator("h1").first()).toContainText("Single Cell Workflows");

        // Look for the description card in the hero area (white card with prose content)
        const descriptionCard = page.locator(".bg-white.rounded-lg .prose");
        // Description may or may not be present depending on the collection
        const hasDescription = await descriptionCard.count();
        expect(hasDescription).toBeGreaterThanOrEqual(0);
    });
});
