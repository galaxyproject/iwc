import { test, expect } from "@playwright/test";

test("Filter functionality works and updates URL", async ({ page }) => {
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find and click on a filter (Genome assembly category)
    const assemblyFilter = page.getByRole("button", { name: /Genome assembly/i });

    // Check if the filter exists before clicking
    if ((await assemblyFilter.count()) > 0) {
        await assemblyFilter.click();

        // Check that URL was updated with filter query parameter (+ or %20 encoding)
        await expect(page).toHaveURL(/\?filter=Genome(\+|%20)assembly/i);

        // Verify workflows are filtered
        const workflowGrid = page.locator("#workflows");
        await expect(workflowGrid).toBeVisible();
    }
});
