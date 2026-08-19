# Gitflow Workflow

This project uses three branch classes and two deployed Wrangler environments. Follow this guide for ongoing development after the fork has been configured. For one-time repository setup, use [Project Setup](project-setup.md).

| Branch | Allowed shape | Role | Deployment |
| --- | --- | --- | --- |
| Feature | `feature/<name>` | Short-lived local work and pull requests | None |
| Non-production | `develop` | Integration branch | `wrangler deploy --env non-prod` |
| Production | `main` | Release branch | `wrangler deploy --env production` |

`release/<name>` and `hotfix/<name>` are allowed as short-lived coordination branches. They do not deploy directly. Merge them into `develop` or `main` through pull requests according to the change being prepared.

Branch names must use lowercase letters, numbers, dots, underscores, or hyphens after the prefix. For example, `feature/add-health-check` is valid; `feature/AddHealthCheck` is not.

Create branches manually using the prefix that matches the work. Include the issue number in the branch name when the work comes from an issue:

```sh
# New work from develop
git switch develop
git pull --ff-only
git switch -c feature/1-add-health-check

# Release coordination from develop
git switch develop
git pull --ff-only
git switch -c release/0.2.0

# Production repair from main
git switch main
git pull --ff-only
git switch -c hotfix/2-fix-authentication
```

In a commit message, reference the related issue with a GitHub closing keyword. Common forms are `Fixes #1`, `Closes #1`, and `Resolves #1`:

```sh
git commit -m "Add health check; fixes #1"
```

GitHub links the issue reference immediately. The issue is closed when the commit reaches the repository's default branch, normally after the pull request is merged. For an issue in another repository, use `OWNER/REPOSITORY#NUMBER` instead of `#NUMBER`. Labels remain useful for categorization, but they do not determine branch names.

The ruleset in `.github/rulesets/gitflow-branch-names.json` allows the documented prefixes, but it must be applied through GitHub repository settings before it can reject noncompliant names.

## Development workflow

Create local work from `develop`:

```sh
git switch develop
git pull --ff-only
git switch -c feature/my-change
npm run dev
npm test
```

Open a pull request from `feature/my-change` into `develop`. The CI workflow must pass before merging. A merge to `develop` deploys the non-production Worker. After validation, open a pull request from `develop` into `main`; a merge to `main` deploys production after the GitHub `production` environment approval gate.

Keep feature branches short-lived. Start each feature from the latest `develop`, and do not commit directly to `develop` or `main`.

## Required repository policy

Protect `develop` and `main` from direct pushes, deletion, force-pushes, and merges without a pull request and passing CI. Require at least one approving review and resolved review threads. Keep feature branches unprotected apart from the naming rule so local development remains lightweight.

The repository ruleset files in `.github/rulesets/` describe this policy but do not apply it automatically. GitHub organization policy, repository ownership, and plan availability can affect which rules are accepted, so inspect the ruleset after importing it.

## Rollback

Use the Cloudflare dashboard or Wrangler deployment history to identify the previous successful version. Roll back through a reviewed commit on `main`; do not hot-edit production code in the dashboard. If the production deployment must be stopped, disable or require approval for the `production` GitHub environment while investigating.
