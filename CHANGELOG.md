# Changelog

## 0.1.1

### Patch Changes

- 86683c3: Operationalize Changesets-based Semantic Versioning releases.

## Unreleased

- Operationalize SemVer releases with Changesets configuration, scripts, contract coverage, and a `main`-branch release workflow that creates version tags for the private template.
- Enable Cloudflare Workers best practices: add observability logging to Wrangler configuration for automatic telemetry capture.
- Add `npm run types` script to generate TypeScript types for Worker bindings and runtime APIs using `wrangler types`.
- Document type generation and observability configuration in project development workflow.
- Add contract tests to enforce environment isolation: verify separate Worker names, prevent production bindings at top level, and catch accidental environment misconfiguration.
- Update `project-setup.md` with environment isolation enforcement documentation, including contract test overview and manual configuration steps for adding environment-specific bindings (D1, R2, KV, etc.).
- Update the `test:contracts` npm script to run all contract tests in `test/contracts/` instead of a single file.
- Add ESLint configuration, lint scripts, and CI/deployment quality gates for JavaScript source and tests.
- Add the hosted GitHub MCP server to the shared MCP configuration so authenticated tools can inspect repository issues and data.
- Make GitHub deployment opt-in with the `DEPLOY_ENABLED` repository variable so the template does not deploy to Cloudflare.
- Document manual feature, release, and hotfix branch creation plus GitHub issue-closing commit references.
- Configure the GitHub Issues extension to generate Gitflow-prefixed issue branches from sanitized issue types and titles.
- Add documented Gitflow branches for local feature work, non-production deployment, and production deployment.
- Add named Wrangler environments and GitHub Actions CI/deployment workflows.
- Add API-ready GitHub ruleset payloads for branch naming and protected branches.
- Separate ongoing Gitflow guidance from one-time fork setup instructions.
- Run CI tests on pull requests only; deployment tests remain as the pre-deployment gate for `develop` and `main`.
