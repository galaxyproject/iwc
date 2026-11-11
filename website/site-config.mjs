// Site config for the Astro build.
//
// ../site-config.json holds IWC's values. A second site built from this repo
// points SITE_CONFIG at its own JSON file, which is merged over those values
// one top-level key at a time. scripts/site_config.py does the same for the
// manifest script, so keep the two in step.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULTS_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "../site-config.json");

// An override has to set every key except these. Anything else it inherited
// would be IWC's name, links, accounts or claims showing up on another site.
const OPTIONAL_KEYS = new Set([
    "repoBranch", // second sites build from main too
    "collectionFallback", // "none" is off
    "aboutMarkdown", // null keeps the built-in about page
    "headerBadge", // null renders nothing
]);

const COLLECTION_FALLBACKS = ["none", "directory"];

// GitHub is the only host the site links to
const GITHUB_REPO_URL = /^https:\/\/github\.com\/[^/]+\/[^/]+?\/?$/;

export function loadSiteConfig(env = process.env) {
    const config = JSON.parse(readFileSync(DEFAULTS_PATH, "utf8"));
    let configDir = dirname(DEFAULTS_PATH);

    if (env.SITE_CONFIG) {
        const overridePath = resolve(env.SITE_CONFIG);
        const override = JSON.parse(readFileSync(overridePath, "utf8"));
        if (override === null || typeof override !== "object" || Array.isArray(override)) {
            throw new Error(`${overridePath} must hold a JSON object`);
        }
        const unknown = Object.keys(override)
            .filter((key) => !(key in config))
            .sort();
        if (unknown.length) {
            throw new Error(`${overridePath} sets unknown keys: ${unknown.join(", ")}`);
        }
        const missing = Object.keys(config)
            .filter((key) => !OPTIONAL_KEYS.has(key) && !(key in override))
            .sort();
        if (missing.length) {
            throw new Error(`${overridePath} must set: ${missing.join(", ")}`);
        }
        Object.assign(config, override);
        configDir = dirname(overridePath);
    }

    if (!COLLECTION_FALLBACKS.includes(config.collectionFallback)) {
        throw new Error(
            `collectionFallback must be one of ${COLLECTION_FALLBACKS.join(", ")}, not ${JSON.stringify(config.collectionFallback)}`,
        );
    }
    if (!GITHUB_REPO_URL.test(config.repoUrl)) {
        throw new Error(
            `repoUrl must look like https://github.com/<owner>/<repo>, not ${JSON.stringify(config.repoUrl)}`,
        );
    }
    if (config.aboutMarkdown) {
        config.aboutMarkdown = resolve(configDir, config.aboutMarkdown);
    }
    return config;
}

// siteUrl -> __SITE_SITE_URL__
export function defineName(key) {
    return `__SITE_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}__`;
}

// Vite swaps each of these identifiers for its literal before bundling, in the
// pages and in the hydrated components alike. src/site-config.d.ts declares them.
export function siteDefines(config) {
    return Object.fromEntries(Object.entries(config).map(([key, value]) => [defineName(key), JSON.stringify(value)]));
}
