import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const deployWorkflowPath = new URL(
  "../../.github/workflows/deploy.yml",
  import.meta.url,
);

describe("deployment workflow contract", () => {
  it("requires explicit deployment opt-in", async () => {
    const workflow = await readFile(deployWorkflowPath, "utf8");

    assert.match(
      workflow,
      /if:\s*\$\{\{\s*vars\.DEPLOY_ENABLED\s*==\s*'true'\s*\}\}/,
    );
  });
});