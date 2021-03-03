## Contributing Guidelines

This document intends to establish guidelines which build a transparent, open mechanism for deciding how to evolve the papiNet API standard. The papiNet Central Working Group (CWG) will follow these processes when merging changes from external contributors or from the CWG itself. This guideline document will be adjusted as practicality dictates.

## Tracking Process

GitHub is the medium of record for all papiNet API standard updates.

According to the _git-flow_ branching model, as defined in the blog post [_A successful Git branching model_](https://nvie.com/posts/a-successful-git-branching-model/) written by [Vincent Driessen](https://nvie.com/about/) in 2010, we will have:

* The `main` branch
* The `develop` branch
* _Feature_ branches, with names starting with the `/feature/` prefix
* _Release_ branches, with names starting with the `/release/` prefix
* _Hotfix_ branches, with names starting with the `/hotfix` prefix

The `main` and `develop` branches have an infinite lifetime.

The _feature_, _release_ and _hotfix_ branches have a limited lifetime. They SHOULD be deleted after being merged or abandoned.

The _feature_ branches MUST be created from the `develop` branch and eventually merged back (using a pull request) into the `develop` branch.

The _release_ branches MUST be created from the `develop` branch and eventually merged (using a pull request) into the `master` branch.

The _hotfix_ branches MUST be created from the `main` branch and eventually merged back (using a pull request) into the `main` branch.

The `main` branch will always contain the latest version of the standard located in the directory with the highest semantic version, `MAJOR.MINOR.PATCH/`.

The files located in the root directory are called the _supporting files_.

The `develop` branch will contain the latest delivered changes for the next release. These latest delivered changes MUST be located in either:

* the directory `MAJOR++.0.0/` if they are _incompatible_ changes
* the directory `MAJOR.MINOR++.0/` if they are _backwards compatible_ changes

The latest delivered changes located in `MAJOR.MINOR++.0/` SHOULD also be present within `MAJOR++.0.0/`.

For _bug fixes_ the directory `MAJOR.MINOR.PATCH++/` SHOULD only be present in a `hotfix/MAJOR.MINOR.PATCH++` branch.

In order to contribute to the papiNet standard, you MUST either:

* start a `feature/my_feature` branch created from the `develop` branch
* start a `hotfix/MAJOR.MINOR.PATCH++` branch from the `main` branch

As a maintainer, you can create/push these branches on the `papiNet-API` repository from the `papinet` GitHub account. As an external contributor, you MUST use your own fork. Both maintainers and external contributors MUST use pull request (PR) for merging their `feature/my_feature` branches into the `develop` branch, as well as for merging their `hotfix/MAJOR.MINOR.PATCH++` branches into the `master` branch.

Regularly, the maintainer MUST transfer the latest delivered changes of the `develop` branch to the `main` branch via release branches. They MUST either:

* start a `release/MAJOR++.0.0` branch to release _incompatible_ changes
* start a `release/MAJOR.MINOR++.0` branch to release  _backwards compatible_ changes

Changes of the _supporting files_ SHOULD be done using `hotfix/my_hotfix` branches.