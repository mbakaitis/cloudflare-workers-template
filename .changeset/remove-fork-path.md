---
"cloudflare-workers-template": major
---

Remove **Fork** as a documented starting path and delete the automated upstream-sync workflow it depended on. The plan to keep forks in sync automatically was scrapped after further analysis showed it wasn't a good approach, so the "fork gets automation, template doesn't" distinction no longer holds.

- `.github/workflows/upstream-sync.yml` and its contract test assertion are removed.
- `docs/using-this-template.md` now presents two starting paths — **Use this template** and **Clone only** — and sharpens the trade-off between them: the template path gives a clean, single-commit history, while cloning keeps this repository's full history but no repository of your own until you repoint the remote.
- "Keeping up with upstream changes" is now a single manual process (`git remote add upstream` + `git cherry-pick` or `git diff`) that applies regardless of which path you started from.
- The instruction contract (`claude.md`, `AGENTS.md`, `.github/copilot-instructions.md`) is raised to 2.0.0: it no longer requires documenting a fork path, and it now says not to document forking this repository as a supported starting path.

Migration: if your project forked this repository to use `upstream-sync.yml`, that workflow is gone upstream — remove your own copy (and its contract test assertion, if you copied `test/contracts/workflow.test.js` too) and switch to the manual `git cherry-pick`/`git diff` process documented in `docs/using-this-template.md`. Projects that started with **Use this template** or a plain clone need no changes; they never had the automated workflow.
