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

The deployment workflow is opt-in. Set the GitHub Actions repository **variable** `DEPLOY_ENABLED` to `true` only after the fork has configured its Worker names, Cloudflare secrets, and protected environments. This flag is not a secret; it only enables deployment. The template repository leaves it unset, so pushes to `main` or `develop` skip the deploy job.

## Semantic Versioning workflow

Use Changesets to record the release impact of changes that affect the template contract:

```sh
npm run changeset
npm run changeset:status
```

Choose `patch` for compatible fixes, documentation, tests, and dependency updates; `minor` for compatible capabilities or extension points; and `major` for breaking changes to scripts, files, runtime assumptions, environments, bindings, or migration requirements. Commit the generated `.changeset/*.md` file with the pull request. Changesets are not required for changes that are purely internal and do not alter the forkable template contract.

After a pull request merges into `main`, the release workflow opens or updates a release pull request. Review its generated `CHANGELOG.md`, `package.json`, and lockfile changes. Merging that release pull request runs `npm run version`, then tags the private package with `npm run release`. The workflow does not publish to npm. Deploying the resulting `main` commit remains governed by the separate, opt-in deployment workflow.

Before merging a release pull request, verify:

- The release impact matches the actual downstream migration requirement.
- `npm run changeset:status`, `npm run lint`, and `npm test` pass.
- The changelog entry explains the user-visible change and any fork migration.
- The generated version is the next intended SemVer version.

Fork maintainers should review and adopt upstream release pull requests manually. A fork may use the same Changesets workflow, but its application-specific bindings, deployment policy, and release cadence still require independent review.

## Required repository policy

Protect `develop` and `main` from direct pushes, deletion, force-pushes, and merges without a pull request and passing CI. Require at least one approving review and resolved review threads. Keep feature branches unprotected apart from the naming rule so local development remains lightweight.

The repository ruleset files in `.github/rulesets/` describe this policy but do not apply it automatically. GitHub organization policy, repository ownership, and plan availability can affect which rules are accepted, so inspect the ruleset after importing it.

## Rollback

Use the Cloudflare dashboard or Wrangler deployment history to identify the previous successful version. Roll back through a reviewed commit on `main`; do not hot-edit production code in the dashboard. If the production deployment must be stopped, disable or require approval for the `production` GitHub environment while investigating.
