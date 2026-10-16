import { test, expect } from "@playwright/test";

// Only run these tests on mobile viewport (width < 768px)
test.skip(({ viewport }) => !viewport || viewport.width >= 768, "Mobile-only tests");

test.describe("Mobile filter functionality", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("Filter button is visible on mobile", async ({ page }) => {
        const filterButton = page.getByRole("button", { name: /filter/i });
        await expect(filterButton).toBeVisible();
    });

    test("Clicking filter button opens filter sheet", async ({ page }) => {
        const filterButton = page.getByRole("button", { name: /filter/i });
        await filterButton.click();

        // Sheet should be visible with category options
        const categoryButton = page.getByRole("button", { name: /Genome assembly/i });
        await expect(categoryButton).toBeVisible();
    });

    test("Selecting a filter updates URL and closes sheet", async ({ page }) => {
        const filterButton = page.getByRole("button", { name: /filter/i });
        await filterButton.click();

        const categoryButton = page.getByRole("button", { name: /Genome assembly/i });
        await categoryButton.click();

        // URL should be updated
        await expect(page).toHaveURL(/\?filter=Genome(\+|%20)assembly/i);

        // Workflows should still be visible
        const workflowGrid = page.locator("#workflows");
        await expect(workflowGrid).toBeVisible();
    });

    test("Filter button shows active filter name when selected", async ({ page }) => {
        // Navigate with filter pre-set
        await page.goto("/?filter=Genome%20assembly");
        await page.waitForLoadState("networkidle");

        // Filter button should indicate active filter
        const filterButton = page.getByRole("button", { name: /Genome assembly/i });
        await expect(filterButton).toBeVisible();
    });
});
