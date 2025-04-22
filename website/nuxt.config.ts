import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxt/icon"],

    css: [
        "@fontsource/atkinson-hyperlegible/400.css",
        "@fontsource/atkinson-hyperlegible/700.css",
        "@fontsource/atkinson-hyperlegible/400-italic.css",
        "@fontsource/atkinson-hyperlegible/700-italic.css",
    ],

    colorMode: {
        preference: "light",
    },

    app: {
        head: {
            link: [{ rel: "icon", type: "image/png", href: "/iwc_logo_white.png" }],
            htmlAttrs: {
                lang: "en",
            },
        },
    },

    // Add runtime configuration for the application URL
    runtimeConfig: {
        public: {
            // Default base URL for production
            appUrl: process.env.APP_URL || "https://iwc.galaxyproject.org",
        },
    },

    compatibilityDate: "2025-03-03",
});
