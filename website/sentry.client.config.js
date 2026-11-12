import * as Sentry from "@sentry/astro";

Sentry.init({
    // Only bundled when the site config sets sentry, see astro.config.mjs
    dsn: __SITE_SENTRY__.dsn,
    enabled: import.meta.env.PROD,
});
