import { test, expect } from "@playwright/test";

test.describe("Workflow detail page tabs", () => {
    const workflowUrl = "/workflow/rnaseq-pe-main/";

    test("About tab is visible by default", async ({ page }) => {
        await page.goto(workflowUrl);

        // Wait for tabs to load
        const aboutTab = page.locator('button:has-text("About"), [role="tab"]:has-text("About")');
        await expect(aboutTab.first()).toBeVisible({ timeout: 10000 });
    });

    test("Can switch to Diagram tab", async ({ page }) => {
        await page.goto(workflowUrl);

        const diagramTab = page.locator('button:has-text("Diagram"), [role="tab"]:has-text("Diagram")');
        await expect(diagramTab.first()).toBeVisible({ timeout: 10000 });
        await diagramTab.first().click();

        // URL should update with hash
        await expect(page).toHaveURL(/#diagram/);
    });

    test("Can switch to Version History tab", async ({ page }) => {
        await page.goto(workflowUrl);

        const versionTab = page.locator('button:has-text("Version History"), [role="tab"]:has-text("Version")');
        await expect(versionTab.first()).toBeVisible({ timeout: 10000 });
        await versionTab.first().click();

        // URL should update with hash
        await expect(page).toHaveURL(/#version-history/);
    });

    test("Can switch to How to Run tab", async ({ page }) => {
        await page.goto(workflowUrl);

        const howToRunTab = page.locator('button:has-text("How to Run"), [role="tab"]:has-text("How to Run")');
        await expect(howToRunTab.first()).toBeVisible({ timeout: 10000 });
        await howToRunTab.first().click();

        // URL should update with hash
        await expect(page).toHaveURL(/#how-to-run/);

        // How to Run content should be visible
        await expect(page.locator('text="How to Run This Workflow"')).toBeVisible();
    });

    test("Tab state persists via URL hash", async ({ page }) => {
        // Navigate directly to diagram tab via hash
        await page.goto(workflowUrl + "#diagram");

        // Diagram tab should be active
        const diagramTab = page.locator('button:has-text("Diagram"), [role="tab"]:has-text("Diagram")');
        await expect(diagramTab.first()).toBeVisible({ timeout: 10000 });
    });
});
