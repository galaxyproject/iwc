# Copyright (c) 2021 CRS4
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

"""\
Bump workflow repository version.

Workflow repositories are searched for starting from the specified root
directories (the default is to search below the current directory). Uses the
same searching logic and definition of repository as the ci_find_repos Planemo
command (any directory with a .shed.yml or .dockstore.yml file).

Workflow repositories are expected to contain:

- the .ga workflow file (e.g., "consensus-from-variation.ga"), which is
  expected to list its version in the "release" metadata field
- a CHANGELOG.md file with atx-style Markdown headers (the ones with the
  leading hash marks), with the convention that:
  - the top-level header is "# Changelog"
  - level 2 headers start with ## <VERSION>

Example:

# Changelog

## [0.4] - 2021-06-16

### Changed

- Upgrade multiqc to 1.9+galaxy1
"""

import argparse
import datetime
import json
import os
import re
import string
from pathlib import Path

import marko
from marko.md_renderer import MarkdownRenderer
from planemo.context import PlanemoContext
from planemo.shed import find_raw_repositories
from planemo.ci import filter_paths


NEW_LOG_ENTRY = string.Template("""\
## [${version}] ${date}

${msg}

""")


def get_wf_id(repo_dir):
    ids = [_.name for _ in os.scandir(repo_dir) if _.name.endswith(".ga")]
    if not ids:
        raise RuntimeError(f".ga workflow file not found in {repo_dir}")
    return ids[0]


def update_changelog(changelog, md, version, msg):
    with open(changelog, "rt") as f:
        tree = md.parse(f.read())
    date = datetime.date.today().strftime("%Y-%m-%d")
    entry = NEW_LOG_ENTRY.substitute(version=version, date=date, msg=msg)
    entry_tree = marko.block.Document(entry)
    for ins_pos, elem in enumerate(tree.children):
        if isinstance(elem, marko.block.Heading) and elem.level == 2:
            break
    else:
        ins_pos = len(tree.children)
    tree.children[ins_pos:ins_pos] = entry_tree.children
    with open(changelog, "wt") as f:
        f.write(md.render(tree))


def update_workflow(workflow, version):
    with open(workflow, "rt") as f:
        txt = f.read()
    code = json.loads(txt)
    try:
        old_version = code["release"]
    except KeyError:
        raise RuntimeError(f'{workflow} does not have a "release" metadata entry')
    # no json tools for the update (we'd get a huge diff due to whitespace change)
    pattern = fr'"release":\s*"{old_version}"'
    repl = f'"release": "{version}"'
    with open(workflow, "wt") as f:
        f.write(re.sub(pattern, repl, txt, 1))


def find_repos(paths, exclude=()):
    """\
    Find all workflow directories below each path in ``paths``.

    Same as ``planemo ci_find_repos``.
    """
    ctx = PlanemoContext()
    kwargs = dict(recursive=True, fail_fast=True, chunk_count=1, chunk=0, exclude=exclude)
    raw_repos = [_.path for _ in find_raw_repositories(ctx, paths, **kwargs)]
    return [Path(_) for _ in filter_paths(ctx, raw_repos, path_type="repo", **kwargs)]


def main(args):
    if not args.msg:
        args.msg = f"Version {args.version}"
    md = marko.Markdown(renderer=MarkdownRenderer)
    for repo in find_repos(args.root, exclude=args.exclude):
        print(f"processing {repo}")
        wf_id = get_wf_id(repo)
        update_workflow(repo / wf_id, args.version)
        update_changelog(repo / "CHANGELOG.md", md, args.version, args.msg)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("root", metavar="ROOT_DIR", help="top-level directory",
                        nargs="*", default=[os.getcwd()])
    parser.add_argument("--exclude", metavar="PATH", nargs="*", default=(),
                        help="paths to exclude while searching for workflow repos")
    parser.add_argument("-v", "--version", metavar="STRING", default="0.1",
                        help="new workflow version")
    parser.add_argument("-m", "--msg", metavar="STRING", help="log message")
    main(parser.parse_args())
