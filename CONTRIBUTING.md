Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet.

# Contributing Guidelines

This document intends to establish guidelines which build a transparent, open mechanism for deciding how to evolve the papiNet API standard. The papiNet Central Working Group (CWG) will follow these processes when merging changes from external contributors or from the CWG itself. This guideline document will be adjusted as practicality dictates.

## Use of GitHub Issues

Issues are created for tracking of decisions and changes.

* Issues should be assigned to responsible maintainers, so that they get notifications when issues are updated or commented.

* Issues should be given appropriate labels when updated or commented.

* Solutions for issues are approved, approved with amendment or rejected by CWG.

* Implementation of a solution for an issue should have one or several commits. No other changes should exist in these commits. The commits should have a reference to the issue number. A description of the change and a link to the commits should be given in a comment of the issue.

* Implementation of a solution for an issue should be reviewed by at least one maintainer.

* Issues are closed at CWG API meetings.

## Repository Structure

The repository contains two types of content:

- **Versioned folders** are folders named `<MAJOR>.<MINOR>.<PATCH>/` (e.g. `2.1.0/`) that contain the normative files for a specific released version.
These folders are **immutable** once their corresponding release has been published. No changes to their content will be accepted after release.

- **Supporting files** are all files outside of versioned folders (e.g. tooling, templates, documentation about the project itself).

## Branching Strategy

The repository uses the following branches:

* The `main` branch containing the latest stable, released version.
* The `develop` working branch containing the next release. 
* The `feature/[<initials>/]<feature-name>` branches containing specific aspects of the next release. Branched from `develop`.
* The `hotfix/[<initials>/]<hotfix-name>` branches containing critical fixes to a released version. Branched from `main`.

The `[<initials>/]` part of the branch name is optional. It can be used to avoid naming collisions or to signal ownership of a work-in-progress branch (e.g. `feature/jd/fix-response-schema`).

The `main` and `develop` branches have an infinite lifetime.

The `feature/*` and `hotfix/*` branches have a limited lifetime. They SHOULD be deleted after being merged or abandoned.

Direct pushes to `main` and `develop` are not allowed. All changes must go through a Pull Request.

## Contribution Workflows

Maintainers contribute directly via branches on the main repository. External contributors must fork the repository and submit Pull Requests from their fork.

### Feature Process

```text
# Make sure your local develop branch is up to date with the remote:
git checkout develop
git pull origin develop
```

```text
# Create your feature branch from develop:
git checkout -b feature/[<initials>/]<feature-name> develop
```

where

* `<feature-name>` MUST describe the feature in a concise and meaningful way (e.g., add-extra-endpoint).
* `<initials>` SHOULD be used to avoid conflicts and to make branch ownership explicit. The shorter form without initials MAY be used when no ambiguity or naming conflict is expected.

If the `develop` branch did not yet contain a folder for the intended next release version, you should create it as follows.

```text
# Create a new folder named after the new version
# and copy the content of the previous version folder into it exactly,
# without any modifications:
cp -r 2.0.0/ 2.1.0/
# Commit this copy as a standalone commit before making any changes:
git add 2.1.0/
git commit -m "chore: initialize 2.1.0 from 2.0.0"
```

where `2.0.0/` should be replaced by the latest released version and `2.1.0/` should be replaced by the intended next release version.

Now changes can be made, either within the new versioned folder, or to supporting files, or both.

```text
# Make your changes and commit them:
git add .
git commit -m "feat: describe your change here"
```

where `describe your change here` should be replaced by the appropriate text.

```text
# Push your feature branch
git push origin feature/my-feature-name
```

Feature branches branches MUST be merged into the `develop` branch via a pull request.

> **WARNING:** You should ALWAYS verify that the content of all previous _versioned folders_ have not been changed before merging!

### Keeping your feature branch up to date with the `develop` branch

```text
# Make sure your local develop is up to date
git checkout develop
git pull origin develop
# Switch back to your feature branch
git checkout feature/my-feature-name
# Merge develop into your feature branch
git merge develop
# This brings all changes from `develop` into your branch.
# If there are conflicts, git will tell you which files need attention.
# Open those files, resolve the conflicts manually, then run:
# git add <resolved-file>
# git commit
```

### Hotfix Process

Hotfixes address critical issues in an already-released version and bypass `develop` to go directly to `main`.

```text
# Make sure your local main branch is up to date with the remote:
git checkout main
git pull origin main
```

```text
# Create your hotfix branch from main:
git checkout -b hotfix/[<initials>/]<hotfix-name>
```

where

* `<hotfix-name>` MUST describe the hotfix in a concise and meaningful way (e.g., fix-supporting-file).
* `<initials>` SHOULD be used to avoid conflicts and to make branch ownership explicit. The shorter form without initials MAY be used when no ambiguity or naming conflict is expected.

```text
# Make your changes and commit them:
git add .
git commit -m "fix: describe your hotfix here"
```

where `describe your hotfix here` should be replaced by the appropriate text.

Feature branches branches MUST be merged into the `main` branch via a pull request.

> **WARNING:** You should ALWAYS verify that the content of all previous _versioned folders_ have not been changed!

The merge MUST happen during an ad-hoc meeting and **3 maintainer approvals** are required.

After the hotfix is merged into `main`, open another Pull Request from the `main` branch into the `develop` branch on GitHub, to ensure it is not lost in the next release.

## Release Process

Releases are governed by maintainers.

1. Maintainers collaboratively draft release notes using the **GitHub draft release** feature ahead of the release meeting, until consensus is reached on the content.

2. A release meeting is scheduled with a quorum of maintainers present (as defined in `GOVERNANCE.md`).

3. During the meeting, a Pull Request is opened from `develop` → `main` with the title "papiNet API <MAJOR>.<MINOR>.<PATCH> is ready ;-) | Release".

> **WARNING:** You should ALWAYS verify that the content of all previous _versioned folders_ have not been changed!

4. **3 maintainer approvals** are required before the PR can be merged.

5. On merge, the draft GitHub Release is published with the agreed semver tag (e.g. `v2.1.0`) and release notes.
