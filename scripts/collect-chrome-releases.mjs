import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import matter from "gray-matter";
import {
  buildReleaseMarkdown,
  compareVersions,
  createReleaseSlug,
  extractReleaseNoteTitles,
  fetchJsonWithRetry,
  fetchTextWithRetry,
  formatCombinedVersion,
  getChangedReleaseGroups,
  hasReleaseStateChanged,
  normalizeChromiumDashRelease,
  normalizeVersionHistoryRelease,
} from "./lib/collector.mjs";

export async function runCollector(options = {}) {
  const {
    dryRun = process.argv.includes("--dry-run"),
    fetchImpl = fetch,
    logger = console,
    now = () => new Date(),
    root = process.cwd(),
  } = options;
  const config = JSON.parse(
    await fs.readFile(path.join(root, "config/sources.json"), "utf8"),
  );
  const statePath = path.join(root, "data/release-state.json");
  const state = JSON.parse(await fs.readFile(statePath, "utf8"));
  const releasesDirectory = path.join(root, "src/content/releases");

  function requestOptions(label) {
    return {
      attempts: config.collector.maxAttempts,
      baseDelayMs: config.collector.retryBaseDelayMs,
      fetchImpl,
      timeoutMs: config.collector.requestTimeoutMs,
      headers: {
        Accept: "application/json",
        "User-Agent": config.collector.userAgent,
      },
      onRetry: ({ attempt, error, waitMs }) => {
        logger.warn(
          `${label} attempt ${attempt} failed: ${error.message}; retrying in ${waitMs}ms`,
        );
      },
    };
  }

  function latestRelease(items, normalize, platform) {
    const normalized = items.map((item) => normalize(item, platform));
    return normalized.sort((left, right) =>
      compareVersions(right.version, left.version),
    )[0];
  }

  async function fetchPrimaryRelease(platform) {
    const url = config.collector.releaseEndpoint.replace(
      "{platform}",
      encodeURIComponent(platform),
    );
    const payload = await fetchJsonWithRetry(
      url,
      requestOptions(`Primary release source for ${platform}`),
    );
    const items = Array.isArray(payload) ? payload : payload.releases || [];
    if (!items.length) {
      throw new Error(`No Chromium Dashboard release returned for ${platform}`);
    }
    return latestRelease(items, normalizeChromiumDashRelease, platform);
  }

  async function fetchFallbackRelease(platform) {
    const platformValue = config.collector.fallbackPlatformMap[platform];
    if (!platformValue) {
      throw new Error(
        `No fallback platform mapping configured for ${platform}`,
      );
    }
    const url = config.collector.fallbackReleaseEndpoint.replace(
      "{platform}",
      encodeURIComponent(platformValue),
    );
    const payload = await fetchJsonWithRetry(
      url,
      requestOptions(`Fallback release source for ${platform}`),
    );
    const items = payload.versions || [];
    if (!items.length) {
      throw new Error(`No Version History release returned for ${platform}`);
    }
    return latestRelease(items, normalizeVersionHistoryRelease, platform);
  }

  async function fetchLatestForPlatform(platform) {
    try {
      return await fetchPrimaryRelease(platform);
    } catch (primaryError) {
      logger.warn(
        `Primary release source failed for ${platform}: ${primaryError.message}`,
      );
      return fetchFallbackRelease(platform);
    }
  }

  async function fetchFeatureTitles(milestone) {
    const source = config.officialSources.find(
      (item) => item.id === "chrome-release-notes",
    );
    const url = source?.urlTemplate?.replace("{milestone}", String(milestone));
    if (!url) return [];

    try {
      const html = await fetchTextWithRetry(url, {
        ...requestOptions(`Release notes for Chrome ${milestone}`),
        headers: {
          Accept: "text/html",
          "User-Agent": config.collector.userAgent,
        },
      });
      return extractReleaseNoteTitles(html);
    } catch (error) {
      logger.warn(
        `Release-note enrichment skipped for Chrome ${milestone}: ${error.message}`,
      );
      return [];
    }
  }

  async function findEquivalentArticle(locale, milestone, version) {
    const directory =
      locale === "en" ? path.join(releasesDirectory, "en") : releasesDirectory;
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile() || !/\.mdx?$/.test(entry.name)) continue;
      const filePath = path.join(directory, entry.name);
      const parsed = matter(await fs.readFile(filePath, "utf8"));
      if (
        parsed.data.milestone === milestone &&
        String(parsed.data.version) === version
      ) {
        return {
          path: filePath,
          generated: parsed.data.generatedBy === "chrome-release-monitor",
        };
      }
    }
    return null;
  }

  async function createArticles(group, detectedAt) {
    const version = formatCombinedVersion(group.releases);
    const featureTitles = await fetchFeatureTitles(group.milestone);
    const slug = createReleaseSlug(group.milestone, version);
    const results = [];

    for (const locale of ["zh-cn", "en"]) {
      const existing = await findEquivalentArticle(
        locale,
        group.milestone,
        version,
      );
      const articlePath =
        existing?.path ||
        path.join(releasesDirectory, locale === "en" ? "en" : "", `${slug}.md`);
      if ((!existing || existing.generated) && !dryRun) {
        const markdown = buildReleaseMarkdown(
          { ...group, detectedAt, featureTitles },
          locale,
        );
        await fs.writeFile(articlePath, markdown, "utf8");
      }
      results.push({
        locale,
        path: path.relative(root, articlePath),
        created: !existing,
        updated: Boolean(existing?.generated),
      });
    }

    return results;
  }

  const releases = await Promise.all(
    config.collector.platforms.map(fetchLatestForPlatform),
  );
  const latestMilestone = Math.max(
    ...releases.map((release) => release.milestone),
  );
  const detectedAt = now().toISOString();
  const nextState = {
    lastCheckedAt: detectedAt,
    latestMilestone,
    latestByPlatform: Object.fromEntries(
      releases.map((release) => [
        release.platform,
        { version: release.version, milestone: release.milestone },
      ]),
    ),
  };
  const changed = hasReleaseStateChanged(state, nextState);
  const changedGroups = changed ? getChangedReleaseGroups(state, releases) : [];
  const articles = [];

  for (const group of changedGroups) {
    articles.push(...(await createArticles(group, detectedAt)));
  }

  if (!dryRun && changed) {
    await fs.writeFile(
      statePath,
      `${JSON.stringify(nextState, null, 2)}\n`,
      "utf8",
    );
  }

  const result = {
    dryRun,
    changed,
    latestMilestone,
    releases,
    articles,
  };
  logger.log(JSON.stringify(result, null, 2));
  return result;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await runCollector();
}
