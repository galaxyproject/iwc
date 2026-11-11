import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { OPTIONAL_KEYS, defineName, loadSiteConfig, siteDefines } from "../../site-config.mjs";

const DEFAULTS = JSON.parse(readFileSync(new URL("../../../site-config.json", import.meta.url), "utf8"));
const OPTIONAL = ["repoBranch", "collectionFallback", "aboutMarkdown", "headerBadge"];
const TMP = mkdtempSync(join(tmpdir(), "site-config-"));
after(() => rmSync(TMP, { recursive: true, force: true }));

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
    const dir = mkdtempSync(join(TMP, "override-"));
    const path = join(dir, "lab-site-config.json");
    writeFileSync(path, JSON.stringify(override));
    return { dir, env: { SITE_CONFIG: path } };
}

test("the optional keys are only the harmless ones", () => {
    // scripts/tests/test_site_config.py pins the same list for the Python loader
    assert.deepEqual([...OPTIONAL_KEYS].sort(), [...OPTIONAL].sort());
});

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

test("unknown keys are rejected", () => {
    assert.throws(() => loadSiteConfig(writeOverride(labOverride({ trsOrganisation: "x" })).env), /unknown keys/);
    // Every object has these through its prototype; the Python loader rejects them too
    for (const key of ["constructor", "toString"]) {
        assert.throws(() => loadSiteConfig(writeOverride(labOverride({ [key]: "x" })).env), /unknown keys/, key);
    }
});

test("repoUrl must be a GitHub repo", () => {
    const notRepos = [
        "https://gitlab.com/a/b",
        "https://github.com/galaxyproject",
        "galaxyproject/iwc",
        // The site appends paths to repoUrl, so anything past the repo name breaks its links
        "https://github.com/a/b/",
        "https://github.com/a/b.git",
        "https://github.com/a/b/tree/main",
        "https://github.com/a/b#readme",
        "https://github.com/a/b?tab=readme",
    ];
    for (const repoUrl of notRepos) {
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

test("every constant the site uses is declared", () => {
    const declarations = readFileSync(new URL("../../src/site-config.d.ts", import.meta.url), "utf8");
    const declared = new Set([...declarations.matchAll(/^declare const (\w+):/gm)].map((match) => match[1]));
    const src = new URL("../../src/", import.meta.url);
    const used = readdirSync(src, { recursive: true })
        .filter((path) => /\.(astro|vue|ts|js|mjs)$/.test(path) && !path.endsWith("site-config.d.ts"))
        .flatMap((path) => [...readFileSync(new URL(path, src), "utf8").matchAll(/__SITE_\w+?__/g)].map((m) => m[0]));
    assert.ok(used.length > 0);
    assert.deepEqual([...new Set(used.filter((name) => !declared.has(name)))], []);
});

test("an inherited aboutMarkdown resolves against the defaults", () => {
    const defaultsDir = mkdtempSync(join(TMP, "defaults-"));
    const defaultsPath = join(defaultsDir, "site-config.json");
    writeFileSync(defaultsPath, JSON.stringify({ ...DEFAULTS, aboutMarkdown: "about.md" }));
    const { env } = writeOverride(labOverride());
    assert.equal(loadSiteConfig(env, defaultsPath).aboutMarkdown, join(defaultsDir, "about.md"));
});
