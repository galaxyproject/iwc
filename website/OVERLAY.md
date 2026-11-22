# Files a second site may replace

A site built from this repository (see "Building a second site" in the [README](README.md))
gets its values from its own site config. Images and per-collection prose aren't values, they're
files the site serves by name. A second site replaces them by copying its own versions over
these paths before it runs the build.

| Path                                     | What it is                                                        |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `src/assets/iwc_logo_white.png`          | Header logo. Goes through `astro:assets`, so it must be an image. |
| `public/iwc_logo.png`                    | Open Graph and Twitter card image.                                |
| `public/iwc_logo_white.png`              | Favicon.                                                          |
| `public/category-descriptions/<slug>.md` | Text at the top of a collection page. Replace any, or add more.   |

The slug of a collection is its name in lower case with spaces as hyphens, so "Variant Calling"
reads `category-descriptions/variant-calling.md`. With `collectionFallback: "directory"` that is
the directory name under `workflows/`, lower-cased, with any run of characters other than letters
and digits turned into one hyphen (`genome_annotation` reads `genome-annotation.md`).

A second site can also add files of its own anywhere under `public/`, for example images its
about page links to. It should leave `public/data/` and `public/workflow_manifest.json` alone,
because the manifest script writes them, and `public/CNAME`, which is IWC's domain. Set the
domain in the deploy step instead (`cname:` in `peaceiris/actions-gh-pages`).

Everything else in `website/` is code. A second site that replaces it will break when it moves to
a newer commit of this repository, so its build should refuse to copy anything not listed here.

**Renaming or moving one of these files breaks every second site.** Say so in the pull request
that does it.
