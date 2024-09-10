import { defineNuxtConfig } from "nuxt/config";
import path from "path";
import { promises as fs } from "fs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@nuxt/ui", "@nuxt/content"],
});
