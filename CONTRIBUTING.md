# Contributing

This document describes how to contribute to this repository. Pull
requests containing bug fixes, updates, and extensions to the existing
tools and tool suites in this repository will be considered for
inclusion.

## How to Contribute

* Make sure you have a [GitHub account](https://github.com/signup/free)
* Make sure you have git [installed](https://help.github.com/articles/set-up-git)
* Fork the repository on [GitHub](https://github.com/galaxyproject/tools-iuc/fork)
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
* Worklows without tests

## Tests

Contributed tools should include reasonable tests with small example data.

The IWC strongly recommends testing with [planemo](https://github.com/galaxyproject/planemo/), which provides a simple command line utility for testing functionality

```console
$ planemo test --install_galaxy my_tool.xml (todo: fix this...)
```

## Requirements for Contributions

Before a PR will be accepted, meaningful review for correctnessa and quality will need to be established.

* Tools must contain tests (and test-data)
* Continuous integration tests must pass: 
    * The tests must pass (`planemo test --install_galaxy my_tool.xml`)
    * The tools must pass linting by planemo (`planemo lint my_tool.xml`)
    * Any Python or R script must pass linting with `flake8` and `lintr`, respectively
* If there's a relevant paper for the tool, it should be cited in a [citation](https://docs.galaxyproject.org/en/latest/dev/schema.html#tool-citations) block
* The tool must be licensed to allow use by anyone. The OSI maintains a [list of appropriate](https://opensource.org/licenses/alphabetical) licenses
* At least one approving review by an IWC member
