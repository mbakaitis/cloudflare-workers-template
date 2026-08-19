# Cloudflare Workers Template

Minimal, forkable Cloudflare Workers boilerplate with local Vitest testing and a documented Gitflow deployment path.

## Gitflow

| Branch | Purpose | Cloudflare target |
| --- | --- | --- |
| `feature/<name>` | Local development and pull requests | No deployed target; use `npm run dev` |
| `develop` | Shared non-production integration | Wrangler `non-prod` environment |
| `main` | Production releases | Wrangler `production` environment |

Use [docs/gitflow.md](docs/gitflow.md) for the ongoing branch and promotion workflow. Use [docs/project-setup.md](docs/project-setup.md) when creating and configuring a new fork. API-ready ruleset payloads are in `.github/rulesets/`.

## Development

Install dependencies and run the Worker locally:

```sh
npm install
npm run dev
```

Local Wrangler development uses the top-level configuration and never deploys a Cloudflare Worker. Do not put production credentials in local environment files.

## Testing

```sh
npm test
npm run test:watch
```

Tests use `@cloudflare/vitest-pool-workers`, so they execute in the Workers runtime locally through Miniflare. Add Worker behavior tests under `test/` and keep the Worker entry point in `src/index.js`.

## Deployment

Deployments are explicit:

```sh
npm run deploy:non-prod
npm run deploy:production
```

The GitHub Actions deployment workflow runs non-production deployments from `develop` and production deployments from `main`. Configure the required Cloudflare secrets and GitHub environment protection as described in [docs/project-setup.md](docs/project-setup.md) before enabling it.
