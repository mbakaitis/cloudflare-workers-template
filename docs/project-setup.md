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

Run the local checks before creating branches:

```sh
npm test
npx wrangler deploy --dry-run --env non-prod
npx wrangler deploy --dry-run --env production
```

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
