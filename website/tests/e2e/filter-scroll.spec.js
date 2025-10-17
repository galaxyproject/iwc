import { test, expect } from "@playwright/test";

test("Auto-scrolls to workflow grid when filter query parameter is present", async ({ page }) => {
    // Navigate to homepage with a filter query parameter
    await page.goto("/?filter=Assembly");

    // Wait for the page to load and execute the auto-scroll
    await page.waitForLoadState("networkidle");

    // Get the workflow grid element
    const workflowGrid = page.locator("#workflows");
    await expect(workflowGrid).toBeVisible();

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

    // Find and click on a filter (assuming Assembly category exists)
    const assemblyFilter = page.getByRole("button", { name: /Assembly/i });

    // Check if the filter exists before clicking
    if (await assemblyFilter.count() > 0) {
        await assemblyFilter.click();

        // Check that URL was updated with filter query parameter
        await expect(page).toHaveURL(/\?filter=Assembly/);

        // Verify workflows are filtered
        const workflowGrid = page.locator("#workflows");
        await expect(workflowGrid).toBeVisible();
    }
});
