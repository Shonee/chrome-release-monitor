import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const releasesDirectory = path.join(process.cwd(), "src/content/releases");

interface ReleaseFrontmatter {
  locale?: "zh-cn" | "en";
  milestone: number;
  version: string;
  status: string;
  generatedBy?: string;
  stableReleasedAt?: string;
  versionReleasedAt?: string;
  images?: Array<{ src: string; mirror?: boolean }>;
}

function readReleases() {
  function readDirectory(
    directory: string,
  ): Array<{ filename: string } & ReleaseFrontmatter> {
    return fs
      .readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return readDirectory(fullPath);
        if (!entry.name.endsWith(".md")) return [];
        const data = matter(fs.readFileSync(fullPath, "utf8"))
          .data as ReleaseFrontmatter;
        return [
          { filename: path.relative(releasesDirectory, fullPath), ...data },
        ];
      });
  }
  return readDirectory(releasesDirectory);
}

describe("release content", () => {
  it("keeps the Chinese and English release sets aligned as versions grow", () => {
    const signatures = (locale: "zh-cn" | "en") =>
      readReleases()
        .filter((release) => (release.locale || "zh-cn") === locale)
        .map((release) => `${release.milestone}:${release.version}`)
        .sort();

    const chinese = signatures("zh-cn");
    expect(chinese.length).toBeGreaterThan(0);
    expect(signatures("en")).toEqual(chinese);
  });

  it("requires official timing and images for published releases", () => {
    for (const release of readReleases().filter(
      (entry) => entry.status === "published",
    )) {
      expect(release.stableReleasedAt, release.filename).toBeTruthy();
      expect(release.versionReleasedAt, release.filename).toBeTruthy();
      const images = release.images || [];
      if (images.length > 0) {
        expect(images[0]?.src, release.filename).toMatch(
          /^https:\/\/developer\.chrome\.com\//,
        );
      } else {
        expect(release.generatedBy, release.filename).toBe(
          "chrome-release-monitor",
        );
      }
    }
  });
});
