import * as Sentry from "@sentry/astro";

Sentry.init({
    dsn: "https://ced6a9e98249fd81925d7f2fd1efd4ac@sentry.galaxyproject.org/24",
    enabled: import.meta.env.PROD,
});
