import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  buildReleaseMarkdown,
  formatCombinedVersion,
  hasReleaseStateChanged,
  normalizeChromiumDashRelease,
  normalizeVersionHistoryRelease,
} from "./lib/collector.mjs";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const config = JSON.parse(
  await fs.readFile(path.join(root, "config/sources.json"), "utf8"),
);
const statePath = path.join(root, "data/release-state.json");
const state = JSON.parse(await fs.readFile(statePath, "utf8"));

function compareVersions(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] || 0) - (b[index] || 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": config.collector.userAgent,
    },
    signal: AbortSignal.timeout(config.collector.requestTimeoutMs),
  });
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText} from ${url}`);
  return response.json();
}

async function fetchLatestForPlatform(platform) {
  const url = config.collector.releaseEndpoint.replace(
    "{platform}",
    encodeURIComponent(platform),
  );
  const payload = await fetchJson(url);

  if (config.collector.apiType === "versionhistory") {
    const item = payload.versions?.[0];
    if (!item)
      throw new Error(`No VersionHistory release returned for ${platform}`);
    return normalizeVersionHistoryRelease(item, platform);
  }

  const item = Array.isArray(payload) ? payload[0] : payload.releases?.[0];
  if (!item)
    throw new Error(`No Chromium Dashboard release returned for ${platform}`);
  return normalizeChromiumDashRelease(item, platform);
}

function addDetectionRecord(content, detectedAt, releases) {
  const record = `- ${detectedAt.slice(0, 10)}：${releases.map((item) => `${item.platform} ${item.version}`).join("；")}`;
  if (content.includes(record)) return content;
  if (content.includes("## 自动检测记录"))
    return `${content.trim()}\n${record}\n`;
  return `${content.trim()}\n\n## 自动检测记录\n\n${record}\n`;
}

async function writeOrUpdateArticle(release, releases, detectedAt) {
  const articlePath = path.join(
    root,
    "src/content/releases",
    `chrome-${release.milestone}.md`,
  );
  try {
    const raw = await fs.readFile(articlePath, "utf8");
    const parsed = matter(raw);
    parsed.data.version = release.version;
    parsed.data.updatedAt = detectedAt;
    parsed.data.versionReleasedAt = release.publishedAt || detectedAt;
    parsed.data.stableReleasedAt ||= release.publishedAt || detectedAt;
    parsed.data.platforms = releases.map((item) => item.platform);
    parsed.content = addDetectionRecord(parsed.content, detectedAt, releases);
    if (!dryRun)
      await fs.writeFile(
        articlePath,
        matter.stringify(parsed.content, parsed.data),
        "utf8",
      );
    return { articlePath, created: false, changed: true };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const markdown = buildReleaseMarkdown({
      ...release,
      articleCreatedAt: detectedAt,
      stableReleasedAt: release.publishedAt || detectedAt,
      versionReleasedAt: release.publishedAt || detectedAt,
      platforms: releases.map((item) => item.platform),
    });
    if (!dryRun) await fs.writeFile(articlePath, markdown, "utf8");
    return { articlePath, created: true, changed: true };
  }
}

const releases = await Promise.all(
  config.collector.platforms.map(fetchLatestForPlatform),
);
const latestMilestone = Math.max(
  ...releases.map((release) => release.milestone),
);
const matchingMilestone = releases.filter(
  (release) => release.milestone === latestMilestone,
);
const representative = [...matchingMilestone].sort((left, right) =>
  compareVersions(right.version, left.version),
)[0];
const displayRelease = {
  ...representative,
  version: formatCombinedVersion(matchingMilestone),
};
const detectedAt = new Date().toISOString();

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
const versionChanged = hasReleaseStateChanged(state, nextState);
const articleResult = versionChanged
  ? await writeOrUpdateArticle(displayRelease, matchingMilestone, detectedAt)
  : null;

if (!dryRun && versionChanged)
  await fs.writeFile(
    statePath,
    `${JSON.stringify(nextState, null, 2)}\n`,
    "utf8",
  );

console.log(
  JSON.stringify(
    {
      dryRun,
      changed: versionChanged,
      latestMilestone,
      releases,
      article: articleResult
        ? path.relative(root, articleResult.articlePath)
        : null,
    },
    null,
    2,
  ),
);
