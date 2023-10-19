# Contributing Guidelines

This document intends to establish guidelines which build a transparent, open mechanism for deciding how to evolve the papiNet API standard. The papiNet Central Working Group (CWG) will follow these processes when merging changes from external contributors or from the CWG itself. This guideline document will be adjusted as practicality dictates.

## Tracking Process

GitHub is the medium of record for all papiNet API standard updates.

We will use an adapted version of the _git-flow_ branching model, as defined in the blog post [_A successful Git branching model_](https://nvie.com/posts/a-successful-git-branching-model/) written by [Vincent Driessen](https://nvie.com/about/) in 2010.

We will have:

* The `main` branch
* The `develop` branch
* _Feature_ branches, with names starting with the `/feature/` prefix
* _Hotfix_ branches, with names starting with the `/hotfix` prefix

The `main` and `develop` branches have an infinite lifetime.

The _feature_ and _hotfix_ branches have a limited lifetime. They SHOULD be deleted after being merged or abandoned.

The _feature_ branches MUST be created from the `develop` branch and eventually merged back **using a pull request** into the `develop` branch.

The _hotfix_ branches MUST be created from the `main` branch and eventually merged back **using a pull request** into the `main` branch.

The `main` branch will always contain the latest version of the standard located in the directory with the highest semantic version, `MAJOR.MINOR.PATCH/`.

The files located in the root directory are called the _supporting files_.

The `develop` branch will contain the latest delivered changes for the next release. These latest delivered changes MUST be located in either:

* the directory `MAJOR++.0.0/` if they are _incompatible_ changes
* the directory `MAJOR.MINOR++.0/` if they are _backwards compatible_ changes

The latest delivered changes located in `MAJOR.MINOR++.0/` SHOULD also be present within `MAJOR++.0.0/`.

For _bug fixes_ the directory `MAJOR.MINOR.PATCH++/` SHOULD only be present in a `hotfix/my_hotfix` branch.

In order to contribute to the papiNet standard, you MUST either:

* start a `feature/my_feature` branch created from the `develop` branch
* start a `hotfix/my_hotfix` branch from the `main` branch

As a maintainer, you can create/push these branches on the `papiNet-API` repository from the `papinet` GitHub account. As an external contributor, you MUST use your own fork. Both maintainers and external contributors MUST use pull request (PR) for merging their `feature/my_feature` branches into the `develop` branch, as well as for merging their `hotfix/my_hotfix` branches into the `main` branch.

Regularly, the maintainers SHOULD transfer the latest delivered changes of the `develop` branch to the `main`, and then create a Release with GitHub using the higher `MAJOR.MINOR.PATCH` as tag.

Changes of the _supporting files_ SHOULD be done using `hotfix/my_hotfix` branches.

It is crucial that once a `MAJOR.MINOR.PATCH/` folder is present in a commit within the `main` branch, tagged with `MAJOR.MINOR.PATCH`, it MUST NEVER change! When you merge the `develop` branch or a `hotfix/my_hotfix` branch into the `main` branch, you MUST ALWAYS check that there are only changes via the new `MAJOR++.0.0/`, `MAJOR.MINOR++.0/`, or `MAJOR.MINOR.PATCH++/` folders, and that all other `MAJOR.MINOR.PATCH/` remains unchanged.

## Getting Started

### Let's Change a _Supporting File_

1\. From the `main` branch, create a `hotfix/my_hotfix` branch, and switch to it.

```text
$ git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

$ git branch hotfix/my_hotfix

$ git checkout hotfix/my_hotfix
Switched to branch 'hotfix/my_hotfix'
```

2\. Create, update and/or delete _supporting file(s)_.

3\. Stage, commit and push your changes.

```text
$ git add .

$ git commit -m "Describe what you have done"
[hotfix/my_hotfix 0aa729e] Describe what you have done
 1 file changed, 3 insertions(+)
 create mode 100644 new-file.txt

$ git push --set-upstream origin hotfix/my_hotfix
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 8 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 376 bytes | 376.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote:
remote: Create a pull request for 'hotfix/my_hotfix' on GitHub by visiting:
remote:      https://github.com/papinet/papiNet-API/pull/new/hotfix/my_hotfix
remote:
To github.com:papinet/papiNet-API.git
 * [new branch]      hotfix/my_hotfix -> hotfix/my_hotfix
Branch 'hotfix/my_hotfix' set up to track remote branch 'hotfix/my_hotfix' from 'origin'.
```

4\. From GitHub, create a Pull Request from `hotfix/my_hotfix` to `main`.

5\. Make sure that none of the folders with semantic versions `MAJOR.MINOR.PATCH/` have changed and do **not** create a release.

### Let's Work on a Backwards Compatible Bug Fix

1\. From the `main` branch, create a `hotfix/my_hotfix` branch., and switch to it.

```text
$ git checkout main
Switched to branch 'main'
Your branch is up to date with 'origin/main'.

$ git branch hotfix/my_hotfix

$ git checkout hotfix/my_hotfix
Switched to branch 'hotfix/my_hotfix'
```

2\. Copy the folder with the highest semantic version and rename it as `MAJOR.MINOR.PATCH++/`.

3\. Stage, commit and push this change.

4\. Work on your changes within the new `MAJOR.MINOR.PATCH++/` and don't make any changes to the other folders.

5\. Stage, commit and push your changes.

6\. When you have finished, from GitHub, create a Pull Request from `hotfix/my_hotfix` to `main`.

7\. When the `hotfix/my_hotfix` branch has been merged into `main`, create a Release with GitHub using the higher `MAJOR.MINOR.PATCH++` as tag.

### Let's Work on a New Feature

### Let's Release a New Version of the papiNet API Standard
