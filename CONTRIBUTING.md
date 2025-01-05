<!-- Copyright 2000-2024 Papinet SNC ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet. -->

# Contributing Guidelines

This document intends to establish guidelines which build a transparent, open mechanism for deciding how to evolve the papiNet API standard. The papiNet Central Working Group (CWG) will follow these processes when merging changes from external contributors or from the CWG itself. This guideline document will be adjusted as practicality dictates.

## Tracking Process

GitHub is the medium of record for all papiNet API standard updates.

We will use an adapted version of the _git-flow_ branching model, as defined in the blog post [_A successful Git branching model_](https://nvie.com/posts/a-successful-git-branching-model/) written by [Vincent Driessen](https://nvie.com/about/) in 2010.

We will have:

* The `main` branch
* The `develop` branch
* _Feature_ branches, with names starting with the `feature/` prefix
* _Hotfix_ branches, with names starting with the `hotfix/` prefix

The `main` and `develop` branches have an infinite lifetime.

The _feature_ and _hotfix_ branches have a limited lifetime. They SHOULD be deleted after being merged or abandoned.

The _feature_ branches MUST be created from the `develop` branch and eventually merged back **using a pull request** into the `develop` branch.

The _hotfix_ branches MUST be created from the `main` branch and eventually merged back **using a pull request** into the `main` branch.

The `main` branch will always contain the latest version of the standard located in the directory with the highest semantic version, `MAJOR.MINOR.PATCH/`.

The files located in the root directory are called the _supporting files_.

The `develop` branch will contain the latest delivered changes for the next release. These latest delivered changes MUST be located in either:

* the directory `MAJOR++.0.0/` if they are _incompatible_ changes
* the directory `MAJOR.MINOR++.0/` if they are _backwards compatible_ changes

The latest delivered changes located in `MAJOR.MINOR++.0/` SHOULD also be present within `MAJOR++.0.0/`. However, we do not recommend to workon two different releases at the same time .

For _bug fixes_ the directory `MAJOR.MINOR.PATCH++/` SHOULD only be present in a `hotfix/<my-hotfix>` branch.

In order to contribute to the papiNet standard, you MUST either:

* start a `feature/<my-feature>` branch created from the `develop` branch
* start a `hotfix/<my-hotfix>` branch from the `main` branch

As a maintainer, you can create/push these branches on the `papiNet-API` repository from the `papinet` GitHub account. As an external contributor, you MUST use your own fork. Both maintainers and external contributors MUST use pull request (PR) for merging their `feature/<my-feature>` branches into the `develop` branch, as well as for merging their `hotfix/<my-hotfix>` branches into the `main` branch.

Regularly, the maintainers SHOULD transfer the latest delivered changes of the `develop` branch to the `main`, and then create a Release with GitHub using the higher `MAJOR.MINOR.PATCH` semantic version as tag.

Changes of the _supporting files_ COULD be done using `hotfix/<my-hotfix>` branches.

It is crucial that once a `MAJOR.MINOR.PATCH/` folder is present in a commit within the `main` branch, tagged with `MAJOR.MINOR.PATCH`, it **MUST NEVER** change! When you merge the `develop` branch or a `hotfix/<my-hotfix>` branch into the `main` branch, you MUST ALWAYS check that there are only changes via the new `MAJOR++.0.0/`, `MAJOR.MINOR++.0/`, or `MAJOR.MINOR.PATCH++/` folders, and that all other `MAJOR.MINOR.PATCH/` folder remains unchanged.

## Getting Started

### Let's Change a _Supporting File_

1\. From the `main` branch, create a `hotfix/<my-hotfix>` branch, and switch to it.

```text
git checkout main
```

```text
git branch hotfix/my-hotfix
```

```text
$ git checkout hotfix/my-hotfix
```

2\. Create, update and/or delete _supporting file(s)_.

3\. Stage, commit and push your changes.

```text
git add .
```

```text
git commit -m "Describe what you have done"
```

```text
git push --set-upstream origin hotfix/my-hotfix
```

4\. From GitHub, create a Pull Request from `hotfix/my-hotfix` to `main`.

5\. Make sure that none of the folders with semantic versions `MAJOR.MINOR.PATCH/` have changed and do **not** create a release.

### Let's Work on a Backwards Compatible Bug Fix

1\. From the `main` branch, create a `hotfix/<my-hotfix>` branch, and switch to it.

2\. Copy the folder with the highest semantic version and rename it as `MAJOR.MINOR.PATCH++/`.

3\. Stage, commit and push this change.

4\. Work on your changes within the new `MAJOR.MINOR.PATCH++/` folder and don't make any changes to the other folders.

5\. Stage, commit and push your changes.

6\. When you have finished, from GitHub, create a Pull Request from `hotfix/my-hotfix` to `main`.

7\. When the `hotfix/<my-hotfix>` branch has been merged into `main`, create a Release with GitHub using the higher `MAJOR.MINOR.PATCH++` semantic version as tag.

### Let's Work on a New Feature

1\. From the `develop` branch, create a `feature/<my-feature>` branch, and switch to it.

```text
git checkout develop
```

```text
git branch feature/my-feature
```

```text
$ git checkout feature/my-feature
```

2\. Copy the folder with the highest semantic version and rename it as

* `MAJOR.MINOR++.0/` if you plan to work on _backwards compatible_ changes

* `MAJOR++.0.0/` if you plan to work on _incompatible_ changes

***WARNING:*** The folder with the highest semantic version might already a work-in-progress version created by another feature branch! In that case, you SHOULD NOT copy and rename that folder but just work in it. However, you should then be prepared for merge conflict(s) when merging back into the `develop` branch!

3\. Stage, commit and push this change (if you actually copy a folder).

4\. Work on your changes within the new `MAJOR.MINOR++.0/` or `MAJOR++.0.0/` folder and don't make any changes to the other folders.

5\. Stage, commit and push your changes.

6\. When you have finished, from GitHub, create a Pull Request from `feature/<my-feature>` to `develop`.

### Let's Release a New Version of the papiNet API Standard

1\. When you `develop` branch is ready, from GitHub, create a Pull Request with the title "Release papiNet API X.Y.Z" from `develop` to `main`, where "X.Y.Z" is the new `MAJOR.MINOR++.0/` or `MAJOR++.0.0/` semantic version.

2\. Create a Release with GitHub using the new `MAJOR.MINOR++.0/` or `MAJOR++.0.0/` semantic version as tag.
