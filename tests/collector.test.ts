import { describe, expect, it } from "vitest";
import {
  buildReleaseMarkdown,
  createAssetPath,
  formatCombinedVersion,
  hasReleaseStateChanged,
  normalizeChromiumDashRelease,
  validateAssetSource,
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

  it("generates an editable Chinese release document", () => {
    const markdown = buildReleaseMarkdown({
      milestone: 152,
      version: "152.0.7977.76",
      channel: "Stable",
      publishedAt: "2026-09-01T00:00:00.000Z",
      articleCreatedAt: "2026-09-03T00:00:00.000Z",
      platforms: ["Windows", "Mac", "Linux"],
    });
    expect(markdown).toContain("Chrome 152 更新与使用指南");
    expect(markdown).toContain("locale: zh-cn");
    expect(markdown).toContain("## 如何更新 Chrome");
    expect(markdown).toContain("status: draft");
    expect(markdown).toContain("stableReleasedAt: 2026-09-01T00:00:00.000Z");
    expect(markdown).toContain("publishedAt: 2026-09-03T00:00:00.000Z");
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

  it("accepts only configured official image hosts", () => {
    expect(
      validateAssetSource("https://developer.chrome.com/static/a.png", [
        "developer.chrome.com",
      ]),
    ).toBe(true);
    expect(
      validateAssetSource("https://example.com/a.png", [
        "developer.chrome.com",
      ]),
    ).toBe(false);
    expect(createAssetPath(152, "abc123", "image/png")).toBe(
      "releases/m152/abc123.png",
    );
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
