# Setting Up a New Project

Use this guide once, after creating a new project from this template. It covers repository ownership, the initial Git branches, Cloudflare targets, GitHub Actions, and the settings that cannot be represented by files in the fork.

## 1. Create and clone the repository

This template is the starting point; it does not need a real application name yet. First create the new GitHub repository that will contain your Worker project. Choose one of these approaches:

- **Use this repository as a template:** In GitHub, select **Use this template**, choose the owner and repository name, and create the new repository. This is usually the simplest option for a new project.
- **Fork this repository:** In GitHub, select **Fork**, choose the destination owner, and create the fork. Use this when you want the fork to retain a relationship with this upstream template.

For example, if you create `acme-weather-api` under the GitHub organization `acme`, the repository address is `github.com/acme/acme-weather-api`. The repository name is your project name; it does not have to match the template name.

Once the GitHub repository exists, clone **that new repository** onto your computer. `git clone` downloads the repository and creates a local directory containing its files:

```sh
git clone https://github.com/acme/acme-weather-api.git
cd acme-weather-api
npm install
```

Replace `acme/acme-weather-api` with the owner and repository name you actually created.

The `cd` command enters the directory created by `git clone`; run it only after cloning. Keep the template's `.github/`, `docs/`, `src/`, `test/`, `package.json`, and `wrangler.jsonc` files unless the project has a deliberate alternative.

## 2. Configure the Worker names

This step assigns the Cloudflare Worker resource names for the fork. These are not GitHub repository names, branch names, domains, or API tokens. A Worker name identifies a deployed Worker inside your Cloudflare account, so choose names that are unique and recognizable to your project.

For example, if the project is an internal weather API, use a shared project slug with an environment suffix:

| Wrangler field | Example value | Used for |
| --- | --- | --- |
| Top-level `name` | `acme-weather-api` | Default/local Wrangler configuration; also used if someone runs `wrangler deploy` without `--env` |
| `env.non-prod.name` | `acme-weather-api-non-prod` | The Worker deployed when `develop` changes |
| `env.production.name` | `acme-weather-api-production` | The Worker deployed when `main` changes |

Starting from the template's configuration:

```jsonc
{
  "name": "cloudflare-workers-template",
  "main": "src/index.js",
  "env": {
    "non-prod": {
      "name": "cloudflare-workers-template-non-prod"
    },
    "production": {
      "name": "cloudflare-workers-template-production"
    }
  }
}
```

Change only the three `name` values. The resulting project configuration would be:

```jsonc
{
  "name": "acme-weather-api",
  "main": "src/index.js",
  "env": {
    "non-prod": {
      "name": "acme-weather-api-non-prod"
    },
    "production": {
      "name": "acme-weather-api-production"
    }
  }
}
```

Use your own organization or project slug instead of `acme-weather-api`. Confirm in the Cloudflare dashboard that these names are available and that the non-production and production names refer to separate Workers. The top-level Worker is normally used for local development; the GitHub deployment workflow targets only the two named environments.

Add bindings inside the matching environment only. For example, a non-production D1 database belongs under `env.non-prod`, while a production D1 database belongs under `env.production`. Never point non-production at production databases, buckets, queues, or other stateful resources.

### Environment Isolation Enforcement

This template enforces environment isolation through **contract tests** that run as part of `npm test`. These tests verify:

- **Unique Worker names**: Each environment (top-level, `non-prod`, and `production`) must have a distinct Worker name.
- **Clear naming convention**: The `non-prod` Worker name should include `non-prod`, `staging`, or `dev`; the `production` Worker name should include `production` or `prod`.
- **No production bindings at top level**: Production-specific bindings (D1 databases, R2 buckets, KV namespaces, etc.) must not be configured in the top-level Wrangler configuration.
- **Environment structure**: The configuration must define separate `env.non-prod` and `env.production` sections.

These contract tests catch accidental misconfiguration. For example, if you accidentally assign the same name to `env.non-prod` and `env.production`, or if you configure a production database reference at the top level, `npm test` will fail and alert you before you deploy.

To verify isolation locally:

```sh
npm test
npx wrangler deploy --dry-run --env non-prod
npx wrangler deploy --dry-run --env production
```

Run these commands to confirm that each environment targets the correct Worker and resources.

## 3. Create the Git branches

The long-lived branches are `main` and `develop`. Initialize them from the same verified starting commit:

```sh
git switch main
git push -u origin main
git switch -c develop
git push -u origin develop
```

If the repository starts on another default branch, rename it to `main` before running these commands. Use `feature/<name>` for local work. The allowed branch-name pattern also permits `release/<name>` and `hotfix/<name>` for short-lived coordination branches.

## 4. Configure GitHub environments and secrets

The deployment workflow is disabled by default. This protects the template repository and newly created forks from attempting Cloudflare deployments before a Worker, account, and credentials have been deliberately configured.

Create these GitHub Actions environments:

- `non-prod`, restricted to the `develop` branch
- `production`, restricted to the `main` branch, with required reviewers enabled

Add these secrets at repository or environment scope:

- `CLOUDFLARE_API_TOKEN`: a least-privilege token that can deploy the two Workers
- `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account containing those Workers

`DEPLOY_ENABLED` is intentionally a repository **variable**, not a secret. It contains no sensitive value; it is only the explicit deployment opt-in. After the Worker names, environments, and Cloudflare secrets are ready, add `DEPLOY_ENABLED` with the value `true` under **Settings > Secrets and variables > Actions > Variables**. Do not add it to the template repository. Without it, the deploy job is skipped and no Cloudflare credentials are used.

Do not commit these values or place them in `.env`, `.dev.vars`, or generated files.

## 5. Apply repository rules

The files in `.github/rulesets/` are API-ready descriptions of the intended GitHub rules. Apply both through GitHub repository Settings or the ruleset API:

```sh
gh api --method POST /repos/OWNER/REPOSITORY/rulesets \
  --input .github/rulesets/gitflow-branch-names.json
gh api --method POST /repos/OWNER/REPOSITORY/rulesets \
  --input .github/rulesets/gitflow-protected-branches.json
```

Replace `OWNER/REPOSITORY`. Confirm that the required status check is named `test`, matching the CI job in `.github/workflows/ci.yml`. Review the resulting rules in GitHub because organization policy or plan availability can modify what is accepted.

## 6. Verify the deployment path

Create a small feature branch and open a pull request into `develop`:

```sh
git switch -c feature/verify-gitflow
npm run dev
npm test
git push -u origin feature/verify-gitflow
```

After merging into `develop`, verify the non-production Worker. Then open a pull request from `develop` to `main`. After the production environment approval, verify the production Worker.

The deploy workflow does not run for feature branches. Local development uses `npm run dev`; only merges to `develop` and `main` deploy through GitHub Actions.

## Setup is complete when

- `main` and `develop` exist on the remote.
- Branch rules prevent direct changes to `main` and `develop`.
- The `non-prod` and `production` GitHub environments have the correct branch restrictions.
- The two Worker names and their bindings are separate and intentional.
- A merge to `develop` deploys non-production, and an approved merge to `main` deploys production.

## Adding Environment-Specific Bindings

As your project grows, you will need to add Cloudflare resources (D1 databases, R2 buckets, KV namespaces, Queues, Durable Objects, etc.) to your Workers. The key principle is: **bindings must be placed in the environment they serve, never at the top level**.

### Core Rule

**Do not add bindings to the top-level Wrangler configuration.** All bindings—regardless of service type—must be placed inside `env.non-prod` or `env.production`.

The contract tests verify this structure automatically.

### General Pattern

When adding any Cloudflare resource binding:

1. Create the resource in your Cloudflare account.
2. Add it to the appropriate `env` section in `wrangler.jsonc`:
   - Non-production resources go in `env.non-prod`
   - Production resources go in `env.production`
3. Use distinct, environment-aware names (e.g., `my-api-non-prod` vs. `my-api-production`).

**Incorrect** (binding at top level—will fail contract tests):
```jsonc
{
  "name": "my-worker",
  "d1_databases": [
    {
      "binding": "DB",
      "database_id": "abc123"
    }
  ]
}
```

**Correct** (environment sections with no services yet):
```jsonc
{
  "name": "my-worker",
  "main": "src/index.js",
  "compatibility_date": "2026-08-18",
  "env": {
    "non-prod": {
      "name": "my-worker-non-prod"
      // Service bindings go here (d1_databases, r2_buckets, kv_namespaces, etc.)
    },
    "production": {
      "name": "my-worker-production"
      // Service bindings go here (d1_databases, r2_buckets, kv_namespaces, etc.)
    }
  }
}
```

**Correct** (with a service binding example):
```jsonc
{
  "name": "my-worker",
  "main": "src/index.js",
  "compatibility_date": "2026-08-18",
  "env": {
    "non-prod": {
      "name": "my-worker-non-prod",
      "d1_databases": [
        {
          "binding": "DB",
          "database_id": "abc123-non-prod"
        }
      ]
    },
    "production": {
      "name": "my-worker-production",
      "d1_databases": [
        {
          "binding": "DB",
          "database_id": "def456-production"
        }
      ]
    }
  }
}
```

### Validation Workflow

1. **Run contract tests** to catch structural issues:
   ```sh
   npm test
   ```
   This verifies that all bindings are in the correct environment sections and Worker names are unique.

2. **Test each environment** before merging:
   ```sh
   npx wrangler deploy --dry-run --env non-prod
   npx wrangler deploy --dry-run --env production
   ```
   Review the output to confirm each environment binds the correct resources.

3. **Review in pull request** to catch logical errors:
   - Verify resource IDs are distinct between environments (use Cloudflare dashboard if unsure).
   - Confirm no cross-environment references exist.
   - Check that environment-aware naming is consistent and clear.

### Preventing Accidental Violations

- **Never** copy a resource ID from production into non-production, or vice versa.
- **Never** add a binding to the top-level configuration by mistake.
- **Always** run `npm test` and both dry-run deployments before committing.

The contract tests catch structural mistakes; careful naming and human review catch logical mistakes.
