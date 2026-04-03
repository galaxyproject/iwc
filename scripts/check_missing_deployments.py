#!/usr/bin/env python3
"""Check for workflows whose current release has not been deployed to the
iwc-workflows GitHub organization, and optionally write the list of
repository directories that need redeployment."""

import json
import os
import subprocess
import sys
from pathlib import Path

import yaml

WORKFLOWS_DIR = Path(__file__).resolve().parent.parent / "workflows"
ORG = "iwc-workflows"


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
    """Check if a release tag exists in the iwc-workflows org via gh CLI."""
    result = subprocess.run(
        ["gh", "api", f"repos/{ORG}/{repo_name}/releases/tags/{tag}"],
        capture_output=True,
    )
    return result.returncode == 0


def find_all_repos():
    """Find all workflow repo directories (those containing .dockstore.yml)."""
    repos = []
    for dockstore in sorted(WORKFLOWS_DIR.rglob(".dockstore.yml")):
        repos.append(dockstore.parent)
    return repos


def main():
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

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
