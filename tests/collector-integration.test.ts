import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it, vi } from "vitest";
import { runCollector } from "../scripts/collect-chrome-releases.mjs";

const initialState = {
  lastCheckedAt: null,
  latestByPlatform: {},
  latestMilestone: null,
};

async function createWorkspace() {
  const workspace = await fs.mkdtemp(
    path.join(os.tmpdir(), "chrome-release-monitor-"),
  );
  await fs.mkdir(path.join(workspace, "config"), { recursive: true });
  await fs.mkdir(path.join(workspace, "data"), { recursive: true });
  await fs.mkdir(path.join(workspace, "src/content/releases/en"), {
    recursive: true,
  });
  await fs.writeFile(
    path.join(workspace, "config/sources.json"),
    JSON.stringify({
      collector: {
        releaseEndpoint: "https://primary.test/releases?platform={platform}",
        fallbackReleaseEndpoint: "https://fallback.test/versions/{platform}",
        fallbackPlatformMap: {
          Windows: "win",
          Mac: "mac",
          Linux: "linux",
        },
        platforms: ["Windows", "Mac", "Linux"],
        requestTimeoutMs: 1_000,
        maxAttempts: 2,
        retryBaseDelayMs: 1,
        userAgent: "collector-integration-test",
      },
      officialSources: [
        {
          id: "chrome-release-notes",
          urlTemplate: "https://content.test/notes/{milestone}",
        },
      ],
    }),
  );
  await fs.writeFile(
    path.join(workspace, "data/release-state.json"),
    JSON.stringify(initialState),
  );
  return workspace;
}

describe("collector command", () => {
  it("writes validated bilingual articles once and then becomes a no-op", async () => {
    const workspace = await createWorkspace();
    const fetchImpl = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes("/notes/")) {
        return new Response("<main><h3>Web Platform feature</h3></main>", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        });
      }
      return new Response(
        JSON.stringify([
          {
            version: "153.0.8000.1",
            milestone: 153,
            channel: "Stable",
            time: "2026-09-03T00:00:00.000Z",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    });
    const logger = { log: vi.fn(), warn: vi.fn() };

    try {
      const first = await runCollector({
        root: workspace,
        fetchImpl,
        logger,
        now: () => new Date("2026-09-04T00:00:00.000Z"),
      });
      expect(first.changed).toBe(true);
      expect(first.articles).toHaveLength(2);

      for (const relativePath of [
        "src/content/releases/chrome-153-153-0-8000-1.md",
        "src/content/releases/en/chrome-153-153-0-8000-1.md",
      ]) {
        const article = matter(
          await fs.readFile(path.join(workspace, relativePath), "utf8"),
        );
        expect(article.data.status).toBe("published");
        expect(article.content).toContain("Web Platform feature");
      }

      const second = await runCollector({
        root: workspace,
        fetchImpl,
        logger,
        now: () => new Date("2026-09-04T06:00:00.000Z"),
      });
      expect(second.changed).toBe(false);
    } finally {
      await fs.rm(workspace, { recursive: true, force: true });
    }
  });

  it("falls back after the primary source exhausts its retries", async () => {
    const workspace = await createWorkspace();
    const fetchImpl = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes("/notes/")) {
        return new Response("<main></main>", { status: 200 });
      }
      if (url.includes("primary.test") && url.includes("platform=Windows")) {
        return new Response("busy", { status: 503 });
      }
      if (url.includes("fallback.test/versions/win")) {
        return new Response(
          JSON.stringify({ versions: [{ version: "153.0.8000.2" }] }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify([
          {
            version: "153.0.8000.1",
            milestone: 153,
            channel: "Stable",
          },
        ]),
        { status: 200 },
      );
    });
    const logger = { log: vi.fn(), warn: vi.fn() };

    try {
      const result = await runCollector({
        root: workspace,
        fetchImpl,
        logger,
        now: () => new Date("2026-09-04T00:00:00.000Z"),
      });

      expect(result.changed).toBe(true);
      expect(
        result.releases.find((release) => release.platform === "Windows")
          ?.version,
      ).toBe("153.0.8000.2");
      expect(
        fetchImpl.mock.calls.filter(([input]) =>
          String(input).includes("primary.test/releases?platform=Windows"),
        ),
      ).toHaveLength(2);
      expect(
        fetchImpl.mock.calls.some(([input]) =>
          String(input).includes("fallback.test/versions/win"),
        ),
      ).toBe(true);
    } finally {
      await fs.rm(workspace, { recursive: true, force: true });
    }
  });

  it("does not write state or articles when a required platform has no source", async () => {
    const workspace = await createWorkspace();
    const fetchImpl = vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (
        (url.includes("primary.test") && url.includes("platform=Linux")) ||
        url.includes("fallback.test/versions/linux")
      ) {
        return new Response("unavailable", { status: 503 });
      }
      return new Response(
        JSON.stringify([
          {
            version: "153.0.8000.1",
            milestone: 153,
            channel: "Stable",
          },
        ]),
        { status: 200 },
      );
    });

    try {
      await expect(
        runCollector({
          root: workspace,
          fetchImpl,
          logger: { log: vi.fn(), warn: vi.fn() },
          now: () => new Date("2026-09-04T00:00:00.000Z"),
        }),
      ).rejects.toThrow("503");

      const state = JSON.parse(
        await fs.readFile(
          path.join(workspace, "data/release-state.json"),
          "utf8",
        ),
      );
      expect(state).toEqual(initialState);
      expect(
        await fs.readdir(path.join(workspace, "src/content/releases")),
      ).toEqual(["en"]);
    } finally {
      await fs.rm(workspace, { recursive: true, force: true });
    }
  });
});
