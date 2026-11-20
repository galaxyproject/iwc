import { test, expect } from "@playwright/test";

// The chip bar is shown from the md breakpoint up; phones use the filter sheet.
test.skip(({ viewport }) => !viewport || viewport.width < 768, "Desktop-only tests");

test.describe("Category chip bar", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
        await page.locator("#workflows").waitFor({ state: "visible", timeout: 15000 });
    });

    test("Every category sits above the workflow list", async ({ page }) => {
        const chips = page.getByRole("navigation", { name: "Categories" }).getByRole("button");
        // "All" plus at least one category
        expect(await chips.count()).toBeGreaterThan(1);

        const list = await page.locator("#workflows").boundingBox();
        for (const chip of await chips.all()) {
            const box = await chip.boundingBox();
            expect(box.y + box.height).toBeLessThanOrEqual(list.y);
        }
    });

    test("All chip clears the selected category", async ({ page }) => {
        const bar = page.getByRole("navigation", { name: "Categories" });
        const category = bar.getByRole("button").nth(1);
        const all = bar.getByRole("button", { name: /^All\b/ });

        await category.click();
        await expect(page).toHaveURL(/\?filter=/);
        await expect(category).toHaveAttribute("aria-pressed", "true");
        await expect(all).toHaveAttribute("aria-pressed", "false");

        await all.click();
        await expect(page).not.toHaveURL(/\?filter=/);
        await expect(all).toHaveAttribute("aria-pressed", "true");
    });

    test("Categories stay in reach deep in the list", async ({ page }) => {
        const bar = page.getByRole("navigation", { name: "Categories" });
        const lastCategory = bar.getByRole("button").last();
        const expand = page.getByRole("button", { name: "All categories" });

        const deepItem = page.locator("#workflows > div").nth(20);
        const pagePosition = () => deepItem.evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
        const positionAtRest = await pagePosition();

        // Not offered until the list has scrolled under the pinned toolbar
        await expect(expand).toBeHidden();
        await deepItem.scrollIntoViewIfNeeded();

        // The bar is pinned and folded to one row, without moving the list
        await expect(bar).toBeInViewport();
        await expect(expand).toBeVisible();
        await expect(lastCategory).not.toBeInViewport();
        expect(await pagePosition()).toBeCloseTo(positionAtRest, 0);

        // The rest is behind the toggle
        await expand.click();
        await expect(lastCategory).toBeInViewport();

        // Picking a category brings the first result back below the toolbar
        await lastCategory.click();
        await expect(page).toHaveURL(/\?filter=/);
        const firstResult = page.locator("#workflows > div").first();
        await expect(firstResult).toBeInViewport();
        const barBox = await bar.boundingBox();
        const resultBox = await firstResult.boundingBox();
        expect(resultBox.y).toBeGreaterThanOrEqual(barBox.y + barBox.height);
    });
});
