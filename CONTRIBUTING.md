# Contributing

This document describes how to contribute to this repository. Pull
requests containing bug fixes, updates, and extensions to the existing
workflows in this repository will be considered for inclusion.

## How to contribute

* Make sure you have a [GitHub account](https://github.com/signup/free)
* Make sure you have git [installed](https://help.github.com/articles/set-up-git)
* Fork the repository on [GitHub](https://github.com/galaxyproject/iwc/fork)
* Make the desired modifications - consider using a [feature branch](https://github.com/Kunena/Kunena-Forum/wiki/Create-a-new-branch-with-git-and-manage-branches).
* Make sure you have added the necessary tests for your changes and they pass.
* Open a [pull request](https://help.github.com/articles/using-pull-requests)
  with these changes.

## What to contribute

* Galaxy workflows using [OSI licensed](https://opensource.org/licenses/alphabetical) tools
* Bug fixes
* Documentation improvements
* New test cases

## What not to contribute

* Things already wrapped and currently maintained by other users
* Workflows without tests

## Tests

Contributed workflows should include reasonable tests with small example data.

The IWC strongly recommends testing with [planemo](https://github.com/galaxyproject/planemo/), which provides a simple command line utility for testing functionality.

```console
$ planemo test my_workflow.ga
```

In some cases, you might find it simpler to run tests against an external Galaxy server:


```console
$ planemo test my_workflow.ga --galaxy_url https://usegalaxy.org --galaxy_user_key API_KEY
```

## Requirements for Contributions

Before a PR will be accepted, meaningful review for correctness and quality will need to be established.

* Tests (and test-data) must be provided for all workflows
* Continuous integration tests must pass: 
    * The tests must pass (`planemo test my_workflow.ga`)
    * The workflows must pass linting by planemo (`planemo lint my_workflow.ga`)
* If there's a relevant paper for the workflow, it should be cited in a the README file.
* The workflow must be licensed to allow use by anyone. The OSI maintains a [list of appropriate](https://opensource.org/licenses/alphabetical) licenses
* At least one approving review by an IWC member
