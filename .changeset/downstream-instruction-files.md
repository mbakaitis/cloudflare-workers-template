---
"cloudflare-workers-template": minor
---

Add a second, downstream-facing set of AI instruction files — `claude-for-users.md`, `AGENTS-for-users.md`, and `.github/copilot-instructions-for-users.md` — alongside the existing maintainer files. The maintainer files (`claude.md`, `AGENTS.md`, `.github/copilot-instructions.md`) describe keeping this boilerplate current for many future projects; that stops applying the moment someone builds an application from it, and asking them to hand-edit a maintainer file down to size left a document that was neither the template's guidance nor a coherent application guide.

- `docs/using-this-template.md` step 1 now instructs new projects to `mv` the `-for-users` files over the maintainer files (or delete all six, if not using AI tooling).
- `docs/using-ai.md`'s "The instruction files" section explains both sets and why neither is a subset of the other; `CONTRIBUTING.md` documents keeping the two sets aligned going forward.
- The `-for-users` files carry no instruction contract version — a single application has no upstream file to stay in sync with, so the dual-version scheme this template uses for its own maintenance doesn't apply once they're renamed into place.
- The instruction contract is raised to 2.1.0: it documents the new files as a template-owned extension point without invalidating any existing requirement.

No migration needed for existing downstream projects: they already have their own instruction files (edited in place under the previous guidance) and are unaffected. This only changes the starting point for new projects created from the template going forward.
