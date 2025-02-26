import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@nuxt/content", "@pinia/nuxt", "@nuxt/icon"],

    colorMode: {
        preference: "light",
    },

    app: {
        head: {
            link: [{ rel: "icon", type: "image/png", href: "/iwc_logo_white.png" }],
        },
    },

    compatibilityDate: "2025-01-23",
});
