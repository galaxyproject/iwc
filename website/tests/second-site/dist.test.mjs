// Checks dist/ after a build with the fixture site config in
// scripts/tests/data/second-site. Nothing here runs against IWC's own build.

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../../dist", import.meta.url));

function page(path) {
    return readFileSync(join(DIST, path), "utf8");
}

function title(html) {
    return html.match(/<title>(.*?)<\/title>/)[1];
}

function builtFiles(dir = DIST) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const path = join(dir, entry.name);
        return entry.isDirectory() ? builtFiles(path) : [path];
    });
}

test("the home page is the second site's", () => {
    const home = page("index.html");
    assert.equal(title(home), "Second Site Workflows");
    assert.match(home, /Second Site - Fixture Workflows/);
    assert.match(home, />\s*Fixture\s*<\/span>/, "header badge");
    assert.match(home, /Fixture workflows for /);
    assert.match(home, /testing the override/);
    assert.match(home, /Fixture workflows that only exist to test the site config\./);
    assert.match(home, /href="https:\/\/github\.com\/example\/second-site\/"/);
});

test("the featured workflow is on the home page", () => {
    assert.match(page("index.html"), /second-site-workflows\/cat-native\/main/);
});

test("directories became collections", () => {
    assert.equal(title(page("collection/variant-calling/index.html")), "Variant Calling - Second Site Workflows");
    assert.equal(title(page("collection/epigenetics/index.html")), "Epigenetics - Second Site Workflows");
});

test("workflow pages link to the second site's repository", () => {
    const workflow = page("workflow/cat-native-main/index.html");
    assert.match(title(workflow), / \| Second$/);
    assert.match(workflow, /second-site\.example\.org/);
    assert.match(workflow, /workflows\/variant-calling\/cat-native/);
    assert.match(title(page("workflow/cat-format2-main/index.html")), / \| Second$/);
});

test("the about page is the Markdown file", () => {
    const about = page("about/index.html");
    assert.equal(title(about), "About the second site | Second");
    assert.match(about, /This page comes from a Markdown file named in the fixture site config\./);
});

test("nothing of IWC's leaks into the build", () => {
    const leaks = [
        /iwc\.galaxyproject\.org/,
        /github\.com\/galaxyproject\/iwc/,
        /iwc-workflows/,
        /Intergalactic Workflow Commission/,
        /peer-reviewed/,
        // The layout keeps its "Plausible Analytics" comment, so look for the script itself
        /data-domain=/,
        /plausible\./i,
        /sentry/i,
    ];
    const text = /\.(html|js|css|json|svg|xml|txt)$/;
    for (const file of builtFiles().filter((path) => text.test(path))) {
        const content = readFileSync(file, "utf8");
        for (const leak of leaks) {
            assert.doesNotMatch(content, leak, `${file} mentions ${leak}`);
        }
    }
});
