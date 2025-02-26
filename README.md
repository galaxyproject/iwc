# IWC - Intergalactic Workflow Commission

[![Galaxy Workflow Linting and Tests](https://github.com/galaxyproject/iwc/actions/workflows/workflow_test.yml/badge.svg?branch=main)](https://github.com/galaxyproject/iwc/actions/workflows/workflow_test.yml/badge.svg?branch=main)
[![Gitter](https://badges.gitter.im/galaxyproject/iwc.svg)](https://gitter.im/galaxyproject/iwc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## About the IWC

The Intergalactic Workflow Commission (IWC) curates and maintains a collection of high-quality Galaxy workflows for the scientific community. Our mission is to provide researchers with reliable, tested, and well-documented workflows for diverse analytical tasks.

## Workflow Collection

Workflows are organized by scientific domain in the [workflows](workflows/) directory and publicly available through:
- [Dockstore](https://dockstore.org/organizations/iwc)
- [WorkflowHub](https://workflowhub.eu/search?utf8=%E2%9C%93&q=IWC#workflows)

Every workflow in our collection undergoes:
- Rigorous peer review
- Automated testing before publication and with each Galaxy release
- Validation against [Galaxy best practices](https://planemo.readthedocs.io/en/latest/best_practices_workflows.html)
- Semantic versioning via GitHub releases

Each workflow includes comprehensive metadata:
- License information
- Author attribution
- Institutional affiliations

The IWC continuously develops resources for workflow creators, including best practices guides, technical tips, troubleshooting FAQs, and community assistance for developing high-quality Galaxy workflows.

## Using IWC Workflows

### Importing into Your Galaxy Instance

To import IWC workflows into your own Galaxy instance:

1. Navigate to the Galaxy interface and click "Workflows" → "Import"
2. Click the "search form" link
3. Select a TRS server from the drop-down menu
4. Enter one of the following search terms:
   - `organization:iwc` (for WorkflowHub)
   - `organization:iwc-workflows` (for Dockstore)

![Workflow Import Process](static/iwc-import.gif)

### Pre-installed on Public Galaxy Servers

All IWC workflows are automatically available on major public Galaxy servers:
- [Galaxy Main (US)](https://usegalaxy.org/workflows/list_published)
- [Galaxy Europe](https://usegalaxy.eu/workflows/list_published)
- [Galaxy Australia](https://usegalaxy.org.au/workflows/list_published)

No import required - simply navigate to the published workflows section on these servers.

## Contributing Your Workflows

We welcome contributions from the scientific community! Anyone can submit production-ready Galaxy workflows for inclusion in the IWC collection.

### Contribution Process

1. Review our detailed [workflow contribution guidelines](workflows/README.md#adding-workflows)
2. Prepare your workflow following the specified format and requirements
3. Submit a pull request with your workflow

After submission, your workflow will undergo:
- Automated linting checks
- Comprehensive testing
- Peer review by IWC members

Upon approval, your workflow will be:
- Uploaded to a dedicated repository in the [iwc-workflows](https://github.com/iwc-workflows) organization
- Published on [Dockstore](https://dockstore.org/organizations/iwc)
- Registered in [WorkflowHub](https://workflowhub.eu/projects/33#workflows)

### Join the IWC Community

We encourage active participation in the IWC! Join our community of workflow reviewers and contributors:

1. Share your domain expertise by commenting on [this issue](https://github.com/galaxyproject/iwc/issues/4)
2. Help review incoming workflow submissions
3. Participate in discussions on our [Gitter channel](https://gitter.im/galaxyproject/iwc)

The IWC thrives on diverse expertise and collaborative effort.
