import path from "node:path";

function normalizeTimestamp(value) {
  if (!value) return new Date().toISOString();
  const numeric = Number(value);
  if (Number.isFinite(numeric)) {
    return new Date(
      numeric < 10_000_000_000 ? numeric * 1000 : numeric,
    ).toISOString();
  }
  return new Date(value).toISOString();
}

export function normalizeChromiumDashRelease(payload, platform) {
  const version = String(payload.version || "");
  const milestone = Number(payload.milestone || version.split(".")[0]);
  if (!version || !Number.isInteger(milestone)) {
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
  if (!version || !Number.isInteger(milestone)) {
    throw new Error(`Invalid VersionHistory release for ${platform}`);
  }
  return {
    version,
    milestone,
    channel: "Stable",
    platform,
    publishedAt: new Date().toISOString(),
  };
}

export function formatCombinedVersion(releases) {
  const versions = [...new Set(releases.map((release) => release.version))]
    .filter(Boolean)
    .sort((left, right) => {
      const a = left.split(".").map(Number);
      const b = right.split(".").map(Number);
      for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
        const difference = (a[index] || 0) - (b[index] || 0);
        if (difference !== 0) return difference;
      }
      return 0;
    });

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

export function buildReleaseMarkdown(release) {
  const sourceUrl = `https://developer.chrome.com/release-notes/${release.milestone}/`;
  const articleCreatedAt = release.articleCreatedAt || new Date().toISOString();
  const stableReleasedAt = release.stableReleasedAt || release.publishedAt;
  const versionReleasedAt = release.versionReleasedAt || release.publishedAt;
  return `---
title: Chrome ${release.milestone} 更新与使用指南
locale: zh-cn
milestone: ${release.milestone}
version: ${release.version}
channel: ${release.channel}
publishedAt: ${articleCreatedAt}
updatedAt: ${articleCreatedAt}
stableReleasedAt: ${stableReleasedAt}
versionReleasedAt: ${versionReleasedAt}
status: draft
summary: Chrome ${release.milestone} 已进入桌面稳定版渠道，本文将持续整理用户功能、Web 平台变化、安全修复与使用方法。
platforms:
${release.platforms.map((platform) => `  - ${platform}`).join("\n")}
tags:
  - Chrome
  - Stable
  - 浏览器更新
audience:
  - user
  - developer
  - enterprise
highlights: []
sources:
  - label: Chrome ${release.milestone} Release Notes
    url: ${sourceUrl}
---

> 本文由自动检测流程创建。正式发布前请根据官方发布说明补充功能细节、使用步骤和安全更新信息。

## 本次更新概览

Chrome ${release.milestone} 已检测到新的 Stable 版本：\`${release.version}\`。

## 普通用户关注的变化

待根据 Chrome 官方发布公告补充。

## 开发者与 Web 平台更新

待根据 Chrome Release Notes 与 Chrome Status 补充 API、兼容性和示例代码。

## 企业管理员注意事项

待补充策略变化、弃用计划和分阶段升级建议。

## 如何更新 Chrome

1. 打开 Chrome 右上角菜单。
2. 进入“帮助” → “关于 Google Chrome”。
3. 等待浏览器完成下载与安装。
4. 重新启动浏览器并确认完整版本号。

## 来源

- [Chrome ${release.milestone} Release Notes](${sourceUrl})
- [Chrome Releases](https://chromereleases.googleblog.com/)
`;
}

export function validateAssetSource(sourceUrl, allowedHosts) {
  try {
    const parsed = new URL(sourceUrl);
    if (parsed.protocol !== "https:") return false;
    return allowedHosts.some(
      (host) =>
        parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    );
  } catch {
    return false;
  }
}

export function createAssetPath(
  milestone,
  hash,
  mimeType,
  prefix = "releases",
) {
  const extensionByMime = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  const extension = extensionByMime[mimeType];
  if (!extension) throw new Error(`Unsupported asset MIME type: ${mimeType}`);
  return path.posix.join(prefix, `m${milestone}`, `${hash}${extension}`);
}
