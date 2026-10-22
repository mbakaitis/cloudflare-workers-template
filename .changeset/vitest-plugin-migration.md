---
"cloudflare-workers-template": minor
---

Move Worker tests from `@cloudflare/vitest-pool-workers` to Cloudflare's new `@cloudflare/vitest-plugin`, and refresh the development toolchain.

- `vitest.config.js` now imports `cloudflareTest` from `@cloudflare/vitest-plugin`. The test files themselves are unchanged.
- `@cloudflare/vitest-pool-workers` is removed and `@cloudflare/vitest-plugin` `1.4.7` is added.
- Toolchain updates: `vitest` `5.0.5` (was `^4.1.11`), `wrangler` `4.152.0` (was `^4.124.0`), `eslint` `10.13.0` (was `^10.8.1`), and `@changesets/cli` `3.0.3` (was `^2.31.1`).
- `devDependencies` are now pinned to exact versions instead of caret ranges, so installs are reproducible and toolchain upgrades are deliberate, reviewable changes.
- `README.md` and `CONTRIBUTING.md` now name the new test package.

Migration: downstream projects that adopt this change should, in `package.json`, remove `@cloudflare/vitest-pool-workers` and add the updated `devDependencies` listed above, then run `npm install`. In `vitest.config.js`, change the import to `import { cloudflareTest } from "@cloudflare/vitest-plugin";`. Run `npm test` to confirm. If your tests or config import anything else from `@cloudflare/vitest-pool-workers` (for example `cloudflare:test` helpers or pool options), check it against the `@cloudflare/vitest-plugin` documentation. Projects that keep the old package continue to work as they are, but will not receive further template test changes that assume the plugin. To roll back, restore the previous `package.json`, lockfile, and `vitest.config.js`.

Validation: `npm test` passed after the change. Not yet verified in a project created from this template.
