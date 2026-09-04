import { describe, expect, it, vi } from "vitest";
import {
  buildReleaseMarkdown,
  extractReleaseNoteTitles,
  fetchJsonWithRetry,
  formatCombinedVersion,
  getChangedReleaseGroups,
  hasReleaseStateChanged,
  normalizeChromiumDashRelease,
} from "../scripts/lib/collector.mjs";

describe("release collector", () => {
  it("normalizes Chromium Dashboard releases", () => {
    const release = normalizeChromiumDashRelease(
      {
        version: "152.0.7977.76",
        milestone: 152,
        channel: "Stable",
        time: 1788230400000,
      },
      "Windows",
    );
    expect(release.milestone).toBe(152);
    expect(release.platform).toBe("Windows");
  });

  it("generates a publishable Chinese release document from verified data", () => {
    const markdown = buildReleaseMarkdown(
      {
        milestone: 153,
        releases: [
          {
            milestone: 153,
            version: "153.0.8000.1",
            channel: "Stable",
            platform: "Windows",
            publishedAt: "2026-09-03T00:00:00.000Z",
          },
        ],
        detectedAt: "2026-09-04T00:00:00.000Z",
        featureTitles: ["CSS feature update"],
      },
      "zh-cn",
    );
    expect(markdown).toContain("Chrome 153 稳定版更新");
    expect(markdown).toContain("locale: zh-cn");
    expect(markdown).toContain("status: published");
    expect(markdown).toContain("generatedBy: chrome-release-monitor");
    expect(markdown).toContain("| Windows | `153.0.8000.1`");
    expect(markdown).toContain("CSS feature update");
  });

  it("generates the matching English release document", () => {
    const markdown = buildReleaseMarkdown(
      {
        milestone: 153,
        releases: [
          {
            milestone: 153,
            version: "153.0.8000.1",
            channel: "Stable",
            platform: "Linux",
            publishedAt: null,
          },
        ],
        detectedAt: "2026-09-04T00:00:00.000Z",
        featureTitles: [],
      },
      "en",
    );
    expect(markdown).toContain("Chrome 153 Stable update");
    expect(markdown).toContain("locale: en");
    expect(markdown).toContain("## Current Stable versions");
  });

  it("keeps platform patch variants in the displayed full version", () => {
    expect(
      formatCombinedVersion([
        { version: "152.0.7977.75" },
        { version: "152.0.7977.76" },
        { version: "152.0.7977.75" },
      ]),
    ).toBe("152.0.7977.75/76");

    expect(
      formatCombinedVersion([
        { version: "153.0.8000.1" },
        { version: "153.0.8001.2" },
      ]),
    ).toBe("153.0.8000.1 / 153.0.8001.2");
  });

  it("keeps lagging-platform updates in their own milestone group", () => {
    const previous = {
      latestMilestone: 153,
      latestByPlatform: {
        Windows: { version: "153.0.8000.1", milestone: 153 },
        Mac: { version: "152.0.7977.75", milestone: 152 },
        Linux: { version: "152.0.7977.75", milestone: 152 },
      },
    };
    const releases = [
      {
        platform: "Windows",
        version: "153.0.8000.1",
        milestone: 153,
      },
      { platform: "Mac", version: "152.0.7977.80", milestone: 152 },
      { platform: "Linux", version: "152.0.7977.75", milestone: 152 },
    ];

    expect(getChangedReleaseGroups(previous, releases)).toEqual([
      { milestone: 152, releases: releases.slice(1) },
    ]);
  });

  it("retries transient API failures before returning JSON", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ version: "153.0.8000.1" }]), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

    const payload = await fetchJsonWithRetry("https://example.com/releases", {
      attempts: 2,
      baseDelayMs: 1,
      fetchImpl,
      sleep: async () => {},
      timeoutMs: 100,
    });

    expect(payload).toEqual([{ version: "153.0.8000.1" }]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("retries when a successful response contains invalid JSON", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("not-json", { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ versions: [] }), { status: 200 }),
      );

    await expect(
      fetchJsonWithRetry("https://example.com/releases", {
        attempts: 2,
        baseDelayMs: 1,
        fetchImpl,
        sleep: async () => {},
        timeoutMs: 100,
      }),
    ).resolves.toEqual({ versions: [] });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("extracts a bounded list of official release-note headings", () => {
    const html = `<main><h2>Overview</h2><h3>CSS feature update</h3><h3>Web API update</h3></main>`;
    expect(extractReleaseNoteTitles(html)).toEqual([
      "CSS feature update",
      "Web API update",
    ]);
  });

  it("ignores check timestamps when comparing release state", () => {
    const previous = {
      lastCheckedAt: "2026-09-03T00:00:00.000Z",
      latestMilestone: 152,
      latestByPlatform: {
        Windows: { version: "152.0.7977.76", milestone: 152 },
        Mac: { version: "152.0.7977.76", milestone: 152 },
      },
    };

    expect(
      hasReleaseStateChanged(previous, {
        ...previous,
        lastCheckedAt: "2026-09-03T06:00:00.000Z",
      }),
    ).toBe(false);

    expect(
      hasReleaseStateChanged(previous, {
        ...previous,
        lastCheckedAt: "2026-09-03T06:00:00.000Z",
        latestByPlatform: {
          ...previous.latestByPlatform,
          Windows: { version: "152.0.7977.80", milestone: 152 },
        },
      }),
    ).toBe(true);
  });
});
