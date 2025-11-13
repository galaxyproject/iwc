import { test, expect } from "@playwright/test";

// Define default instances in one place to avoid duplication
// This should match the list in GalaxyInstanceSelector.vue
const DEFAULT_INSTANCES = [
    "https://usegalaxy.org",
    "https://usegalaxy.eu",
    "https://usegalaxy.org.au",
    "https://usegalaxy.fr",
    "https://test.galaxyproject.org",
    "https://galaxy.cfdeworkspace.org",
];

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
        await expect(combobox).toHaveValue(DEFAULT_INSTANCES[0]);

        // Verify Launch Workflow link uses default instance
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(DEFAULT_INSTANCES[0].replace(/[.]/g, "\\.")));
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
        await expect(combobox).toHaveValue(DEFAULT_INSTANCES[0]);

        // Verify Launch Workflow link updates
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(DEFAULT_INSTANCES[0].replace(/[.]/g, "\\.")));

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

        // Should have exactly as many options as default instances
        const allOptions = page.getByRole("option");
        await expect(allOptions).toHaveCount(DEFAULT_INSTANCES.length);

        // Check first few instances are visible (no need to scroll for these)
        // This verifies the dropdown is working without being too strict about scrolling
        for (const instance of DEFAULT_INSTANCES.slice(0, 3)) {
            const option = page.getByRole("option", { name: instance, exact: true });
            await expect(option).toBeVisible();
        }

        // Verify no delete buttons exist (all are default instances)
        const deleteButtons = page.getByRole("button", { name: /Delete custom instance/i });
        await expect(deleteButtons).toHaveCount(0);
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

    test("create button appears for localhost URLs", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });

        // Test with localhost URL
        const customUrl = "http://localhost:8080";

        // Click and type custom URL
        await combobox.click();
        await combobox.fill(customUrl);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Debug: take a screenshot to see what's happening
        await page.screenshot({ path: "test-results/localhost-test.png" });

        // Check if dropdown is visible
        const dropdown = page.locator('[role="listbox"]');
        await expect(dropdown).toBeVisible();

        // Should show create option
        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${customUrl}`) });
        await expect(createOption).toBeVisible();

        // Click to create
        await createOption.click();

        // Verify custom instance is selected
        await expect(combobox).toHaveValue(customUrl);
    });

    test("dropdown stays open when typing URL with no matches", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });

        // Test with URL that has no matches
        const partialUrl = "http:";

        // Click and type partial URL
        await combobox.click();
        await combobox.fill(partialUrl);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Check if dropdown is visible
        const dropdown = page.locator('[role="listbox"]');
        await expect(dropdown).toBeVisible();

        // Should show create option
        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${partialUrl}`) });
        await expect(createOption).toBeVisible();

        // Dropdown should still be open
        await expect(dropdown).toBeVisible();

        // We should have at least 1 option (the Create button)
        const allOptions = page.locator('[role="option"]');
        const optionCount = await allOptions.count();
        expect(optionCount).toBeGreaterThanOrEqual(1);
    });

    test("auto-prepends https:// to URLs without protocol", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const urlWithoutProtocol = "usegalaxy.org";
        const expectedUrl = "https://usegalaxy.org";

        // Click and type URL without protocol
        await combobox.click();
        await combobox.fill(urlWithoutProtocol);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Find any Create option (to see what's actually displayed)
        const createOption = page.getByRole("option", { name: /Create/i });
        await expect(createOption).toBeVisible();

        // Click create option
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify Launch Workflow link uses normalized URL (most important check)
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(expectedUrl));

        // Reload and verify the normalized URL persists
        await page.reload();
        await page.waitForLoadState("networkidle");

        // After reload, the combobox should have the normalized URL
        await expect(combobox).toHaveValue(expectedUrl);
    });

    test("auto-prepends http:// to localhost URLs", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const urlWithoutProtocol = "localhost:8080";
        const expectedUrl = "http://localhost:8080";

        // Click and type localhost URL without protocol
        await combobox.click();
        await combobox.fill(urlWithoutProtocol);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Find any Create option
        const createOption = page.getByRole("option", { name: /Create/i });
        await expect(createOption).toBeVisible();

        // Click create option
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify Launch Workflow link uses normalized URL (most important check)
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(expectedUrl.replace(/[.:]/g, "\\$&")));

        // Reload and verify the normalized URL persists
        await page.reload();
        await page.waitForLoadState("networkidle");

        // After reload, the combobox should have the normalized URL
        await expect(combobox).toHaveValue(expectedUrl);
    });

    test("auto-prepends http:// to 127.0.0.1 URLs", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const urlWithoutProtocol = "127.0.0.1:8080";
        const expectedUrl = "http://127.0.0.1:8080";

        // Click and type 127.0.0.1 URL without protocol
        await combobox.click();
        await combobox.fill(urlWithoutProtocol);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Find any Create option
        const createOption = page.getByRole("option", { name: /Create/i });
        await expect(createOption).toBeVisible();

        // Click create option
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify Launch Workflow link uses normalized URL (most important check)
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(expectedUrl.replace(/[.:]/g, "\\$&")));

        // Reload and verify the normalized URL persists
        await page.reload();
        await page.waitForLoadState("networkidle");

        // After reload, the combobox should have the normalized URL
        await expect(combobox).toHaveValue(expectedUrl);
    });

    test("preserves already valid URLs with https://", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const validUrl = "https://my-galaxy-instance.org";

        // Click and type valid URL with protocol
        await combobox.click();
        await combobox.fill(validUrl);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Click create option
        const createOption = page.getByRole("option", { name: new RegExp(`Create.*${validUrl}`) });
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify the URL was not changed
        await expect(combobox).toHaveValue(validUrl);

        // Verify Launch Workflow link uses the URL
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(validUrl));
    });

    test("trims whitespace from URLs", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const urlWithWhitespace = "  usegalaxy.org  ";
        const expectedUrl = "https://usegalaxy.org";

        // Click and type URL with whitespace
        await combobox.click();
        await combobox.fill(urlWithWhitespace);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Find any Create option
        const createOption = page.getByRole("option", { name: /Create/i });
        await expect(createOption).toBeVisible();

        // Click create option
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify Launch Workflow link uses normalized URL (most important check)
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(expectedUrl));

        // Reload and verify the normalized URL persists
        await page.reload();
        await page.waitForLoadState("networkidle");

        // After reload, the combobox should have the normalized URL
        await expect(combobox).toHaveValue(expectedUrl);
    });

    test("handles URLs without protocol in subdomain format", async ({ page }) => {
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        const urlWithoutProtocol = "galaxy.example.com";
        const expectedUrl = "https://galaxy.example.com";

        // Click and type URL without protocol
        await combobox.click();
        await combobox.fill(urlWithoutProtocol);

        // Wait for dropdown to update
        await page.waitForTimeout(500);

        // Find any Create option
        const createOption = page.getByRole("option", { name: /Create/i });
        await expect(createOption).toBeVisible();

        // Click create option
        await createOption.click();

        // Wait for normalization to occur
        await page.waitForTimeout(500);

        // Verify Launch Workflow link uses normalized URL (most important check)
        const runWorkflowLink = page.getByRole("link", { name: /Launch Workflow/i });
        await expect(runWorkflowLink).toHaveAttribute("href", new RegExp(expectedUrl));

        // Reload and verify the normalized URL persists
        await page.reload();
        await page.waitForLoadState("networkidle");

        // After reload, the combobox should have the normalized URL
        await expect(combobox).toHaveValue(expectedUrl);
    });

    test("Try with Example Data button makes API call to create landing page", async ({ page }) => {
        // Set up API route interception
        let apiCallMade = false;
        let requestBody = null;

        await page.route("**/api/workflow_landings", async (route) => {
            apiCallMade = true;
            requestBody = route.request().postDataJSON();

            // Mock successful response
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ uuid: "test-uuid-12345" }),
            });
        });

        // Navigate to workflow page
        await page.goto("/workflow/rnaseq-pe-main/");
        await page.waitForLoadState("networkidle");

        // Select a Galaxy instance (default should be selected)
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        await expect(combobox).toHaveValue(DEFAULT_INSTANCES[0]);

        // Find and click the "Try with Example Data" button
        const exampleDataButton = page.getByRole("button", { name: /Try with Example Data/i }).first();
        await expect(exampleDataButton).toBeVisible();

        // Set up window.open spy to prevent actual window opening
        await page.evaluate(() => {
            window.open = () => null;
        });

        await exampleDataButton.click();

        // Wait a bit for the API call to complete
        await page.waitForTimeout(1000);

        // Verify API call was made
        expect(apiCallMade).toBe(true);

        // Verify request body contains expected fields
        expect(requestBody).toBeTruthy();
        expect(requestBody.workflow_target_type).toBe("trs_url");
        expect(requestBody.workflow_id).toContain("dockstore.org");
        expect(requestBody.public).toBe(true);
        expect(requestBody.request_state).toBeDefined();
    });

    test("Try with Example Data button handles API errors gracefully", async ({ page }) => {
        // Set up API route to return error BEFORE navigation
        await page.route("**/api/workflow_landings", async (route) => {
            await route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({ error: "Server error" }),
            });
        });

        // Navigate to workflow page
        await page.goto("/workflow/rnaseq-pe-main/");
        await page.waitForLoadState("networkidle");

        // Ensure default instance is selected
        const combobox = page.getByRole("combobox", { name: /Select or type a Galaxy/i });
        await expect(combobox).toHaveValue(DEFAULT_INSTANCES[0]);

        // Set up dialog handler to capture alert
        const dialogPromise = page.waitForEvent("dialog");

        // Find and click the "Try with Example Data" button
        const exampleDataButton = page.getByRole("button", { name: /Try with Example Data/i }).first();
        await exampleDataButton.click();

        // Wait for and verify the error alert
        const dialog = await dialogPromise;
        expect(dialog.message()).toContain("Failed to create landing page");
        await dialog.accept();
    });
});
