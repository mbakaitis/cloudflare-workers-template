# Agent Instructions

**Instruction contract version:** 1.0.1

Use [claude.md](claude.md) as the canonical maintenance guide for this Cloudflare Workers template.

Before editing, read the relevant section of `claude.md`. In particular:

- Preserve explicit local, staging/non-production, and production Wrangler environments.
- Keep local development independent from production resources and secrets.
- Use the Cloudflare documentation MCP server configured in `.mcp.json` or `.vscode/mcp.json` for current platform research when it is available; do not treat MCP access as deployment or account authorization.
- Use mandatory red-green-refactor TDD for behavior changes, add regression tests, and run focused tests before broader checks. Keep implementation and tooling in JavaScript with mandatory JSDoc for exported functions, Worker handlers, configuration contracts, and non-obvious behavior; do not add TypeScript.
- Update documentation, migration notes, and `CHANGELOG.md` when behavior or workflows change.
- Classify changes with Semantic Versioning and keep `package.json`, changelog, tags, and release notes consistent.
- Treat the instruction contract version separately from the package version: patch clarifications, minor compatible requirements, and major changes that require forks to revise workflows. Keep its value aligned with `claude.md` and `.github/copilot-instructions.md`.
- Treat forks as downstream projects requiring reviewed migrations; never overwrite application-specific code blindly.
- Never commit credentials, secret values, `.dev.vars`, populated `.env` files, or generated deployment state.
- Keep `.claude/settings.local.json` local and permission-scoped; do not broaden MCP permissions or add secrets to shared configuration.
- VS Code may require MCP discovery to be enabled with `chat.mcp.discovery.enabled` when relying on other clients' configuration; the repository's `.vscode/mcp.json` is the preferred VS Code configuration.

When the repository gains implementation files, follow its documented package scripts and report validation commands and any unavailable checks.
