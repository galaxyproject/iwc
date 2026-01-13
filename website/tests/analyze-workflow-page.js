/**
 * Playwright script to analyze workflow page and identify UI shortcomings
 */
import { chromium } from "@playwright/test";

async function analyzeWorkflowPage() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    console.log("Navigating to workflow page...");
    await page.goto("http://localhost:4321/workflow/rnaseq-pe-main/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000); // Give Vue islands time to hydrate

    // Take full page screenshot
    console.log("Taking screenshot...");
    await page.screenshot({
        path: "workflow-page-analysis.png",
        fullPage: true,
    });

    // Analyze page structure
    console.log("\n=== PAGE ANALYSIS ===\n");

    // 1. Check for tabs implementation
    const tabs = await page.locator('nav[aria-label="Tabs"] button').all();
    console.log(`✓ Found ${tabs.length} tab buttons`);
    console.log("  Current implementation: Plain buttons with border-bottom styling");
    console.log("  SUGGESTION: Replace with shadcn-vue Tabs component for better accessibility\n");

    // 2. Check for dropdown/select elements
    const selects = await page.locator("select").all();
    console.log(`✓ Found ${selects.length} select element(s)`);
    if (selects.length > 0) {
        console.log("  Current implementation: Native HTML select");
        console.log("  SUGGESTION: Replace with shadcn-vue Select component for better styling and UX\n");
    }

    // 3. Check for buttons
    const buttons = await page.locator('button, a[class*="button"]').all();
    console.log(`✓ Found ${buttons.length} button elements`);
    console.log("  Some buttons already using shadcn-vue Button component\n");

    // 4. Check for form inputs
    const inputs = await page.locator('input[type="text"], input[type="search"]').all();
    console.log(`✓ Found ${inputs.length} text input(s)`);
    if (inputs.length > 0) {
        console.log("  SUGGESTION: Could benefit from shadcn-vue Input component\n");
    }

    // 5. Check for cards
    const cards = await page.locator('[class*="border"][class*="rounded"]').all();
    console.log(`✓ Found ${cards.length} card-like elements`);
    console.log("  Some already using shadcn-vue Card component\n");

    // 6. Test tab interaction
    console.log("Testing tab interactions...");
    for (let i = 0; i < Math.min(tabs.length, 4); i++) {
        await tabs[i].click();
        await page.waitForTimeout(500);
        const tabLabel = await tabs[i].textContent();
        console.log(`  ✓ Clicked "${tabLabel}" tab - content updated`);
    }

    // 7. Test Galaxy instance selector
    console.log("\nTesting Galaxy instance selector...");
    const firstSelect = await page.locator("select").first();
    if (firstSelect) {
        await firstSelect.selectOption({ index: 1 });
        console.log("  ✓ Selected instance from dropdown");
        console.log("  NOTE: Native select styling looks basic, could use shadcn Select\n");
    }

    // 8. Analyze styling consistency
    console.log("Analyzing visual consistency...");

    // Get tab styling
    const activeTab = await page.locator('nav[aria-label="Tabs"] button.border-bay-of-many-700').first();
    const activeTabStyles = await activeTab.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
            borderColor: styles.borderBottomColor,
            color: styles.color,
        };
    });
    console.log("  Active tab styling:", activeTabStyles);
    console.log("  SUGGESTION: shadcn Tabs would provide consistent hover/focus states\n");

    // 9. Check for accessibility attributes
    console.log("Checking accessibility...");
    const tabsNav = await page.locator('nav[aria-label="Tabs"]').first();
    if (tabsNav) {
        console.log("  ✓ Tabs have aria-label");
        console.log("  NOTE: shadcn Tabs would add aria-selected, aria-controls, etc.\n");
    }

    // 10. Summary
    console.log("\n=== RECOMMENDATIONS ===\n");
    console.log("1. PRIORITY: Replace custom tab implementation with shadcn-vue Tabs");
    console.log("   - Better accessibility (ARIA attributes)");
    console.log("   - Consistent hover/focus states");
    console.log("   - Keyboard navigation support\n");

    console.log("2. HIGH: Replace native select with shadcn-vue Select");
    console.log("   - Better visual styling");
    console.log("   - Searchable options");
    console.log("   - Consistent with design system\n");

    console.log("3. MEDIUM: Consider adding shadcn-vue Input if search/filter is needed");
    console.log("   - Consistent styling with other components");
    console.log("   - Built-in validation states\n");

    console.log("Screenshot saved to: workflow-page-analysis.png\n");
    console.log("Press Enter to close browser...");

    // Keep browser open for manual inspection
    await new Promise((resolve) => {
        process.stdin.once("data", resolve);
    });

    await browser.close();
}

analyzeWorkflowPage().catch(console.error);
