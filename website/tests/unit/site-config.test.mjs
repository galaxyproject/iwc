import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { defineName, loadSiteConfig, siteDefines, siteTextTransform } from "../../site-config.mjs";

const DEFAULTS = JSON.parse(readFileSync(new URL("../../../site-config.json", import.meta.url), "utf8"));
const OPTIONAL = ["repoBranch", "collectionFallback", "aboutMarkdown", "headerBadge"];

function labOverride(changes = {}) {
    const override = Object.fromEntries(Object.entries(DEFAULTS).filter(([key]) => !OPTIONAL.includes(key)));
    return {
        ...override,
        name: "IWC Lab",
        repoUrl: "https://github.com/galaxyproject/iwc-lab",
        analytics: null,
        sentry: null,
        ...changes,
    };
}

function writeOverride(override) {
    const dir = mkdtempSync(join(tmpdir(), "site-config-"));
    const path = join(dir, "lab-site-config.json");
    writeFileSync(path, JSON.stringify(override));
    return { dir, env: { SITE_CONFIG: path } };
}

test("defaults are IWC's", () => {
    assert.deepEqual(loadSiteConfig({}), DEFAULTS);
});

test("an override replaces top-level keys and keeps optional defaults", () => {
    const config = loadSiteConfig(writeOverride(labOverride()).env);
    assert.equal(config.name, "IWC Lab");
    assert.equal(config.analytics, null);
    assert.equal(config.collectionFallback, "none");
});

test("an override must set every required key", () => {
    for (const key of Object.keys(DEFAULTS).filter((k) => !OPTIONAL.includes(k))) {
        const override = labOverride();
        delete override[key];
        assert.throws(() => loadSiteConfig(writeOverride(override).env), new RegExp(`must set: ${key}`), key);
    }
});

test("an override may leave out every optional key", () => {
    // labOverride sets none of them, so a key missing from OPTIONAL here would throw
    assert.doesNotThrow(() => loadSiteConfig(writeOverride(labOverride()).env));
});

test("unknown keys are rejected", () => {
    assert.throws(() => loadSiteConfig(writeOverride(labOverride({ trsOrganisation: "x" })).env), /unknown keys/);
});

test("repoUrl must be a GitHub repo", () => {
    for (const repoUrl of ["https://gitlab.com/a/b", "https://github.com/galaxyproject", "galaxyproject/iwc"]) {
        assert.throws(() => loadSiteConfig(writeOverride(labOverride({ repoUrl })).env), /repoUrl/, repoUrl);
    }
});

test("collectionFallback is checked", () => {
    assert.throws(
        () => loadSiteConfig(writeOverride(labOverride({ collectionFallback: "dir" })).env),
        /collectionFallback/,
    );
});

test("aboutMarkdown resolves against the config file", () => {
    const { dir, env } = writeOverride(labOverride({ aboutMarkdown: "about.md" }));
    assert.equal(loadSiteConfig(env).aboutMarkdown, join(dir, "about.md"));
});

test("defines are one JSON literal per key", () => {
    assert.equal(defineName("siteUrl"), "__SITE_SITE_URL__");
    assert.equal(defineName("featuredTrsIds"), "__SITE_FEATURED_TRS_IDS__");
    const defines = siteDefines(DEFAULTS);
    assert.equal(defines.__SITE_SITE_URL__, '"https://iwc.galaxyproject.org"');
    assert.equal(defines.__SITE_HEADER_BADGE__, "null");
    assert.equal(defines.__SITE_SENTRY__, JSON.stringify(DEFAULTS.sentry));
    assert.equal(defines["__SITE_SENTRY__.dsn"], JSON.stringify(DEFAULTS.sentry.dsn));
    assert.equal(siteDefines({ sentry: null })["__SITE_SENTRY__.dsn"], undefined);
});

test("every constant declared for the site is a config key", () => {
    const declarations = readFileSync(new URL("../../src/site-config.d.ts", import.meta.url), "utf8");
    const declared = [...declarations.matchAll(/^declare const (\w+):/gm)].map((match) => match[1]);
    const defined = Object.keys(DEFAULTS).map(defineName);
    assert.ok(declared.length > 0);
    assert.deepEqual(
        declared.filter((name) => !defined.includes(name)),
        [],
    );
});

test("the template transform swaps a config constant for its text", () => {
    const transform = siteTextTransform({ heroHeadline: "Hello ", featuredTrsIds: [] });
    const interpolation = (source) => ({ type: 5, content: { loc: { source } }, loc: {} });
    const replaced = [];
    const context = { replaceNode: (node) => replaced.push(node) };

    transform(interpolation(" __SITE_HERO_HEADLINE__ "), context);
    assert.deepEqual(replaced, [{ type: 2, content: "Hello ", loc: {} }]);

    // Ordinary bindings and other node types are left alone
    transform(interpolation("workflow.name"), context);
    transform({ type: 1 }, context);
    assert.equal(replaced.length, 1);

    assert.throws(() => transform(interpolation("__SITE_FEATURED_TRS_IDS__"), context), /isn't a string/);
});
