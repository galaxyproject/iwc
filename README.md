# IWC - Intergalactic Workflow Commission

[![Galaxy Workflow Linting and Tests](https://github.com/galaxyproject/iwc/actions/workflows/workflow_test.yml/badge.svg?branch=main)](https://github.com/galaxyproject/iwc/actions/workflows/workflow_test.yml/badge.svg?branch=main)

## The IWC maintains high-quality Galaxy Workflows and defines

### Reproducibility is important. Our goals are to

- Foster workflow use
- Incorporate versioning
- Capture metadata: (names, versions, authors, use cases, etc.)
- Help scientists find workflows!

### Methods Proposal

- discover workflows
- establish quality standards (version numbers, tools exist, author is set, training available, test exists ...)
- automated testing of workflows utilizing [Planemo](https://github.com/galaxyproject/planemo) test
- two layers of test data:
  - basic functionality testing (quick to run, tools exist)
  - downsampled data (validity of workflow results)

### Contributing a Workflow

Anyone can contribute a Galaxy Workflow. Please check out the [Adding workflow guidelines](workflows/README.md#adding-workflows)
If linting passes, tests pass, and human review passes, the PR is merged and

- uploaded to a separate repository in <https://github.com/iwc-workflows> for versioning purposes
- registered in the [iwc organization](https://dockstore.org/organizations/iwc) on [dockstore](https://dockstore.org/)
- registered in [workflowhub](https://workflowhub.eu/projects/33#workflows)
