import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";
import { loadSiteConfig, siteDefines, siteTextTransform } from "./site-config.mjs";

const siteConfig = loadSiteConfig();

// https://astro.build/config
export default defineConfig({
    integrations: [
        vue({ template: { compilerOptions: { nodeTransforms: [siteTextTransform(siteConfig)] } } }),
        // @sentry/astro injects sentry.client.config.js itself, so a site without
        // Sentry has to leave the integration out rather than blank the DSN
        ...(siteConfig.sentry ? [sentry()] : []),
    ],
    vite: {
        plugins: [tailwindcss()],
        // See src/site-config.d.ts
        define: siteDefines(siteConfig),
        // @sentry/astro forces `sourcemap: 'hidden'` when this is unset, and only cleans up
        // after a successful upload -- which never happens without SENTRY_AUTH_TOKEN. Its
        // delete globs also assume an SSR layout (dist/{client,server}), not our static
        // dist/_astro. Result was ~14MB of unreferenced .map files published to gh-pages.
        // Set to 'hidden' (and fix the delete globs) if sourcemap upload is ever configured.
        build: { sourcemap: false },
    },
    output: "static",
    site: siteConfig.siteUrl,
    // Astro 7 defaults to 'jsx' whitespace handling, which drops the spaces between
    // adjacent inline elements ("from data" -> "fromdata"). Keep v6 HTML-aware behavior.
    compressHTML: true,
});
