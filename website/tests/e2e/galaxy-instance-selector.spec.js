import { test, expect } from "@playwright/test";

test.describe("Galaxy Instance Selector", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to a workflow page where the selector is present
        await page.goto("/workflow/rnaseq-pe-main/");
        await page.waitForLoadState("networkidle");

        // Clear localStorage to start with a clean state
        await page.evaluate(() => {
            localStorage.removeItem("galaxy-custom-instances");
            localStorage.removeItem("galaxy-selected-instance");
        });

        // Reload to apply clean state
        await page.reload();
        await page.waitForLoadState("networkidle");
    });

    test("displays default Galaxy instance on load", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        await expect(combobox).toHaveValue("https://usegalaxy.org");

        // Verify Launch Workflow link uses default instance
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", /https:\/\/usegalaxy\.org/);
    });

    test("can search and select existing Galaxy instance", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });

        // Click to open dropdown and type to search
        await combobox.click();
        await combobox.fill("eu");

        // Wait for dropdown to show filtered results
        await page.waitForTimeout(500);

        // Should show only the EU instance
        const euOption = page.getByRole("option", { name: "https://usegalaxy.eu" });
        await expect(euOption).toBeVisible();

        // Click to select
        await euOption.click();

        // Verify selection
        await expect(combobox).toHaveValue("https://usegalaxy.eu");

        // Verify Launch Workflow link updates
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", /https:\/\/usegalaxy\.eu/);
    });

    test("can create custom Galaxy instance", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const customUrl = "https://my-test-galaxy.org";

        // Click and type custom URL
        await combobox.click();
        await combobox.fill(customUrl);

        // Wait for "Create" option to appear
        await page.waitForTimeout(500);

        // Should show create option
        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${customUrl}`) });
        await expect(createOption).toBeVisible();

        // Click to create
        await createOption.click();

        // Verify custom instance is selected
        await expect(combobox).toHaveValue(customUrl);

        // Verify Launch Workflow link uses custom instance
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(customUrl));
    });

    test("custom instance persists and shows delete button", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const customUrl = "https://persistent-galaxy.org";

        // Create custom instance
        await combobox.click();
        await combobox.fill(customUrl);
        await page.waitForTimeout(500);

        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${customUrl}`) });
        await createOption.click();

        // Clear the input to see all instances
        await combobox.click();
        await combobox.fill("");
        await page.waitForTimeout(500);

        // Custom instance should appear in list with delete button
        const customOption = page.getByRole("option", { name: new RegExp(customUrl) });
        await expect(customOption).toBeVisible();

        // Should have delete button
        const deleteButton = page.getByRole("button", { name: /Delete custom instance/i });
        await expect(deleteButton).toBeVisible();

        // Close dropdown
        await page.keyboard.press("Escape");

        // Reload page to verify persistence
        await page.reload();
        await page.waitForLoadState("networkidle");

        // Custom instance should still be selected
        await expect(combobox).toHaveValue(customUrl);
    });

    test("can delete custom instance", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const customUrl = "https://delete-me-galaxy.org";

        // Create custom instance
        await combobox.click();
        await combobox.fill(customUrl);
        await page.waitForTimeout(500);

        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${customUrl}`) });
        await createOption.click();

        // Verify custom instance is selected
        await expect(combobox).toHaveValue(customUrl);

        // Open dropdown to show all instances
        await combobox.click();
        await combobox.fill("");
        await page.waitForTimeout(500);

        // Click delete button
        const deleteButton = page.getByRole("button", { name: /Delete custom instance/i });
        await deleteButton.click();

        // Should revert to default instance
        await expect(combobox).toHaveValue("https://usegalaxy.org");

        // Verify Launch Workflow link updates
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", /https:\/\/usegalaxy\.org/);

        // Open dropdown again to verify custom instance is gone
        await combobox.click();
        await combobox.fill("");
        await page.waitForTimeout(500);

        // Custom instance should not be in the list
        const customOption = page.getByRole("option", { name: customUrl, exact: true });
        await expect(customOption).not.toBeVisible();
    });

    test("default instances do not have delete button", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });

        // Open dropdown
        await combobox.click();
        await combobox.fill("");
        await page.waitForTimeout(500);

        // Check that default instances are visible
        const defaultInstances = [
            "https://usegalaxy.org",
            "https://usegalaxy.eu",
            "https://usegalaxy.org.au",
            "https://usegalaxy.fr",
            "https://test.galaxyproject.org",
        ];

        for (const instance of defaultInstances) {
            const option = page.getByRole("option", { name: instance, exact: true });
            await expect(option).toBeVisible();
        }

        // Should be exactly 5 default instances, no delete buttons yet
        const allOptions = page.getByRole("option");
        await expect(allOptions).toHaveCount(5);
    });

    test("can switch between multiple custom instances", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const customUrl1 = "https://custom1.org";
        const customUrl2 = "https://custom2.org";

        // Create first custom instance
        await combobox.click();
        await combobox.fill(customUrl1);
        await page.waitForTimeout(500);
        await page.getByRole("option", { name: new RegExp(`Create.*${customUrl1}`) }).click();
        await expect(combobox).toHaveValue(customUrl1);

        // Create second custom instance
        await combobox.click();
        await combobox.fill(customUrl2);
        await page.waitForTimeout(500);
        await page.getByRole("option", { name: new RegExp(`Create.*${customUrl2}`) }).click();
        await expect(combobox).toHaveValue(customUrl2);

        // Switch back to first custom instance
        await combobox.click();
        await combobox.fill("");
        await page.waitForTimeout(500);
        await page.getByRole("option", { name: customUrl1, exact: false }).click();
        await expect(combobox).toHaveValue(customUrl1);

        // Verify Launch Workflow link updates
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(customUrl1));
    });

    test("create button appears for URLs that don't match any instances", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });

        // Test with a URL that starts similar to an existing instance but doesn't match
        const customUrl = "https://usegalaxy.org.foo";

        // Click and type custom URL
        await combobox.click();
        await combobox.fill(customUrl);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Should show create option even though it starts with "https://usegalaxy.org"
        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${customUrl}`) });
        await expect(createOption).toBeVisible();

        // Click to create
        await createOption.click();

        // Verify custom instance is selected
        await expect(combobox).toHaveValue(customUrl);
    });
});
