import json

import pytest

import site_config
from site_config import OPTIONAL_KEYS, SiteConfigError, load_site_config

DEFAULTS = json.loads(site_config.DEFAULTS_PATH.read_text())


def lab_override(**changes):
    override = {key: value for key, value in DEFAULTS.items() if key not in OPTIONAL_KEYS}
    override.update(
        name="IWC Lab",
        repoUrl="https://github.com/galaxyproject/iwc-lab",
        trsOrg="iwc-lab-workflows",
        analytics=None,
        sentry=None,
    )
    override.update(changes)
    return override


def write_override(tmp_path, override):
    path = tmp_path / "lab-site-config.json"
    path.write_text(json.dumps(override))
    return {"SITE_CONFIG": str(path)}


def test_defaults_are_iwc():
    config = load_site_config({})
    assert config["trsOrg"] == "iwc-workflows"
    # The literal the manifest script used before the config existed
    assert config["rawDataBase"] == "https://raw.githubusercontent.com/galaxyproject/iwc/main/"
    assert {key: config[key] for key in DEFAULTS} == DEFAULTS


def test_optional_keys_exist():
    assert OPTIONAL_KEYS <= set(DEFAULTS)


def test_override_replaces_top_level_keys(tmp_path):
    config = load_site_config(write_override(tmp_path, lab_override()))
    assert config["trsOrg"] == "iwc-lab-workflows"
    assert config["analytics"] is None
    assert config["rawDataBase"] == "https://raw.githubusercontent.com/galaxyproject/iwc-lab/main/"
    # Optional keys the override left out keep IWC's value
    assert config["collectionFallback"] == "none"


def test_raw_data_base_follows_branch(tmp_path):
    config = load_site_config(write_override(tmp_path, lab_override(repoBranch="dev")))
    assert config["rawDataBase"].endswith("/galaxyproject/iwc-lab/dev/")


@pytest.mark.parametrize("key", sorted(set(DEFAULTS) - OPTIONAL_KEYS))
def test_override_must_set_every_required_key(tmp_path, key):
    override = lab_override()
    del override[key]
    with pytest.raises(SiteConfigError, match=f"must set: {key}"):
        load_site_config(write_override(tmp_path, override))


def test_override_rejects_unknown_keys(tmp_path):
    with pytest.raises(SiteConfigError, match="unknown keys: trsOrganisation"):
        load_site_config(write_override(tmp_path, lab_override(trsOrganisation="x")))


@pytest.mark.parametrize("repo_url", ["https://gitlab.com/a/b", "https://github.com/galaxyproject", "galaxyproject/iwc"])
def test_repo_url_must_be_a_github_repo(tmp_path, repo_url):
    with pytest.raises(SiteConfigError, match="repoUrl"):
        load_site_config(write_override(tmp_path, lab_override(repoUrl=repo_url)))


def test_collection_fallback_is_checked(tmp_path):
    with pytest.raises(SiteConfigError, match="collectionFallback"):
        load_site_config(write_override(tmp_path, lab_override(collectionFallback="dir")))


def test_about_markdown_resolves_against_the_config_file(tmp_path, monkeypatch):
    environ = write_override(tmp_path, lab_override(aboutMarkdown="about.md"))
    monkeypatch.chdir(tmp_path.parent)
    assert load_site_config(environ)["aboutMarkdown"] == str((tmp_path / "about.md").resolve())


def test_relative_site_config_resolves_against_cwd(tmp_path, monkeypatch):
    write_override(tmp_path, lab_override())
    monkeypatch.chdir(tmp_path)
    assert load_site_config({"SITE_CONFIG": "lab-site-config.json"})["name"] == "IWC Lab"
