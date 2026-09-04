import { load } from "cheerio";

const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function normalizeTimestamp(value) {
  if (!value) return null;
  const numeric = Number(value);
  const date = Number.isFinite(numeric)
    ? new Date(numeric < 10_000_000_000 ? numeric * 1000 : numeric)
    : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid release timestamp: ${value}`);
  }
  return date.toISOString();
}

export function compareVersions(left, right) {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] || 0) - (b[index] || 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

async function fetchWithRetry(url, responseType, options = {}) {
  const {
    attempts = 3,
    baseDelayMs = 750,
    fetchImpl = fetch,
    headers = {},
    onRetry = () => {},
    sleep = delay,
    timeoutMs = 20_000,
  } = options;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!response.ok) {
        const error = new Error(
          `${response.status} ${response.statusText} from ${url}`,
        );
        error.retryable = retryableStatuses.has(response.status);
        throw error;
      }
      return responseType === "json"
        ? await response.json()
        : await response.text();
    } catch (error) {
      lastError = error;
      if (error.retryable === false || attempt === attempts) throw error;
      const waitMs = Math.min(baseDelayMs * 2 ** (attempt - 1), 10_000);
      onRetry({ attempt, error, waitMs });
      await sleep(waitMs);
    }
  }

  throw lastError;
}

export function fetchJsonWithRetry(url, options) {
  return fetchWithRetry(url, "json", options);
}

export function fetchTextWithRetry(url, options) {
  return fetchWithRetry(url, "text", options);
}

export function normalizeChromiumDashRelease(payload, platform) {
  const version = String(payload.version || "");
  const milestone = Number(payload.milestone || version.split(".")[0]);
  if (!/^\d+(\.\d+)+$/.test(version) || !Number.isInteger(milestone)) {
    throw new Error(`Invalid Chromium Dashboard release for ${platform}`);
  }
  return {
    version,
    milestone,
    channel: String(payload.channel || "Stable"),
    platform,
    publishedAt: normalizeTimestamp(payload.time),
  };
}

export function normalizeVersionHistoryRelease(payload, platform) {
  const version = String(
    payload.version || payload.name?.split("/").at(-1) || "",
  );
  const milestone = Number(version.split(".")[0]);
  if (!/^\d+(\.\d+)+$/.test(version) || !Number.isInteger(milestone)) {
    throw new Error(`Invalid VersionHistory release for ${platform}`);
  }
  return {
    version,
    milestone,
    channel: "Stable",
    platform,
    publishedAt: null,
  };
}

export function formatCombinedVersion(releases) {
  const versions = [...new Set(releases.map((release) => release.version))]
    .filter(Boolean)
    .sort(compareVersions);

  if (versions.length <= 1) return versions[0] || "";
  const segments = versions.map((version) => version.split("."));
  const sharedPrefix = segments[0].slice(0, -1).join(".");
  const onlyPatchDiffers = segments.every(
    (parts) => parts.slice(0, -1).join(".") === sharedPrefix,
  );

  return onlyPatchDiffers
    ? `${sharedPrefix}.${segments.map((parts) => parts.at(-1)).join("/")}`
    : versions.join(" / ");
}

function comparableReleaseState(state = {}) {
  return {
    latestMilestone: state.latestMilestone ?? null,
    latestByPlatform: Object.fromEntries(
      Object.entries(state.latestByPlatform || {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([platform, release]) => [
          platform,
          {
            version: release?.version ?? null,
            milestone: release?.milestone ?? null,
          },
        ]),
    ),
  };
}

export function hasReleaseStateChanged(previous, next) {
  return (
    JSON.stringify(comparableReleaseState(previous)) !==
    JSON.stringify(comparableReleaseState(next))
  );
}

export function getChangedReleaseGroups(previous, releases) {
  const changedMilestones = new Set(
    releases
      .filter((release) => {
        const oldRelease = previous?.latestByPlatform?.[release.platform];
        return (
          oldRelease?.version !== release.version ||
          oldRelease?.milestone !== release.milestone
        );
      })
      .map((release) => release.milestone),
  );

  return [...changedMilestones]
    .sort((left, right) => right - left)
    .map((milestone) => ({
      milestone,
      releases: releases.filter((release) => release.milestone === milestone),
    }));
}

export function extractReleaseNoteTitles(html, limit = 8) {
  const $ = load(html);
  const ignored = new Set([
    "overview",
    "further reading",
    "related resources",
    "download google chrome",
  ]);
  const titles = [];

  $("main h2, main h3").each((_, element) => {
    const title = $(element).text().replace(/\s+/g, " ").trim();
    if (
      title.length >= 4 &&
      title.length <= 160 &&
      !ignored.has(title.toLowerCase()) &&
      !titles.includes(title) &&
      titles.length < limit
    ) {
      titles.push(title);
    }
  });

  return titles;
}

export function createReleaseSlug(milestone, version) {
  const versionSlug = version
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `chrome-${milestone}-${versionSlug}`;
}

function platformLabel(platform) {
  return platform === "Mac" ? "macOS" : platform;
}

function quoteYaml(value) {
  return JSON.stringify(value);
}

export function buildReleaseMarkdown(releaseGroup, locale = "zh-cn") {
  const { detectedAt, featureTitles = [], milestone, releases } = releaseGroup;
  const version = formatCombinedVersion(releases);
  const platforms = releases.map((release) => platformLabel(release.platform));
  const releaseDates = releases
    .map((release) => release.publishedAt)
    .filter(Boolean)
    .sort();
  const stableReleasedAt = releaseDates[0] || detectedAt;
  const versionReleasedAt = releaseDates.at(-1) || detectedAt;
  const notesUrl = `https://developer.chrome.com/release-notes/${milestone}/`;
  const blogUrl = "https://chromereleases.googleblog.com/";
  const isEnglish = locale === "en";
  const title = isEnglish
    ? `Chrome ${milestone} Stable update: ${version}`
    : `Chrome ${milestone} 稳定版更新：${version}`;
  const summary = isEnglish
    ? `Chrome ${milestone} Stable is available for ${platforms.join(", ")}. This article records the versions detected from official Chrome data sources.`
    : `Chrome ${milestone} 稳定版已面向 ${platforms.join("、")} 更新，本文记录从 Chrome 官方数据源检测到的版本信息。`;
  const sourceLabels = isEnglish
    ? ["Chrome release notes", "Chrome Releases blog"]
    : ["Chrome 版本说明", "Chrome Releases 官方博客"];
  const rows = releases
    .map((release) => {
      const releaseDate =
        release.publishedAt?.slice(0, 10) || detectedAt.slice(0, 10);
      return `| ${platformLabel(release.platform)} | \`${release.version}\` | ${releaseDate} |`;
    })
    .join("\n");
  const features = featureTitles.length
    ? featureTitles.map((feature) => `- ${feature}`).join("\n")
    : isEnglish
      ? `The official milestone notes were temporarily unavailable during collection. See [Chrome ${milestone} release notes](${notesUrl}) for the feature list.`
      : `采集时暂未取得该里程碑的功能标题，请查看 [Chrome ${milestone} 版本说明](${notesUrl}) 获取完整功能列表。`;

  const body = isEnglish
    ? `## Current Stable versions

Detected at: ${detectedAt}

| Platform | Version | Official release or detection date |
| --- | --- | --- |
${rows}

## Official update entries

${features}

The milestone notes describe browser and Web Platform changes. Security-fix counts and CVE details remain authoritative only in the [Chrome Releases blog](${blogUrl}).

## Update Chrome

Open the Chrome menu, choose **Help > About Google Chrome**, wait for the update to finish, and restart the browser. Managed environments should validate critical applications and policies before broad rollout.

## Sources

- [Chrome ${milestone} release notes](${notesUrl})
- [Chrome Releases blog](${blogUrl})`
    : `## 当前稳定版

检测时间：${detectedAt}

| 平台 | 版本 | 官方发布时间或检测日期 |
| --- | --- | --- |
${rows}

## 官方更新条目

${features}

里程碑说明用于确认浏览器与 Web 平台变化；安全修复数量和 CVE 详情以 [Chrome Releases 官方博客](${blogUrl}) 为准。

## 更新 Chrome

打开 Chrome 菜单，进入**帮助 > 关于 Google Chrome**，等待更新完成后重新启动。企业环境应先验证关键应用和策略，再逐步扩大升级范围。

## 来源

- [Chrome ${milestone} 版本说明](${notesUrl})
- [Chrome Releases 官方博客](${blogUrl})`;

  return `---
title: ${quoteYaml(title)}
locale: ${locale}
milestone: ${milestone}
version: ${quoteYaml(version)}
channel: Stable
publishedAt: ${detectedAt}
updatedAt: ${detectedAt}
stableReleasedAt: ${stableReleasedAt}
versionReleasedAt: ${versionReleasedAt}
status: published
generatedBy: chrome-release-monitor
summary: ${quoteYaml(summary)}
platforms:
${platforms.map((platform) => `  - ${platform}`).join("\n")}
tags:
  - Chrome
  - Stable
audience:
  - user
  - developer
  - enterprise
highlights: []
sources:
  - label: ${quoteYaml(sourceLabels[0])}
    url: ${notesUrl}
  - label: ${quoteYaml(sourceLabels[1])}
    url: ${blogUrl}
---

${body}
`;
}
