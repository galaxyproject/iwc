import { test, expect } from "@playwright/test";

test.describe("Search functionality", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        // Wait for search index to load
        await page.locator("#workflows").waitFor({ state: "visible", timeout: 15000 });
    });

    test("Search input is visible on homepage", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");
        await expect(searchInput).toBeVisible();
    });

    test("Typing in search updates URL with query parameter", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("RNA");

        // Wait for debounced URL update (300ms + buffer)
        await page.waitForTimeout(500);

        await expect(page).toHaveURL(/\?q=RNA/);
    });

    test("Search filters workflows and shows results count", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("RNA");

        // Wait for search to apply
        await page.waitForTimeout(300);

        // Should show "Found X workflows" text
        const resultsText = page.locator("text=/Found \\d+ workflows/");
        await expect(resultsText).toBeVisible();

        // Workflows should still be visible
        const workflowGrid = page.locator("#workflows");
        await expect(workflowGrid).toBeVisible();
    });

    test("Hero collapses when search is active", async ({ page }) => {
        // Initially, popular workflows section should be visible
        const popularHeading = page.locator("text=Get started with one of our most popular workflows");
        await expect(popularHeading).toBeVisible();

        // Type in search
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("test");

        // Wait for transition
        await page.waitForTimeout(400);

        // Popular workflows should be hidden
        await expect(popularHeading).not.toBeVisible();

        // Compact header should be visible
        const compactHeader = page.locator("text=Search IWC Workflows");
        await expect(compactHeader).toBeVisible();
    });

    test("Clearing search restores hero", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");

        // Type and then clear
        await searchInput.fill("RNA");
        await page.waitForTimeout(400);

        await searchInput.clear();
        await page.waitForTimeout(400);

        // Popular workflows should be visible again
        const popularHeading = page.locator("text=Get started with one of our most popular workflows");
        await expect(popularHeading).toBeVisible();

        // URL should not have query parameter
        await expect(page).not.toHaveURL(/\?q=/);
    });

    test("URL with ?q= parameter pre-populates search", async ({ page }) => {
        // Navigate with search query
        await page.goto("/?q=ChIP");
        await page.waitForLoadState("networkidle");

        // Search input should have the value
        const searchInput = page.getByPlaceholder("Search workflows");
        await expect(searchInput).toHaveValue("ChIP");

        // Results should be filtered
        const resultsText = page.locator("text=/Found \\d+ workflows/");
        await expect(resultsText).toBeVisible({ timeout: 10000 });
    });

    test("Search finds workflows by annotation content", async ({ page }) => {
        // Search for "RNA-seq" which appears in lncRNAs annotation
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("RNA-seq");

        await page.waitForTimeout(300);

        // Should find workflows (lncRNAs annotation mentions RNA-seq)
        const workflowItems = page.locator("#workflows > div");
        const count = await workflowItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test("Search finds workflows by collection name", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("Single Cell");

        await page.waitForTimeout(300);

        // Should find workflows in Single Cell collection
        const workflowItems = page.locator("#workflows > div");
        const count = await workflowItems.count();
        expect(count).toBeGreaterThan(0);
    });

    test("Search with no results shows empty state", async ({ page }) => {
        const searchInput = page.getByPlaceholder("Search workflows");
        await searchInput.fill("xyznonexistent123");

        await page.waitForTimeout(300);

        // Should show no results message
        const noResults = page.locator("text=No workflows found matching your criteria");
        await expect(noResults).toBeVisible();
    });

    test("Search combined with filter shows correct count", async ({ page }) => {
        // First apply a filter
        const assemblyFilter = page.getByRole("button", { name: /Genome Assembly/i });
        if ((await assemblyFilter.count()) > 0) {
            await assemblyFilter.click();
            await page.waitForTimeout(300);

            // Then search
            const searchInput = page.getByPlaceholder("Search workflows");
            await searchInput.fill("annotation");

            await page.waitForTimeout(300);

            // Should show category-specific results text
            const resultsText = page.locator("text=/Found \\d+.*Genome Assembly.*workflows/");
            await expect(resultsText).toBeVisible();
        }
    });
});
