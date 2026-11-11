"""
Write the website's data for a made-up second site, for CI to build.

Run from the repository root with SITE_CONFIG pointing at
scripts/tests/data/second-site/site-config.json. It lays out two workflow
repositories in two category directories, answers for Dockstore, and runs the
manifest script over them, so the site config override and the directory
collection fallback (which IWC itself never turns on) get built into a real site.
"""

import shutil
import sys
import tempfile
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import workflow_manifest

DATA = Path(__file__).parent / "data"

REPOSITORIES = {
    "variant-calling/cat-native": "cat.ga",
    "epigenetics/cat-format2": "cat.gxwf.yml",
}


def write_repository(repo, workflow_file):
    repo.mkdir(parents=True)
    shutil.copy(DATA / workflow_file, repo / workflow_file)
    # Written here rather than committed: planemo treats any directory holding
    # a .dockstore.yml as a workflow repository to lint and test
    (repo / ".dockstore.yml").write_text(
        yaml.safe_dump(
            {
                "version": 1.2,
                "workflows": [
                    {
                        "name": "main",
                        "subclass": "Galaxy",
                        "publish": True,
                        "primaryDescriptorPath": f"/{workflow_file}",
                    }
                ],
            }
        )
    )
    (repo / "README.md").write_text(f"# {repo.name}\n\nA fixture workflow.\n")
    (repo / "CHANGELOG.md").write_text("# Changelog\n\n## [0.1] - 2026-01-01\n\nFirst release.\n")


def main():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        for relative_path, workflow_file in REPOSITORIES.items():
            write_repository(root / "workflows" / relative_path, workflow_file)
        # On Dockstore, but in no collection: what a second site's workflows look like
        workflow_manifest.get_dockstore_details = lambda trs_id: ({"id": 1}, [], [])
        sys.argv = [sys.argv[0], "--workflows", str(root / "workflows"), "--repo-root", str(root)]
        workflow_manifest.main()


if __name__ == "__main__":
    main()
