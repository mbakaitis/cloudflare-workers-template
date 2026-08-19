# Changelog

## Unreleased

- Document manual feature, release, and hotfix branch creation plus GitHub issue-closing commit references.
- Configure the GitHub Issues extension to generate Gitflow-prefixed issue branches from sanitized issue types and titles.
- Add documented Gitflow branches for local feature work, non-production deployment, and production deployment.
- Add named Wrangler environments and GitHub Actions CI/deployment workflows.
- Add API-ready GitHub ruleset payloads for branch naming and protected branches.
- Separate ongoing Gitflow guidance from one-time fork setup instructions.
- Run CI tests on pull requests only; deployment tests remain as the pre-deployment gate for `develop` and `main`.