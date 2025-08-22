import { test, expect } from "@playwright/test";

test("Homepage loads correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Intergalactic Workflow Commission/);
    await expect(page.locator("body")).toContainText("Galaxy IWC - Workflow Library");
});

test("Individual workflow page loads correctly", async ({ page }) => {
    // Navigate to one of the workflow detail pages instead of /workflow
    await page.goto("/workflow/rnaseq-pe-main/");
    await expect(page).toHaveTitle(/RNA-Seq/);
    await expect(page.locator("body")).toContainText("RNA-Seq");
});
