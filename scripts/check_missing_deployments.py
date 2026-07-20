#!/usr/bin/env python3
"""Check for workflows whose current release has not been deployed to the
iwc-workflows GitHub organization, and optionally write the list of
repository directories that need redeployment."""

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

import yaml

WORKFLOWS_DIR = Path(__file__).resolve().parent.parent / "workflows"
ORG = "iwc-workflows"
# Transient GitHub API errors (secondary rate limits in particular) are common
# when querying ~100 repositories in a row, so retry before giving up.
API_RETRIES = 3
API_RETRY_DELAY = 10


def get_expected_release(repo_dir):
    """Read .dockstore.yml and return (release, ga_path) from the first workflow's .ga file."""
    dockstore_path = repo_dir / ".dockstore.yml"
    with open(dockstore_path) as f:
        ds = yaml.safe_load(f)
    for wf in ds.get("workflows", []):
        ga_path = repo_dir / wf["primaryDescriptorPath"].lstrip("/")
        if ga_path.exists():
            with open(ga_path) as g:
                ga = json.load(g)
            return ga.get("release")
    return None


def release_exists(repo_name, tag):
    """Check if a release tag exists in the iwc-workflows org via gh CLI.

    Only a genuine 404 means the release is missing. Any other failure (rate
    limiting, network trouble, an expired token) is retried and then raised,
    so that an API problem is never mistaken for a missing deployment.
    """
    for attempt in range(1, API_RETRIES + 1):
        result = subprocess.run(
            ["gh", "api", "--silent", f"repos/{ORG}/{repo_name}/releases/tags/{tag}"],
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            return True
        stderr = result.stderr or ""
        if "HTTP 404" in stderr or "Not Found" in stderr:
            return False
        if attempt < API_RETRIES:
            print(f"      API error for {repo_name} (attempt {attempt}), retrying: {stderr.strip()}")
            time.sleep(API_RETRY_DELAY)
    raise RuntimeError(f"Could not determine release status of {ORG}/{repo_name} {tag}: {stderr.strip()}")


def find_all_repos():
    """Find all workflow repo directories (those containing .dockstore.yml)."""
    repos = []
    for dockstore in sorted(WORKFLOWS_DIR.rglob(".dockstore.yml")):
        repos.append(dockstore.parent)
    return repos


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--fail-on-missing",
        action="store_true",
        help="Exit non-zero when deployments are missing (the default outside GitHub Actions)",
    )
    args = parser.parse_args()

    repos = find_all_repos()
    missing = []

    for repo_dir in repos:
        repo_name = repo_dir.name
        release = get_expected_release(repo_dir)
        if not release:
            print(f"SKIP  {repo_name} (no release field)")
            continue

        tag = f"v{release}"
        if release_exists(repo_name, tag):
            print(f"OK    {repo_name} {tag}")
        else:
            print(f"MISSING {repo_name} {tag}")
            missing.append(repo_dir)

    print(f"\n{len(missing)} missing deployment(s) out of {len(repos)} repos")

    # Write missing repo paths for downstream consumption
    output_file = os.environ.get("MISSING_REPOS_FILE")
    if output_file and missing:
        with open(output_file, "w") as f:
            f.write("\n".join(str(p) for p in missing))

    # Write to GITHUB_OUTPUT if running in Actions
    github_output = os.environ.get("GITHUB_OUTPUT")
    if github_output:
        with open(github_output, "a") as f:
            repo_list = "\n".join(str(p) for p in missing)
            f.write(f"missing-repos<<EOF\n{repo_list}\nEOF\n")
            f.write(f"has-missing={'true' if missing else 'false'}\n")

    # Inside Actions, missing deployments are reported through the has-missing
    # output so that the deploy job can act on them. Failing here instead would
    # mark the run red for the very condition the workflow exists to fix.
    if missing and (args.fail_on_missing or not github_output):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
