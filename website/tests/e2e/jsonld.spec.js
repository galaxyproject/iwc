import { test, expect } from "@playwright/test";

test.describe("JSON-LD structured data", () => {
    test("Workflow page includes valid JSON-LD", async ({ page }) => {
        // Navigate to a workflow page
        await page.goto("/workflow/rnaseq-sr-main/");

        // Extract JSON-LD from the page
        const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();

        // Verify JSON-LD exists
        expect(jsonLdScript).toBeTruthy();

        // Parse JSON-LD
        const jsonLd = JSON.parse(jsonLdScript);

        // Verify Schema.org context
        expect(jsonLd["@context"]).toBe("https://schema.org");

        // Verify type includes both SoftwareSourceCode and ComputationalWorkflow
        expect(jsonLd["@type"]).toEqual(expect.arrayContaining(["SoftwareSourceCode", "ComputationalWorkflow"]));

        // Verify required fields exist
        expect(jsonLd.name).toBeTruthy();
        expect(jsonLd.description).toBeTruthy();
        expect(jsonLd.url).toBeTruthy();
        expect(jsonLd.dateModified).toBeTruthy();
        expect(jsonLd.creator).toBeDefined();
        expect(jsonLd.keywords).toBeDefined();
        expect(jsonLd.programmingLanguage).toBeDefined();

        // Verify creator is an array
        expect(Array.isArray(jsonLd.creator)).toBe(true);
        expect(jsonLd.creator.length).toBeGreaterThan(0);

        // Verify first creator has required fields
        const firstCreator = jsonLd.creator[0];
        expect(firstCreator["@type"]).toMatch(/^(Person|Organization)$/);
        expect(firstCreator.name).toBeTruthy();

        // Verify keywords is an array
        expect(Array.isArray(jsonLd.keywords)).toBe(true);

        // Verify programmingLanguage structure
        expect(jsonLd.programmingLanguage["@type"]).toBe("ComputerLanguage");
        expect(jsonLd.programmingLanguage.name).toBe("Galaxy");
        expect(jsonLd.programmingLanguage.url).toBe("https://galaxyproject.org");

        // Verify URL points to Dockstore
        expect(jsonLd.url).toContain("dockstore.org/workflows");
    });

    test("Workflow with DOI includes identifier field", async ({ page }) => {
        await page.goto("/workflow/chipseq-sr-main/");

        const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd = JSON.parse(jsonLdScript);

        // Verify DOI identifier exists and is properly formatted
        expect(jsonLd.identifier).toBeTruthy();
        expect(jsonLd.identifier).toMatch(/^https:\/\/doi\.org\/10\.\d+\/zenodo\.\d+$/);
    });

    test("Workflow with ORCID includes creator identifiers", async ({ page }) => {
        await page.goto("/workflow/rnaseq-sr-main/");

        const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd = JSON.parse(jsonLdScript);

        // Find a creator with ORCID (if exists)
        const creatorWithOrcid = jsonLd.creator.find((c) => c.identifier);

        if (creatorWithOrcid) {
            expect(creatorWithOrcid.identifier).toMatch(/^https:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{4}$/);
        }
    });

    test("Workflow with version includes version field", async ({ page }) => {
        await page.goto("/workflow/bacterial-genome-assembly-main/");

        const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd = JSON.parse(jsonLdScript);

        // Verify version field exists
        expect(jsonLd.version).toBeDefined();
        expect(typeof jsonLd.version).toBe("string");
    });

    test("Workflow with license includes license field", async ({ page }) => {
        await page.goto("/workflow/chipseq-sr-main/");

        const jsonLdScript = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd = JSON.parse(jsonLdScript);

        // Verify license field exists
        expect(jsonLd.license).toBeDefined();
        expect(typeof jsonLd.license).toBe("string");
        expect(jsonLd.license.length).toBeGreaterThan(0);
    });

    test("Multiple workflow pages have unique JSON-LD", async ({ page }) => {
        // Test first workflow
        await page.goto("/workflow/rnaseq-sr-main/");
        const jsonLd1Script = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd1 = JSON.parse(jsonLd1Script);

        // Test second workflow
        await page.goto("/workflow/chipseq-sr-main/");
        const jsonLd2Script = await page.locator('script[type="application/ld+json"]').textContent();
        const jsonLd2 = JSON.parse(jsonLd2Script);

        // Verify they have different names and URLs
        expect(jsonLd1.name).not.toBe(jsonLd2.name);
        expect(jsonLd1.url).not.toBe(jsonLd2.url);
        expect(jsonLd1.identifier).not.toBe(jsonLd2.identifier);
    });
});
