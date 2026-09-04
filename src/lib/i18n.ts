import type { DownloadSource, SiteConfig, SourcesConfig } from "./config";
import { isExternalUrl, withBase } from "./urls";

export const supportedLocales = ["zh-cn", "en"] as const;
export type Locale = (typeof supportedLocales)[number];

export const localeMeta: Record<
  Locale,
  { htmlLang: string; dateLocale: string; label: string; shortLabel: string }
> = {
  "zh-cn": {
    htmlLang: "zh-CN",
    dateLocale: "zh-CN",
    label: "简体中文",
    shortLabel: "中文",
  },
  en: {
    htmlLang: "en",
    dateLocale: "en-US",
    label: "English",
    shortLabel: "EN",
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function requireLocale(value: string | undefined): Locale {
  if (!isLocale(value)) throw new Error(`Unsupported locale: ${value}`);
  return value;
}

export function getLocaleStaticPaths() {
  return supportedLocales.map((lang) => ({ params: { lang } }));
}

export function localizedPath(locale: Locale, pathname = "/"): string {
  if (isExternalUrl(pathname)) return pathname;
  if (pathname === "/") return withBase(`/${locale}/`);
  const cleanPath = `/${pathname.replace(/^\/+|\/+$/g, "")}`;
  const suffix = /\.[a-z0-9]+$/i.test(cleanPath) ? cleanPath : `${cleanPath}/`;
  return withBase(`/${locale}${suffix}`);
}

export function alternateLocalePath(
  currentPath: string,
  targetLocale: Locale,
): string {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const relative = currentPath.startsWith(base)
    ? currentPath.slice(base.length)
    : currentPath.replace(/^\//, "");
  const suffix = relative.replace(/^(zh-cn|en)(?=\/|$)/, "");
  return withBase(
    `/${targetLocale}${suffix.startsWith("/") ? suffix : `/${suffix}`}`,
  );
}

export function localizeSite(site: SiteConfig, locale: Locale): SiteConfig {
  if (locale === "zh-cn") return site;
  const translation = site.translations.en;
  return {
    ...site,
    ...translation,
    language: localeMeta.en.htmlLang,
    locale: localeMeta.en.dateLocale,
    home: translation.home,
    navigation: translation.navigation,
  };
}

export function localizeDownloadSource(
  source: DownloadSource,
  locale: Locale,
): DownloadSource {
  if (locale === "zh-cn" || !source.translations?.en) return source;
  return { ...source, ...source.translations.en };
}

export function localizeOfficialSource(
  source: SourcesConfig["officialSources"][number],
  locale: Locale,
) {
  if (locale === "zh-cn" || !source.translations?.en) return source;
  return { ...source, ...source.translations.en };
}

export const ui = {
  "zh-cn": {
    header: {
      home: "返回首页",
      navigation: "主导航",
      search: "搜索更新",
      theme: "切换主题",
      repository: "GitHub 仓库",
      searchEyebrow: "Search releases",
      searchTitle: "搜索 Chrome 更新",
      closeSearch: "关闭搜索",
      searchPlaceholder: "输入版本、功能或关键词",
      downloadTitle: "下载 Chrome",
      downloadSummary: "官方、国内社区与自定义下载源",
      noResults: "没有找到匹配的更新文章。",
      resultFallbackTitle: "Chrome 更新文章",
      resultFallbackSummary: "正文关键词匹配",
    },
    footer: { navigation: "页脚导航", download: "下载 Chrome" },
    home: {
      configUpdated: "数据配置更新于",
      readLatest: "阅读最新更新",
      latest: "Latest stable",
      fullVersion: "完整版本",
      platforms: "平台",
      status: "状态",
      changesEyebrow: "What changed",
      changesTitle: "这次更新值得关注什么",
      fullArticle: "查看完整文章",
      archiveEyebrow: "Release archive",
      archiveTitle: "版本记录",
      allVersions: "全部版本",
      sourcesEyebrow: "Transparent sources",
      sourcesTitle: "每条结论都保留来源边界",
      sourcesDescription:
        "版本数据来自官方接口，自动文章只发布可验证的版本、平台和来源信息。",
      officialSources: "个官方来源",
      thirdParty: "第三方下载明确标注",
      buildValidation: "配置构建时校验",
      feeds: "RSS 与 JSON Feed",
    },
    archive: {
      title: "版本归档",
      description: "Chrome 稳定版更新文章归档。",
      eyebrow: "Release archive",
      heading: "Chrome 版本归档",
      summary: "按里程碑记录稳定版更新、功能说明、使用方法和来源信息。",
    },
    card: { securityFixes: "项安全修复", read: "阅读" },
    article: {
      back: "返回最新更新",
      published: "本站发布于",
      updated: "本站更新于",
      download: "下载 Chrome",
      imageUnavailable: "官方图片暂时无法加载",
      imageHint: "可通过下方来源链接查看原图",
      imageSource: "查看官方图片来源",
      toc: "本文目录",
      moreImages: "更多官方功能图片",
      galleryHint: "可通过图片来源查看原图",
      gallerySource: "查看官方来源",
      fullVersion: "完整版本",
      milestone: "里程碑",
      stableReleased: "正式版发布",
      versionReleased: "当前版本发布",
      securityFixes: "安全修复",
      sources: "来源记录",
    },
    export: {
      open: "复制与发布",
      eyebrow: "Publish anywhere",
      title: "复制文章内容",
      close: "关闭",
      wechat: "微信公众号 HTML",
      wechatHint: "内联样式，适合粘贴到编辑器",
      markdown: "原始 Markdown",
      markdownHint: "适合迁移到其他内容仓库",
      html: "通用 HTML",
      htmlHint: "适合博客和富文本平台",
      fallback: "待手动复制的导出内容",
      selected: "已选择",
      copy: "复制到剪贴板",
      copied: "内容已复制",
      copyFailed: "自动复制失败，内容已选中",
      loadFailed: "导出文件读取失败",
    },
    downloads: {
      title: "下载 Chrome",
      description: "按平台选择 Chrome 官方、国内社区、镜像或自定义下载来源。",
      back: "返回最新更新",
      eyebrow: "Verified download routes",
      heading: "选择适合你的 Chrome 下载方式",
      summary:
        "默认优先使用 Google 官方渠道。国内入口、社区索引和镜像会单独标注来源、适用平台与校验状态。",
      officialFirst: "官方渠道优先",
      updated: "更新",
      configValidated: "配置构建时校验",
      centerEyebrow: "Download center",
      centerTitle: "Chrome 安装包",
      choosePlatform: "选择操作系统",
      recommended: "推荐",
      checked: "检查",
      protocolDisabled: "下载地址协议未启用",
      safetyEyebrow: "Before installing",
      safetyTitle: "安装前检查",
      safety: [
        ["优先确认来源", "安装页、最终下载域名和数字签名应保持一致。"],
        ["核对完整版本", "下载记录应包含平台、架构、版本号和抓取时间。"],
        [
          "镜像不是官方背书",
          "第三方镜像只解决网络可达性，不改变软件来源责任。",
        ],
      ],
      types: {
        official: "官方渠道",
        mirror: "国内第三方镜像",
        community: "国内社区入口",
        enterprise: "企业离线包",
        cloud: "网盘或对象存储",
        custom: "自定义下载源",
      },
      statuses: {
        verified: "已核验可访问",
        monitoring: "可用性观察中",
        degraded: "服务降级",
        planned: "示例地址 · 待替换",
        unverified: "尚未核验",
      },
    },
    sources: {
      title: "数据来源",
      description: "Chrome 更新检测与版本文章的数据来源说明。",
      eyebrow: "Evidence first",
      heading: "数据来源与核验边界",
      summary:
        "自动化流程从官方接口发现版本变化，并以保守模板发布可验证信息；安全详情仍以 Chrome 官方公告为准。",
      open: "打开",
    },
  },
  en: {
    header: {
      home: "Back to home",
      navigation: "Primary navigation",
      search: "Search releases",
      theme: "Toggle theme",
      repository: "GitHub repository",
      searchEyebrow: "Search releases",
      searchTitle: "Search Chrome updates",
      closeSearch: "Close search",
      searchPlaceholder: "Search versions, features, or keywords",
      downloadTitle: "Download Chrome",
      downloadSummary: "Official, community, mirror, and custom sources",
      noResults: "No matching release articles found.",
      resultFallbackTitle: "Chrome release article",
      resultFallbackSummary: "Matched in article content",
    },
    footer: { navigation: "Footer navigation", download: "Download Chrome" },
    home: {
      configUpdated: "Source configuration updated",
      readLatest: "Read the latest release",
      latest: "Latest stable",
      fullVersion: "Full version",
      platforms: "Platforms",
      status: "Status",
      changesEyebrow: "What changed",
      changesTitle: "What matters in this release",
      fullArticle: "Read the full article",
      archiveEyebrow: "Release archive",
      archiveTitle: "Release history",
      allVersions: "All releases",
      sourcesEyebrow: "Transparent sources",
      sourcesTitle: "Every conclusion keeps its evidence boundary",
      sourcesDescription:
        "Version data comes from official APIs, and automated articles publish only verifiable versions, platforms, and sources.",
      officialSources: "official sources",
      thirdParty: "Third-party downloads are clearly labeled",
      buildValidation: "Configuration validated at build time",
      feeds: "RSS and JSON Feed",
    },
    archive: {
      title: "Release archive",
      description: "Archive of Chrome Stable release articles.",
      eyebrow: "Release archive",
      heading: "Chrome release archive",
      summary:
        "Milestone-by-milestone records of Stable updates, features, usage guidance, and sources.",
    },
    card: { securityFixes: "security fixes", read: "Read" },
    article: {
      back: "Back to latest release",
      published: "Published here",
      updated: "Updated here",
      download: "Download Chrome",
      imageUnavailable: "The official image is temporarily unavailable",
      imageHint: "Open the source link below to view the original",
      imageSource: "View official image source",
      toc: "On this page",
      moreImages: "More official feature images",
      galleryHint: "Open the image source to view the original",
      gallerySource: "View official source",
      fullVersion: "Full version",
      milestone: "Milestone",
      stableReleased: "Stable released",
      versionReleased: "Current version released",
      securityFixes: "Security fixes",
      sources: "Source record",
    },
    export: {
      open: "Copy and publish",
      eyebrow: "Publish anywhere",
      title: "Copy article content",
      close: "Close",
      wechat: "WeChat HTML",
      wechatHint: "Inline styles for rich-text editors",
      markdown: "Source Markdown",
      markdownHint: "For other content repositories",
      html: "Generic HTML",
      htmlHint: "For blogs and rich-text platforms",
      fallback: "Article content ready for manual copy",
      selected: "Selected",
      copy: "Copy to clipboard",
      copied: "Content copied",
      copyFailed: "Automatic copy failed; content selected",
      loadFailed: "Could not load the export file",
    },
    downloads: {
      title: "Download Chrome",
      description:
        "Choose an official, enterprise, community, mirror, or custom Chrome download source for your platform.",
      back: "Back to latest release",
      eyebrow: "Verified download routes",
      heading: "Choose the right Chrome download",
      summary:
        "Google's official channel remains the default. Community indexes, domestic mirrors, and custom sources are labeled with their provider and verification state.",
      officialFirst: "Official channel first",
      updated: "updated",
      configValidated: "Configuration validated at build time",
      centerEyebrow: "Download center",
      centerTitle: "Chrome installers",
      choosePlatform: "Choose an operating system",
      recommended: "Recommended",
      checked: "checked",
      protocolDisabled: "Download URL protocol is disabled",
      safetyEyebrow: "Before installing",
      safetyTitle: "Installation checks",
      safety: [
        [
          "Confirm the source",
          "The landing page, final download domain, and digital signature should agree.",
        ],
        [
          "Check the full version",
          "Record the platform, architecture, version number, and verification date.",
        ],
        [
          "A mirror is not an endorsement",
          "A third-party mirror improves reachability but does not change the software trust boundary.",
        ],
      ],
      types: {
        official: "Official channel",
        mirror: "Third-party mirror",
        community: "Community download index",
        enterprise: "Enterprise package",
        cloud: "Cloud storage",
        custom: "Custom source",
      },
      statuses: {
        verified: "Verified reachable",
        monitoring: "Availability under observation",
        degraded: "Degraded",
        planned: "Example URL · replace before use",
        unverified: "Not yet verified",
      },
    },
    sources: {
      title: "Data sources",
      description:
        "Sources used for Chrome version detection and release articles.",
      eyebrow: "Evidence first",
      heading: "Sources and verification boundaries",
      summary:
        "Automation detects changes through official APIs and publishes a conservative factual summary. Chrome's official announcements remain authoritative for security details.",
      open: "Open",
    },
  },
} as const;

export function getUi(locale: Locale) {
  return ui[locale];
}
