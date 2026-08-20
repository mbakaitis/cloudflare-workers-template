---
"cloudflare-workers-template": minor
---

Rewrite the documentation for the people who consume this template, make it a real GitHub template repository, and drop the TypeScript type generation that a JavaScript project does not need.

Documentation:

- The repository now has GitHub's template flag enabled, so **Use this template** works and "template" is accurate terminology.
- `README.md` is now a short consumer quickstart: what you get, seven numbered start-up steps, a command table, an "AI is already wired in" section, and a documentation map.
- Added `CONTRIBUTING.md` for people improving the template itself, including the required checks, the documentation-only exemption, and the rule that the three instruction files and their contract version stay in sync.
- Renamed `docs/project-setup.md` to `docs/using-this-template.md` and added a "Choosing how to start" section covering **Use this template** vs. **fork** vs. **clone**. This documents a real constraint: a template-generated repository shares no commit history with upstream, so `upstream-sync.yml` cannot merge into it and upstream adoption is manual; forks retain history and can use the workflow.
- Split `docs/gitflow.md` into `docs/gitflow-and-branching.md` (branches, promotion, rollback) and `docs/versioning-and-changesets.md` (recording changesets, the release pull request, cutting versions and tags).
- Added `docs/using-ai.md` covering the instruction files, the MCP servers, the contract tests and human gates that make AI assistance safe here, and how to adapt the instruction files for a downstream project.

Configuration:

- Removed the documented `npm run types` step and the requirement to generate TypeScript binding types. This project is JavaScript with JSDoc: without a `tsconfig.json` nothing was type-checked, the generated file is gitignored so it never existed on a fresh clone, and test-driven development covers the risk. `src/index.js` no longer annotates a handler with a type that could not resolve. A project that wants editor autocomplete for its own bindings can still run `npx wrangler types` on demand.
- Pinned one supported Node.js version. `.nvmrc` is the source of truth for nvm and similar version managers, `engines.node` declares `>=22`, and all four workflows now read `node-version-file: .nvmrc` instead of hardcoding a version. A contract test keeps them in agreement.
- Strengthened the MCP contract test to require both servers, identical URLs, and no extra keys in both `.mcp.json` and `.vscode/mcp.json`, so neither file can drift or gain a credential unnoticed.
- Raised the instruction contract to 1.2.0: documentation-only Markdown changes are exempt from tests, lint, and Wrangler validation; the document set and its audiences are specified; generated binding types are explicitly not part of the project shape; the Node.js version must be declared once; and the template-versus-fork distinction is a documented requirement.

Projects already created from this template need no migration. The `types` script never shipped, so nothing that worked before stops working. If your own documentation referenced `npm run types` or the old documentation filenames, update those references.
