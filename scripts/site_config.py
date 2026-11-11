"""
Site config for the manifest script.

site-config.json at the repo root holds IWC's values. A second site built from
this repo points SITE_CONFIG at its own JSON file, which is merged over those
values one top-level key at a time. website/site-config.mjs does the same for
the Astro build, so keep the two in step.
"""

import json
import os
import re
from pathlib import Path

DEFAULTS_PATH = Path(__file__).resolve().parent.parent / "site-config.json"

# An override has to set every key except these. Anything else it inherited
# would be IWC's name, links, accounts or claims showing up on another site.
OPTIONAL_KEYS = {
    "repoBranch",  # second sites build from main too
    "collectionFallback",  # "none" is off
    "aboutMarkdown",  # null keeps the built-in about page
    "headerBadge",  # null renders nothing
}

COLLECTION_FALLBACKS = ("none", "directory")

# GitHub is the only host the site links to, and the test-data base is built from it
GITHUB_REPO_URL = re.compile(r"^https://github\.com/([^/]+)/([^/]+?)/?$")


class SiteConfigError(Exception):
    pass


def load_site_config(environ=None):
    environ = os.environ if environ is None else environ
    with open(DEFAULTS_PATH) as f:
        config = json.load(f)
    config_dir = DEFAULTS_PATH.parent

    override_path = environ.get("SITE_CONFIG")
    if override_path:
        override_path = Path(override_path).resolve()
        with open(override_path) as f:
            override = json.load(f)
        if not isinstance(override, dict):
            raise SiteConfigError(f"{override_path} must hold a JSON object")
        unknown = sorted(set(override) - set(config))
        if unknown:
            raise SiteConfigError(f"{override_path} sets unknown keys: {', '.join(unknown)}")
        missing = sorted(set(config) - OPTIONAL_KEYS - set(override))
        if missing:
            raise SiteConfigError(f"{override_path} must set: {', '.join(missing)}")
        config.update(override)
        config_dir = override_path.parent

    if config["collectionFallback"] not in COLLECTION_FALLBACKS:
        raise SiteConfigError(
            f"collectionFallback must be one of {', '.join(COLLECTION_FALLBACKS)}, not {config['collectionFallback']!r}"
        )
    match = GITHUB_REPO_URL.match(config["repoUrl"])
    if not match:
        raise SiteConfigError(f"repoUrl must look like https://github.com/<owner>/<repo>, not {config['repoUrl']!r}")
    owner, repo = match.groups()
    config["rawDataBase"] = f"https://raw.githubusercontent.com/{owner}/{repo}/{config['repoBranch']}/"

    if config["aboutMarkdown"]:
        config["aboutMarkdown"] = str((config_dir / config["aboutMarkdown"]).resolve())
    return config
