import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
    integrations: [vue(), sentry()],
    vite: {
        plugins: [tailwindcss()],
        // @sentry/astro forces `sourcemap: 'hidden'` when this is unset, and only cleans up
        // after a successful upload -- which never happens without SENTRY_AUTH_TOKEN. Its
        // delete globs also assume an SSR layout (dist/{client,server}), not our static
        // dist/_astro. Result was ~14MB of unreferenced .map files published to gh-pages.
        // Set to 'hidden' (and fix the delete globs) if sourcemap upload is ever configured.
        build: { sourcemap: false },
    },
    output: "static",
    site: "https://iwc.galaxyproject.org",
    // Astro 7 defaults to 'jsx' whitespace handling, which drops the spaces between
    // adjacent inline elements ("from data" -> "fromdata"). Keep v6 HTML-aware behavior.
    compressHTML: true,
});
