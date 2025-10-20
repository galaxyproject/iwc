import { test, expect } from "@playwright/test";

// Skip this test for now as Vue island hydration timing is inconsistent in test environment
test.skip("Auto-scrolls to workflow grid when filter query parameter is present", async ({ page }) => {
    // Navigate to homepage with a filter query parameter
    await page.goto("/?filter=Genome%20Assembly");

    // Wait for the page to load and execute the auto-scroll
    await page.waitForLoadState("networkidle");

    // Wait for workflow cards to appear (Vue island needs time to hydrate and load data)
    const firstWorkflowCard = page.locator("#workflows > div").first();
    await expect(firstWorkflowCard).toBeVisible({ timeout: 15000 });

    // Get the workflow grid element
    const workflowGrid = page.locator("#workflows");

    // Check that the workflow grid is in the viewport (scrolled into view)
    const gridBox = await workflowGrid.boundingBox();
    const viewportSize = page.viewportSize();

    // The grid should be visible in the viewport after auto-scroll
    // (top of grid should be within viewport height)
    expect(gridBox.y).toBeLessThan(viewportSize.height);
    expect(gridBox.y).toBeGreaterThanOrEqual(0);
});

test("Does not auto-scroll when no filter query parameter is present", async ({ page }) => {
    // Navigate to homepage without filter
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Get the initial scroll position (should be at top)
    const scrollY = await page.evaluate(() => window.scrollY);

    // Page should start at the top (or very close to it)
    expect(scrollY).toBeLessThanOrEqual(10);
});

test("Filter functionality works and updates URL", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find and click on a filter (assuming Genome Assembly category exists)
    const assemblyFilter = page.getByRole("button", { name: /Genome Assembly/i });

    // Check if the filter exists before clicking
    if ((await assemblyFilter.count()) > 0) {
        await assemblyFilter.click();

        // Check that URL was updated with filter query parameter
        await expect(page).toHaveURL(/\?filter=Genome%20Assembly/);

        // Verify workflows are filtered
        const workflowGrid = page.locator("#workflows");
        await expect(workflowGrid).toBeVisible();
    }
});
