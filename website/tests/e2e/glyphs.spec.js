import { test, expect } from "@playwright/test";

const WORKFLOW_ID = "chipseq-pe-main";

test.describe("Workflow glyphs", () => {
    test("glyph.svg is a standalone SVG with a camelCase viewBox", async ({ request }) => {
        const response = await request.get(`/workflow/${WORKFLOW_ID}/glyph.svg`);
        expect(response.ok()).toBeTruthy();
        expect(response.headers()["content-type"]).toContain("image/svg+xml");
        const body = await response.text();
        // Vue SSR lowercases viewBox on the root element; XML is case-sensitive.
        expect(body).toMatch(/^<svg[^>]* viewBox="0 0 100 100"/);
        expect(body).not.toContain("viewbox=");
        expect(body).not.toContain("<!--");
    });

    test("workflow page shows its glyph", async ({ page }) => {
        await page.goto(`/workflow/${WORKFLOW_ID}/`);
        const glyph = page.locator(`a[href="/glyphs"] img[src="/workflow/${WORKFLOW_ID}/glyph.svg"]`);
        await expect(glyph).toBeVisible();
        await expect.poll(() => glyph.evaluate((img) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
    });

    test("explainer page renders every workflow", async ({ page }) => {
        await page.goto("/glyphs");
        await expect(page.getByRole("heading", { name: "Reading workflow glyphs" })).toBeVisible();
        await expect(page.getByRole("heading", { name: "Every workflow" })).toBeVisible();
        await expect(page.locator(`a[href="/workflow/${WORKFLOW_ID}/"] img`)).toHaveCount(1);
    });
});
