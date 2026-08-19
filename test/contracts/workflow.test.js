import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const deployWorkflowPath = new URL(
  "../../.github/workflows/deploy.yml",
  import.meta.url,
);
const mcpConfigPaths = [
  new URL("../../.mcp.json", import.meta.url),
  new URL("../../.vscode/mcp.json", import.meta.url),
];

describe("deployment workflow contract", () => {
  it("requires explicit deployment opt-in", async () => {
    const workflow = await readFile(deployWorkflowPath, "utf8");

    assert.match(
      workflow,
      /if:\s*\$\{\{\s*vars\.DEPLOY_ENABLED\s*==\s*'true'\s*\}\}/,
    );
  });

  it("exposes the authenticated GitHub MCP server in both config formats", async () => {
    for (const configPath of mcpConfigPaths) {
      const config = JSON.parse(await readFile(configPath, "utf8"));
      const servers = config.mcpServers ?? config.servers;

      assert.equal(servers.github.type, "http");
      assert.equal(servers.github.url, "https://api.githubcopilot.com/mcp/");
    }
  });
});