import { test, expect } from "@playwright/test";

test.describe("Structured metadata for academic search", () => {
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

test.describe("Google Scholar citation meta tags", () => {
    test("Workflow page includes required citation meta tags", async ({ page }) => {
        await page.goto("/workflow/rnaseq-sr-main/");

        // Verify required meta tags exist
        const titleTag = await page.locator('meta[name="citation_title"]').getAttribute("content");
        expect(titleTag).toBeTruthy();
        expect(titleTag).toContain("RNA-Seq");

        // Verify at least one author tag
        const authorTags = await page.locator('meta[name="citation_author"]').count();
        expect(authorTags).toBeGreaterThan(0);

        // Verify publication date
        const dateTag = await page.locator('meta[name="citation_publication_date"]').getAttribute("content");
        expect(dateTag).toBeTruthy();
        expect(dateTag).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
    });

    test("Workflow with DOI includes citation_doi meta tag", async ({ page }) => {
        await page.goto("/workflow/chipseq-sr-main/");

        const doiTag = await page.locator('meta[name="citation_doi"]').getAttribute("content");
        expect(doiTag).toBeTruthy();
        expect(doiTag).toMatch(/^10\.\d+\/zenodo\.\d+$/);
    });

    test("Workflow includes citation_keywords", async ({ page }) => {
        await page.goto("/workflow/rnaseq-sr-main/");

        const keywordsTag = await page.locator('meta[name="citation_keywords"]').getAttribute("content");
        expect(keywordsTag).toBeTruthy();
        expect(keywordsTag).toContain(";"); // Keywords should be semicolon-separated
    });

    test("Workflow includes citation_abstract", async ({ page }) => {
        await page.goto("/workflow/chipseq-sr-main/");

        const abstractTag = await page.locator('meta[name="citation_abstract"]').getAttribute("content");
        expect(abstractTag).toBeTruthy();
        expect(abstractTag.length).toBeGreaterThan(20);
    });

    test("Only person creators are listed as citation_author", async ({ page }) => {
        await page.goto("/workflow/mgnify-amplicon-pipeline-v5-quality-control-single-end-main/");

        // This workflow has both Organization and Person creators
        const authorTags = await page.locator('meta[name="citation_author"]').all();
        const authors = await Promise.all(authorTags.map((tag) => tag.getAttribute("content")));

        // Verify we have person authors (should be 2: Rand Zoabi and Paul Zierep)
        expect(authors.length).toBeGreaterThan(0);

        // Verify none of the authors are "MGnify - EMBL" (the organization)
        expect(authors).not.toContain("MGnify - EMBL");
    });
});
