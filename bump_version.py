# Copyright (c) 2021-2022 CRS4
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
  leading hash marks), formatted according to https://keepachangelog.com
  (but not necessarily following semantic versioning).

Example:

# Changelog

## Unreleased
### Fixed
- This
- That

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
from enum import Enum
from pathlib import Path

import marko
from marko.md_renderer import MarkdownRenderer
from packaging.version import parse as vparse, Version, LegacyVersion
from planemo.context import PlanemoContext
from planemo.shed import find_raw_repositories
from planemo.ci import filter_paths

DATE_FMT = "%Y-%m-%d"
ENTRY_TYPES = "Added", "Changed", "Fixed"
NEW_LOG_ENTRY_HEAD = string.Template("""\
## [${version}] ${date}
""")
NEW_LOG_ENTRY_BODY = string.Template("""\

### ${entry_type}
- ${msg}
""")


class Bump(Enum):
    MAJOR = "major"
    MINOR = "minor"
    MICRO = "micro"  # PEP 440
    PATCH = "micro"  # Semantic Versioning


# Allow "PATCH" alias, but leave it out of the help text to avoid confusion
BUMP_CHOICES = list(Bump.__members__)  # includes aliases
BUMP_METAVAR = "|".join(_.name for _ in Bump)  # does not include aliases


class Renderer(MarkdownRenderer):
    """\
    A Markdown renderer that indents all lines in a paragraph.
    """

    def render_paragraph(self, element):
        new_line = False
        rendered = []
        for child in element.children:
            prefix = self._second_prefix if new_line else ""
            rendered.append(prefix + self.render(child))
            new_line = isinstance(child, marko.inline.LineBreak)
        children = "".join(rendered)
        line = self._prefix + children + "\n"
        self._prefix = self._second_prefix
        return line


def get_new_release(rel, bump=Bump.MICRO):
    if len(rel) == 1 and bump is Bump.MINOR or len(rel) == 2 and bump is Bump.MICRO:
        return rel + (1,)
    if len(rel) == 1 and bump is Bump.MICRO:
        return rel + (0, 1)
    return tuple(r + 1 if bump is b else r for r, b in zip(rel, Bump))


def vbump(version, bump=Bump.MICRO):
    if not isinstance(version, (Version, LegacyVersion)):
        version = vparse(version)
    new_release = get_new_release(version.release, bump)
    # same as packaging.version.Version.__str__, but release is the new one
    parts = []
    if version.epoch != 0:
        parts.append(f"{version.epoch}!")
    parts.append(".".join(str(x) for x in new_release))
    if version.pre is not None:
        parts.append("".join(str(x) for x in version.pre))
    if version.post is not None:
        parts.append(f".post{version.post}")
    if version.dev is not None:
        parts.append(f".dev{version.dev}")
    if version.local is not None:
        parts.append(f"+{version.local}")
    return "".join(parts)


def get_wf_id(repo_dir):
    ids = [_.name for _ in os.scandir(repo_dir) if _.name.endswith(".ga")]
    if not ids:
        raise RuntimeError(f".ga workflow file not found in {repo_dir}")
    return ids[0]


def update_changelog(
    changelog, md, version, msg, date=datetime.date.today(), entry_type="Changed"
):
    with open(changelog, "rt") as f:
        tree = md.parse(f.read())
    date = date.strftime(DATE_FMT)
    entry = NEW_LOG_ENTRY_HEAD.substitute(version=version, date=date)
    if msg:
        entry += NEW_LOG_ENTRY_BODY.substitute(entry_type=entry_type, msg=msg)
    for ins_pos, elem in enumerate(tree.children):
        if isinstance(elem, marko.block.Heading) and elem.level == 2:
            if elem.children[0].children.strip(" []").lower() == "unreleased":
                # Insert after the "Unreleased" heading but before its contents
                # Any unreleased changes become part of the new version
                ins_pos += 1
                entry = "\n" + entry
            break
    else:
        ins_pos = len(tree.children)
    entry_tree = marko.block.Document(entry)
    entry_tree.children.extend(marko.block.Document("\n").children)
    tree.children[ins_pos:ins_pos] = entry_tree.children
    with open(changelog, "wt") as f:
        f.write(md.render(tree))


def update_workflow(workflow, version=None, bump=None):
    with open(workflow, "rt") as f:
        txt = f.read()
    code = json.loads(txt)
    try:
        old_version = code["release"]
    except KeyError:
        raise RuntimeError(f'{workflow} does not have a "release" metadata entry')
    if not version:
        if not old_version:
            raise RuntimeError(f'{workflow}: "release" metadata entry is empty')
        version = vbump(old_version, bump=bump)
    # no json tools for the update (we'd get a huge diff due to whitespace change)
    pattern = rf'"release":\s*"{old_version}"'
    repl = f'"release": "{version}"'
    with open(workflow, "wt") as f:
        f.write(re.sub(pattern, repl, txt, 1))
    return version


def find_repos(paths, exclude=()):
    """\
    Find all workflow directories below each path in ``paths``.

    Same as ``planemo ci_find_repos``.
    """
    ctx = PlanemoContext()
    kwargs = dict(
        recursive=True, fail_fast=True, chunk_count=1, chunk=0, exclude=exclude
    )
    raw_repos = [_.path for _ in find_raw_repositories(ctx, paths, **kwargs)]
    return [Path(_) for _ in filter_paths(ctx, raw_repos, path_type="repo", **kwargs)]


def main(args):
    if args.date:
        args.date = datetime.datetime.strptime(args.date, DATE_FMT)
    else:
        args.date = datetime.date.today()
    args.bump = Bump[args.bump]
    md = marko.Markdown(renderer=Renderer)
    for repo in find_repos(args.root, exclude=args.exclude):
        print(f"processing {repo}")
        wf_id = get_wf_id(repo)
        version = update_workflow(repo / wf_id, version=args.version, bump=args.bump)
        msg = f"Update for version {version}." if args.msg is None else args.msg
        update_changelog(
            repo / "CHANGELOG.md",
            md,
            version,
            msg,
            date=args.date,
            entry_type=args.entry_type,
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument(
        "root",
        metavar="ROOT_DIR",
        help="top-level directory",
        nargs="*",
        default=[os.getcwd()],
    )
    parser.add_argument(
        "--exclude",
        metavar="PATH",
        nargs="*",
        default=(),
        help="paths to exclude while searching for workflow repos",
    )
    parser.add_argument(
        "-v",
        "--version",
        metavar="STRING",
        help="set new workflow version to this value (ignores '-b')",
    )
    parser.add_argument("-m", "--msg", metavar="STRING", help="log message")
    parser.add_argument("-d", "--date", metavar="STRING", help="log date as YYYY-MM-DD")
    parser.add_argument(
        "-t",
        "--entry-type",
        metavar="|".join(ENTRY_TYPES),
        choices=ENTRY_TYPES,
        default="Changed",
        help="log entry type",
    )
    parser.add_argument(
        "-b",
        "--bump",
        metavar=BUMP_METAVAR,
        choices=BUMP_CHOICES,
        default="MICRO",
        help="version part to bump",
    )
    main(parser.parse_args())
