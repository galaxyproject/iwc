// The site's own values: its name, URLs, repository and wording.
//
// They come from site-config.json at the repo root, or from the file a second
// site names in SITE_CONFIG. astro.config.mjs hands each key to Vite as one of
// these constants, and Vite swaps it for its literal wherever it's used: in
// pages, in hydrated components, and (through a compiler transform) in Vue
// templates as {{ __SITE_NAME__ }}.
//
// Use them directly rather than re-exporting them from a module. An imported
// constant isn't inlined across chunks, so the bundle would carry a shared
// variable where it used to carry the literal.

declare const __SITE_NAME__: string;
declare const __SITE_SHORT_NAME__: string;
declare const __SITE_SITE_URL__: string;
declare const __SITE_DESCRIPTION__: string;
declare const __SITE_HOME_DESCRIPTION__: string;
declare const __SITE_OG_DESCRIPTION__: string;
declare const __SITE_HEADER_TITLE__: string;
declare const __SITE_HEADER_TITLE_SHORT__: string;
declare const __SITE_HEADER_BADGE__: string | null;
declare const __SITE_HERO_HEADLINE__: string;
declare const __SITE_HERO_HIGHLIGHT__: string;
declare const __SITE_FOOTER_BLURB__: string;
declare const __SITE_REPO_URL__: string;
declare const __SITE_REPO_BRANCH__: string;
declare const __SITE_FEATURED_TRS_IDS__: string[];
declare const __SITE_ABOUT_MARKDOWN__: string | null;
declare const __SITE_ANALYTICS__: { plausibleDomain: string; plausibleSrc: string } | null;
declare const __SITE_SENTRY__: { dsn: string } | null;
