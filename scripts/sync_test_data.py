#!/usr/bin/env python
"""Mirror remote workflow test data (Zenodo and other URLs) to depot.galaxyproject.org.

Every ``location:`` URL in the workflow test files is downloaded, its hashes are
checked against the ``hashes:`` declared next to it, and the file is uploaded
with rsync to content-addressed paths, one per hash function, hard linked to
each other and sharded by the first two hex digits of the hash like git objects::

    <base-url>/md5/<md5[:2]>/<md5>
    <base-url>/sha1/<sha1[:2]>/<sha1>
    <base-url>/sha256/<sha256[:2]>/<sha256>
    <base-url>/sha512/<sha512[:2]>/<sha512>

so a client can find the mirror copy from any hash declared in a test, e.g.
planemo's ``--test_data_mirror``. A ``manifest.json`` at the root of the mirror
maps each source URL to the SHA-256 of its content and records the original
filename, size and all hashes of every stored file. Uploaded files are fetched
back over HTTPS and re-hashed before the manifest is updated, so the manifest
only lists files that are known to be available. Consumers should still check
the hash of what they download, as Galaxy does with declared hashes.
"""

import argparse
import email.message
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.parse
from dataclasses import (
    dataclass,
    field,
)
from pathlib import Path
from typing import (
    Callable,
    Dict,
    Iterator,
    List,
    Optional,
    Set,
    Tuple,
    TypeVar,
)

import requests
import yaml

DEFAULT_BASE_URL = "https://depot.galaxyproject.org/iwc-test-data/"
MANIFEST_NAME = "manifest.json"
MANIFEST_VERSION = 1
USER_AGENT = "iwc-test-data-sync (+https://github.com/galaxyproject/iwc)"
# Galaxy's hash_function names mapped to hashlib names
HASH_FUNCTIONS = {
    "MD5": "md5",
    "SHA-1": "sha1",
    "SHA-256": "sha256",
    "SHA-512": "sha512",
}
# one directory of hard links per hash function, the sha256 one is canonical
HASH_DIRECTORIES = list(HASH_FUNCTIONS.values())
CHUNK_SIZE = 1024 * 1024
MAX_FILENAME_LENGTH = 200
MAX_RETRY_WAIT = 300
TRANSIENT_EXCEPTIONS = (requests.ConnectionError, requests.Timeout, requests.exceptions.ChunkedEncodingError)

T = TypeVar("T")


class SyncError(Exception):
    pass


class UploadError(SyncError):
    """Uploading to the mirror failed, which would fail for every other file too."""


class TransientError(SyncError):
    def __init__(self, message: str, wait: Optional[float] = None):
        super().__init__(message)
        self.wait = wait


@dataclass
class RemoteFile:
    url: str
    # declared hashes, keyed by hashlib name
    hashes: Dict[str, str] = field(default_factory=dict)
    test_files: Set[str] = field(default_factory=set)
    # problems with the test files' declaration of this URL, it is not mirrored if there are any
    problems: List[str] = field(default_factory=list)

    @property
    def description(self) -> str:
        return f"{self.url} (used in {', '.join(sorted(self.test_files))})"


def mirror_path(function: str, value: str) -> str:
    """Path of a file below the mirror root, sharded so no directory gets huge."""
    return f"{function}/{value[:2]}/{value}"


def find_test_files(paths: List[Path]) -> Iterator[Path]:
    for path in paths:
        if path.is_file():
            yield path
        elif path.is_dir():
            yield from sorted(path.glob("**/*test*.yml"))
        else:
            raise SyncError(f"{path} does not exist")


def iter_locations(node, test_file: str) -> Iterator[RemoteFile]:
    if isinstance(node, dict):
        location = node.get("location")
        if isinstance(location, str) and location.startswith(("http://", "https://")):
            remote_file = RemoteFile(url=location, test_files={test_file})
            for entry in node.get("hashes") or []:
                if not isinstance(entry, dict) or "hash_value" not in entry:
                    remote_file.problems.append(f"{test_file}: invalid hashes entry {entry!r}")
                    continue
                function = HASH_FUNCTIONS.get(entry.get("hash_function"))
                if function is None:
                    remote_file.problems.append(
                        f"{test_file}: unsupported hash function {entry.get('hash_function')!r}"
                    )
                    continue
                remote_file.hashes[function] = str(entry["hash_value"]).lower()
            yield remote_file
        for value in node.values():
            yield from iter_locations(value, test_file)
    elif isinstance(node, list):
        for value in node:
            yield from iter_locations(value, test_file)


def collect_remote_files(paths: List[Path]) -> Tuple[Dict[str, RemoteFile], List[str]]:
    """Return the remote files declared in the test files, and errors for test files that cannot be read."""
    remote_files: Dict[str, RemoteFile] = {}
    errors = []
    for test_file in find_test_files(paths):
        try:
            with open(test_file) as fh:
                content = yaml.safe_load(fh)
        except (OSError, yaml.YAMLError) as e:
            errors.append(f"Cannot read {test_file}: {e}")
            continue
        for remote_file in iter_locations(content, str(test_file)):
            existing = remote_files.get(remote_file.url)
            if existing is None:
                remote_files[remote_file.url] = remote_file
                continue
            existing.problems.extend(remote_file.problems)
            for function, value in remote_file.hashes.items():
                if existing.hashes.setdefault(function, value) != value:
                    existing.problems.append(
                        f"{function} declared as {existing.hashes[function]} in "
                        f"{', '.join(sorted(existing.test_files))} but as {value} in {test_file}"
                    )
            existing.test_files.add(str(test_file))
    return remote_files, errors


def filename_for(url: str, response: requests.Response) -> str:
    name = None
    disposition = response.headers.get("Content-Disposition")
    if disposition:
        message = email.message.Message()
        message["Content-Disposition"] = disposition
        name = message.get_filename()
    if not name:
        parsed = urllib.parse.urlparse(url)
        parts = [part for part in parsed.path.split("/") if part]
        # Zenodo's https://zenodo.org/records/<id>/files/<name>/content
        if len(parts) > 1 and parts[-1] == "content":
            parts.pop()
        name = urllib.parse.unquote(parts[-1]) if parts else ""
        # e.g. NCBI GEO's https://www.ncbi.nlm.nih.gov/geo/download/?acc=...&file=<name>
        query = urllib.parse.parse_qs(parsed.query)
        if "." not in name and query.get("file"):
            name = query["file"][0]
    name = re.sub(r"[^A-Za-z0-9._+-]", "_", os.path.basename(name)).lstrip(".")
    if len(name) > MAX_FILENAME_LENGTH:
        extension = "".join(Path(name).suffixes)[-50:]
        name = name[: MAX_FILENAME_LENGTH - len(extension)] + extension
    return name or "data"


class Session:
    def __init__(self, retries: int, delay: float):
        self.session = requests.Session()
        self.session.headers["User-Agent"] = USER_AGENT
        # hash the bytes as stored, not a decoded transfer encoding
        self.session.headers["Accept-Encoding"] = "identity"
        self.retries = retries
        self.delay = delay

    def request(self, method: str, url: str, **kwd) -> requests.Response:
        """Make a single request, raising TransientError for failures worth retrying.

        404 responses are returned so callers can tell a missing file apart from a failure.
        """
        try:
            response = self.session.request(method, url, timeout=120, allow_redirects=True, **kwd)
        except TRANSIENT_EXCEPTIONS as e:
            raise TransientError(f"{method} {url} failed: {e}")
        except requests.RequestException as e:
            raise SyncError(f"{method} {url} failed: {e}")
        if response.status_code < 400 or response.status_code == 404:
            return response
        response.close()
        error = f"{method} {url} failed: HTTP {response.status_code}"
        if response.status_code in (408, 429) or response.status_code >= 500:
            retry_after = response.headers.get("Retry-After", "")
            raise TransientError(error, wait=float(retry_after) if retry_after.isdigit() else None)
        raise SyncError(error)

    def retry(self, func: Callable[[], T]) -> T:
        for attempt in range(self.retries + 1):
            try:
                return func()
            except TransientError as e:
                if attempt == self.retries:
                    raise SyncError(f"{e} (after {self.retries} retries)")
                wait = min(e.wait if e.wait is not None else self.delay * 2**attempt, MAX_RETRY_WAIT)
                print(f"  {e}, retrying in {wait:.0f}s", flush=True)
                time.sleep(wait)
        raise AssertionError("unreachable")


def download(session: Session, url: str, directory: Path) -> Tuple[Path, str, int, Dict[str, str]]:
    """Stream ``url`` into ``directory``, returning (path, filename, size, hashes)."""

    def attempt():
        with session.request("GET", url, stream=True) as response:
            if response.status_code == 404:
                raise SyncError(f"{url} not found (HTTP 404)")
            name = filename_for(url, response)
            if response.headers.get("Content-Type", "").startswith("text/html") and not name.endswith(
                (".html", ".htm")
            ):
                raise SyncError(f"{url} returned an HTML page instead of {name}")
            digests = {function: hashlib.new(function) for function in HASH_FUNCTIONS.values()}
            size = 0
            fd, tmp_name = tempfile.mkstemp(dir=directory)
            tmp_path = Path(tmp_name)
            try:
                with os.fdopen(fd, "wb") as out:
                    for chunk in response.iter_content(CHUNK_SIZE):
                        out.write(chunk)
                        size += len(chunk)
                        for digest in digests.values():
                            digest.update(chunk)
                length = response.headers.get("Content-Length")
                if length is not None and length != str(size):
                    raise TransientError(f"GET {url} was cut short: got {size} of {length} bytes")
            except TRANSIENT_EXCEPTIONS as e:
                tmp_path.unlink()
                raise TransientError(f"GET {url} failed: {e}")
            except requests.RequestException as e:
                tmp_path.unlink()
                raise SyncError(f"GET {url} failed: {e}")
            except BaseException:
                tmp_path.unlink()
                raise
        return tmp_path, name, size, {function: digest.hexdigest() for function, digest in digests.items()}

    return session.retry(attempt)


def verify_mirror_copy(session: Session, base_url: str, entry: dict, full: bool) -> Optional[str]:
    """Return None if the mirror copy described by ``entry`` is available and intact, else the problem.

    Raises SyncError if the mirror could not be checked.
    """
    url = urllib.parse.urljoin(base_url, entry["path"])

    def head(url=url):
        response = session.request("HEAD", url, headers={"Cache-Control": "no-cache"})
        if response.status_code != 200:
            return f"{url}: HTTP {response.status_code}"
        length = response.headers.get("Content-Length")
        if length is None:
            return f"{url}: no Content-Length"
        if length != str(entry["size"]):
            return f"{url}: size is {length}, expected {entry['size']}"
        return None

    def get():
        digest = hashlib.sha256()
        with session.request("GET", url, stream=True, headers={"Cache-Control": "no-cache"}) as response:
            if response.status_code != 200:
                return f"HTTP {response.status_code}"
            try:
                for chunk in response.iter_content(CHUNK_SIZE):
                    digest.update(chunk)
            except TRANSIENT_EXCEPTIONS as e:
                raise TransientError(f"GET {url} failed: {e}")
        if digest.hexdigest() != entry["sha256"]:
            return f"sha256 is {digest.hexdigest()}, expected {entry['sha256']}"
        return None

    problem = session.retry(get if full else head)
    if problem:
        return problem
    # the other hash paths are hard links to the same file, checking that they are served is enough
    for function in HASH_DIRECTORIES:
        path = mirror_path(function, entry[function])
        if path != entry["path"]:
            problem = session.retry(lambda: head(urllib.parse.urljoin(base_url, path)))
            if problem:
                return problem
    return None


def load_manifest(session: Session, base_url: str, init: bool) -> dict:
    url = urllib.parse.urljoin(base_url, MANIFEST_NAME)

    def get():
        return session.request("GET", url, headers={"Cache-Control": "no-cache"})

    response = session.retry(get)
    if response.status_code == 404:
        if not init:
            raise SyncError(f"{url} not found, pass --init-manifest to start a new mirror")
        return {"version": MANIFEST_VERSION, "files": {}, "urls": {}, "new": True}
    if response.status_code != 200:
        raise SyncError(f"GET {url} returned HTTP {response.status_code}")
    try:
        manifest = response.json()
    except ValueError as e:
        raise SyncError(f"{url} is not valid JSON: {e}")
    if not isinstance(manifest, dict) or manifest.get("version") != MANIFEST_VERSION:
        raise SyncError(f"{url} is not a version {MANIFEST_VERSION} manifest")
    return manifest


def write_manifest(manifest: dict, path: Path):
    tmp_path = path.with_suffix(".tmp")
    with open(tmp_path, "w") as fh:
        json.dump(manifest, fh, indent=1, sort_keys=True)
        fh.write("\n")
    tmp_path.chmod(0o644)
    tmp_path.replace(path)


def rsync(sources: List[Path], destination: str, ssh_command: Optional[str]):
    # only new files and replacements for broken mirror copies are staged, so always send them:
    # rsync's size and mtime check would skip a broken copy that happens to match both
    command = ["rsync", "--recursive", "--times", "--perms", "--hard-links", "--ignore-times"]
    if ssh_command:
        command += ["-e", ssh_command]
    command += [str(source) for source in sources] + [destination]
    print("  " + " ".join(command), flush=True)
    try:
        subprocess.run(command, check=True)
    except (OSError, subprocess.CalledProcessError) as e:
        raise UploadError(f"Uploading {', '.join(map(str, sources))} failed: {e}")


class Mirror:
    def __init__(self, args, session: Session, manifest: dict):
        self.args = args
        self.session = session
        # a new manifest is uploaded even if nothing gets mirrored
        self.manifest_changed = bool(manifest.pop("new", False))
        self.manifest = manifest
        self.staging = Path(tempfile.mkdtemp(prefix="iwc-test-data-"))
        # sha256 of manifest entries whose mirror copy is broken and must be uploaded again
        self.broken: Set[str] = set()
        # (url, sha256) pairs downloaded but not yet uploaded
        self.pending: List[Tuple[str, str]] = []
        self.pending_files: Dict[str, dict] = {}
        self.pending_bytes = 0
        self.uploaded = 0
        self.errors: List[str] = []

    def error(self, message: str):
        print(f"  ERROR: {message}", flush=True)
        self.errors.append(message)

    def needs_mirroring(self, remote_file: RemoteFile) -> bool:
        sha256 = self.manifest["urls"].get(remote_file.url)
        entry = self.manifest["files"].get(sha256)
        if entry is None:
            return True
        mismatched = [f for f, value in remote_file.hashes.items() if entry.get(f) != value]
        if mismatched:
            print(f"{remote_file.url}: mirror copy does not match declared {', '.join(mismatched)}, re-mirroring")
            return True
        if sha256 in self.broken:
            return True
        if self.args.check_existing:
            try:
                problem = verify_mirror_copy(
                    self.session, self.args.base_url, entry, full=self.args.check_existing == "full"
                )
            except SyncError as e:
                self.error(f"Cannot check mirror copy of {remote_file.url}: {e}")
                return False
            if problem:
                print(f"{remote_file.url}: mirror copy {entry['path']} is not usable ({problem}), re-mirroring")
                # the manifest keeps the entry until a new copy has been uploaded and checked
                self.broken.add(sha256)
                return True
        return False

    def add(self, remote_file: RemoteFile):
        print(f"Downloading {remote_file.url}", flush=True)
        time.sleep(self.args.pause)
        tmp_path, name, size, hashes = download(self.session, remote_file.url, self.staging)
        mismatched = [
            f"{function} is {hashes[function]}, declared {value}"
            for function, value in remote_file.hashes.items()
            if hashes[function] != value
        ]
        if mismatched:
            tmp_path.unlink()
            raise SyncError(f"{remote_file.description}: " + "; ".join(mismatched))
        sha256 = hashes["sha256"]
        entry = self.pending_files.get(sha256)
        if entry is None and sha256 not in self.broken:
            entry = self.manifest["files"].get(sha256)
        if entry is None:
            entry = {"path": mirror_path("sha256", sha256), "name": name, "size": size, **hashes}
            # mkstemp creates the file readable by its owner only, rsync --perms copies the mode
            tmp_path.chmod(0o644)
            for function in HASH_DIRECTORIES:
                target = self.staging / mirror_path(function, hashes[function])
                # rsync --perms copies directory modes too, set them explicitly instead of relying on the umask
                for directory in (target.parent.parent, target.parent):
                    directory.mkdir(exist_ok=True)
                    directory.chmod(0o755)
                os.link(tmp_path, target)
            tmp_path.unlink()
            self.pending_files[sha256] = entry
            self.pending_bytes += size
        else:
            tmp_path.unlink()
        print(f"  {size} bytes, sha256 {sha256}", flush=True)
        self.pending.append((remote_file.url, sha256))
        if self.pending_bytes >= self.args.batch_bytes:
            self.flush()

    def flush(self):
        if not self.pending:
            if self.manifest_changed and not self.args.dry_run:
                self.upload_manifest()
            return
        pending, pending_files = self.pending, self.pending_files
        self.pending, self.pending_files, self.pending_bytes = [], {}, 0
        try:
            if self.args.dry_run:
                self.uploaded += len(pending_files)
                return
            if pending_files:
                print(f"Uploading {len(pending_files)} file(s)", flush=True)
                rsync(
                    [self.staging / function for function in HASH_DIRECTORIES],
                    self.args.rsync_destination,
                    self.args.rsync_ssh,
                )
            for sha256, entry in pending_files.items():
                try:
                    problem = verify_mirror_copy(self.session, self.args.base_url, entry, full=True)
                except SyncError as e:
                    problem = str(e)
                if problem:
                    self.error(f"Uploaded {entry['path']} is not available as expected: {problem}")
                    continue
                self.manifest["files"][sha256] = entry
                self.broken.discard(sha256)
                self.uploaded += 1
            for url, sha256 in pending:
                if sha256 in self.manifest["files"] and sha256 not in self.broken:
                    self.manifest["urls"][url] = sha256
            self.upload_manifest()
        finally:
            for function in HASH_DIRECTORIES:
                shutil.rmtree(self.staging / function, ignore_errors=True)

    def upload_manifest(self):
        manifest_path = self.staging / MANIFEST_NAME
        write_manifest(self.manifest, manifest_path)
        rsync([manifest_path], self.args.rsync_destination, self.args.rsync_ssh)
        self.manifest_changed = False


def non_negative(type_):
    def convert(value):
        value = type_(value)
        if value < 0:
            raise argparse.ArgumentTypeError(f"{value} is negative")
        return value

    return convert


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "paths", nargs="*", type=Path, default=[Path("workflows")], help="test files or directories to scan"
    )
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL, help="public URL of the mirror (default: %(default)s)")
    parser.add_argument(
        "--rsync-destination",
        default=os.environ.get("DEPOT_RSYNC_DESTINATION"),
        help="rsync destination of the mirror root, ending in '/' or ':' (default: $DEPOT_RSYNC_DESTINATION)",
    )
    parser.add_argument("--rsync-ssh", help="remote shell for rsync, e.g. 'ssh -i key'")
    parser.add_argument(
        "--init-manifest", action="store_true", help="start a new manifest if the mirror does not have one yet"
    )
    parser.add_argument(
        "--check-existing",
        choices=["size", "full"],
        help="check that already mirrored files are still available (HEAD and compare size, or download and hash)",
    )
    parser.add_argument("--dry-run", action="store_true", help="download and check hashes, but do not upload")
    parser.add_argument(
        "--batch-bytes", type=non_negative(int), default=2 * 1024**3, help="upload once this much data is staged"
    )
    parser.add_argument("--retries", type=non_negative(int), default=5)
    parser.add_argument("--delay", type=non_negative(float), default=5.0, help="base delay in seconds between retries")
    parser.add_argument(
        "--pause", type=non_negative(float), default=1.0, help="seconds to wait before each download from a source"
    )
    args = parser.parse_args(argv)
    if not args.base_url.endswith("/"):
        args.base_url += "/"
    if not args.dry_run and not args.rsync_destination:
        parser.error("--rsync-destination (or $DEPOT_RSYNC_DESTINATION) is required unless --dry-run is used")

    session = Session(args.retries, args.delay)
    remote_files, errors = collect_remote_files(args.paths)
    manifest = load_manifest(session, args.base_url, args.init_manifest)
    mirror = Mirror(args, session, manifest)
    for error in errors:
        mirror.error(error)
    try:
        to_mirror = []
        for remote_file in remote_files.values():
            if remote_file.problems:
                mirror.error(f"Not mirroring {remote_file.description}: " + "; ".join(remote_file.problems))
            elif mirror.needs_mirroring(remote_file):
                to_mirror.append(remote_file)
        print(f"{len(remote_files)} remote file(s) in tests, {len(to_mirror)} to mirror", flush=True)
        for remote_file in to_mirror:
            try:
                mirror.add(remote_file)
            except UploadError:
                raise
            except (SyncError, OSError) as e:
                mirror.error(str(e))
        mirror.flush()
    finally:
        shutil.rmtree(mirror.staging, ignore_errors=True)

    without_hashes = sorted(url for url, remote_file in remote_files.items() if not remote_file.hashes)
    print(f"\nMirrored {mirror.uploaded} new file(s){' (dry run)' if args.dry_run else ''}.")
    if without_hashes:
        print(
            f"{len(without_hashes)} URL(s) have no declared hashes; their mirror copy is only checked against itself:"
        )
        for url in without_hashes:
            print(f"  {url}")
    if mirror.errors:
        print(f"\n{len(mirror.errors)} error(s):")
        for error in mirror.errors:
            print(f"  {error}")
        return 1
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except SyncError as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
