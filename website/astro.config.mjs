import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import tailwindcss from "@tailwindcss/vite";
import sentry from "@sentry/astro";

// https://astro.build/config
export default defineConfig({
    integrations: [vue(), sentry()],
    vite: {
        plugins: [tailwindcss()],
    },
    output: "static",
    site: "https://iwc.galaxyproject.org",
});
