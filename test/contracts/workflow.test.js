import { readFile } from "node:fs/promises";
import { mkdtemp, readFile as readTextFile, rm, writeFile } from "node:fs/promises";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const deployWorkflowPath = new URL(
  "../../.github/workflows/deploy.yml",
  import.meta.url,
);
const mcpConfigPaths = [
  new URL("../../.mcp.json", import.meta.url),
  new URL("../../.vscode/mcp.json", import.meta.url),
];
const packagePath = new URL("../../package.json", import.meta.url);
const eslintConfigPath = new URL("../../eslint.config.js", import.meta.url);
const changesetConfigPath = new URL("../../.changeset/config.json", import.meta.url);
const releaseWorkflowPath = new URL(
  "../../.github/workflows/release.yml",
  import.meta.url,
);
const workflowPaths = [
  new URL("../../.github/workflows/ci.yml", import.meta.url),
  new URL("../../.github/workflows/deploy.yml", import.meta.url),
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

  it("defines lint scripts and an ESLint configuration", async () => {
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));

    assert.equal(packageJson.scripts.lint, "eslint .");
    assert.equal(packageJson.scripts["lint:fix"], "eslint . --fix");
    await readFile(eslintConfigPath, "utf8");
  });

  it("defines the Changesets SemVer release contract", async () => {
    const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
    const changesetConfig = JSON.parse(await readFile(changesetConfigPath, "utf8"));
    const releaseWorkflow = await readFile(releaseWorkflowPath, "utf8");

    assert.equal(packageJson.scripts.changeset, "changeset");
    assert.equal(packageJson.scripts["changeset:status"], "changeset status");
    assert.equal(packageJson.scripts.version, "changeset version");
    assert.equal(packageJson.scripts.release, "changeset tag");
    assert.equal(changesetConfig.baseBranch, "main");
    assert.equal(changesetConfig.privatePackages.version, true);
    assert.match(releaseWorkflow, /branches:\s*\n\s*- main/);
    assert.match(releaseWorkflow, /fetch-depth:\s*0/);
    assert.match(releaseWorkflow, /changesets\/action@v1/);
    assert.match(releaseWorkflow, /version:\s*npm run version/);
  });

  it("keeps linting in the CI and deployment quality gates", async () => {
    for (const workflowPath of workflowPaths) {
      const workflow = await readFile(workflowPath, "utf8");

      assert.match(workflow, /run:\s*npm run lint/);
    }
  });

  it("rejects style violations and fixes them with ESLint", async () => {
    const fixtureDirectory = await mkdtemp(join(process.cwd(), ".eslint-contract-"));
    const fixturePath = join(fixtureDirectory, "fixture.js");

    try {
      await writeFile(fixturePath, "export default {value:1}\n");

      await assert.rejects(
        execFileAsync(
          process.execPath,
          [
            "node_modules/eslint/bin/eslint.js",
            "--config",
            fileURLToPath(eslintConfigPath),
            fixturePath,
          ],
          { cwd: process.cwd() },
        ),
      );

      await execFileAsync(process.execPath, [
        "node_modules/eslint/bin/eslint.js",
        "--config",
        fileURLToPath(eslintConfigPath),
        "--fix",
        fixturePath,
      ], { cwd: process.cwd() });

      assert.equal(await readTextFile(fixturePath, "utf8"), "export default { value: 1 };\n");
    } finally {
      await rm(fixtureDirectory, { recursive: true, force: true });
    }
  });
});