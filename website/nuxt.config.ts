import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
    modules: ["@nuxt/ui", "@nuxt/content", "@pinia/nuxt"],
    colorMode: {
        preference: 'light'
    },
});