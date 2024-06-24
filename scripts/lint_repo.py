# This script will check that the directory
# matches the IWC expectations
# and avoid deployment failures
import os
import yaml
import json

# Check all required files are present
required_files = \
    ['README.md', 'CHANGELOG.md', '.dockstore.yml']
for required_file in required_files:
    if not os.path.exists(required_file):
        raise Exception(f"The file {required_file} is" \
                        " missing but required.")

# Get the version from the CHANGELOG.md
version = None
with open('CHANGELOG.md', 'r') as f:
    for line in f:
        if line.startswith('## ['):
            version = line.split(']')[0].replace('## [', '')
            print(f"Found version {version} in CHANGELOG.")
            break

if version is None:
    raise Exception("No version found in CHANGELOG. " \
                    "The version should be in a line that starts like " \
                    "'## [version number]'")

# Check the .dockstore.yml
with open('.dockstore.yml', 'r') as f:
    y = yaml.load(f, Loader=yaml.SafeLoader)

# Check the version
assert y.get('version') == 1.2, \
    ".dockstore.yml version must be 1.2"

# Check workflows are described
assert 'workflows' in y, \
    ".dockstore.yml must contains workflows"

workflow_files = {}
for workflow_entry in y['workflows']:
    workflow_name = workflow_entry.get('name')
    # Check the name has no space
    assert ' ' not in workflow_name, \
        "Dockstore does not accept workflow names with space." \
        f"Change '{workflow_name}' in .dockstore.yml."
    # Check the name is not present twice
    if workflow_name in workflow_files:
        raise Exception("Multiple entries with the name " \
                        |f" {workflow_name} in .dockstore.yml")
    # Check the subclass is Galaxy
    assert workflow_entry.get('subclass') == "Galaxy", \
        f"Subclass of workflow {workflow_name} in .dockstore.yml" \
        "must be 'Galaxy'."
    # Store the primaryDescriptorPath
    workflow_files[workflow_name] = '.' + workflow_entry.get('primaryDescriptorPath')
    # Check there is at least one test file
    assert len(workflow_entry.get('testParameterFiles')) > 0, \
        f"Workflow {workflow_name} should have at least one " \
        "testParameterFiles in the .dockstore.yml."
    # Check the test files exists
    for test_file in workflow_entry.get('testParameterFiles'):
        assert os.path.exists(f'.{test_file}'), \
            f"The test file {test_file} written in the .dockstore.yml does not exists."
    # Check there is at least one author
    assert len(workflow_entry.get('authors')) > 0, \
        f"Workflow {workflow_name} should have at least one " \
        "'authors' in the .dockstore.yml."
    # Check there is not mailto
    for author in workflow_entry.get('authors'):
        if 'email' in author:
            if author['email'].startswith('mailto:'):
                raise Exception("email field of the .dockstore.yml must not "
                                "contain 'mailto:'")


assert len(workflow_files) > 0, \
    "No workflow described in the .dockstore.yml"

# For each workflow
for workflow_name, workflow_file in workflow_files.items():
    # Check the file exists
    assert os.path.exists(workflow_file), \
        f"The workflow file {workflow_file} described in the .dockstore.yml" \
        " does not exists."
    # Check the version matches what is in the CHANGELOG.
    with open(workflow_file, 'r') as f:
        w = json.load(f)
    assert 'release' in w, \
        f"The workflow {workflow_file} has no release."
    assert w.get('release') == version, \
        f"The release of workflow {workflow_file} does not match " \
        "the version in the CHANGELOG."

print("Repository seems correct.")
