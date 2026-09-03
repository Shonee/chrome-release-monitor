import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

const releasesDirectory = path.join(process.cwd(), "src/content/releases");

interface ReleaseFrontmatter {
  locale?: "zh-cn" | "en";
  milestone: number;
  status: string;
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
  it("contains the 2026 Chrome 144 through 152 archive", () => {
    for (const locale of ["zh-cn", "en"] as const) {
      const milestones = readReleases()
        .filter((release) => (release.locale || "zh-cn") === locale)
        .map((release) => release.milestone)
        .sort((left, right) => left - right);
      expect(milestones, locale).toEqual([
        144, 145, 146, 147, 148, 149, 150, 151, 152,
      ]);
    }
  });

  it("requires official timing and images for published releases", () => {
    for (const release of readReleases().filter(
      (entry) => entry.status === "published",
    )) {
      expect(release.stableReleasedAt, release.filename).toBeTruthy();
      expect(release.versionReleasedAt, release.filename).toBeTruthy();
      const images = release.images || [];
      expect(images.length, release.filename).toBeGreaterThan(0);
      expect(images[0]?.src, release.filename).toMatch(
        /^https:\/\/developer\.chrome\.com\//,
      );
      expect(images[0]?.mirror, release.filename).toBe(true);
    }
  });
});
