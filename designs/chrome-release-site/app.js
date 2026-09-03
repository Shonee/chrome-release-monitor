const views = {
  home: document.querySelector("#home-view"),
  article: document.querySelector("#article-view"),
  download: document.querySelector("#download-view"),
};

const searchDialog = document.querySelector("#search-dialog");
const exportDialog = document.querySelector("#export-dialog");
const searchInput = document.querySelector("#search-input");
const toast = document.querySelector("#toast");
const exportStatus = document.querySelector("#export-status");
const downloadPanels = document.querySelector("#download-panels");
const downloadCheckedAt = document.querySelector("#download-checked-at");
let exportMode = "wechat";
let readingSizeIndex = 0;
let selectedPlatform = detectPlatform();
const readingSizes = ["17px", "18px", "16px"];

const sourceTypeMeta = {
  official: { label: "官方渠道", icon: "badge-check" },
  mirror: { label: "国内第三方镜像", icon: "server" },
  community: { label: "国内社区入口", icon: "radio-tower" },
  enterprise: { label: "企业离线包", icon: "building-2" },
  cloud: { label: "网盘或对象存储", icon: "cloud-download" },
  custom: { label: "自定义下载源", icon: "link-2" },
};

const sourceStatusMeta = {
  verified: { label: "已核验可访问", icon: "circle-check" },
  monitoring: { label: "可用性观察中", icon: "radar" },
  degraded: { label: "服务降级", icon: "triangle-alert" },
  planned: { label: "示例地址 · 待替换", icon: "settings-2" },
  unverified: { label: "尚未核验", icon: "circle-help" },
};

const markdownSample = `---
title: Chrome 152 更新与使用指南
milestone: 152
channel: stable
published: 2026-08-25
updated: 2026-09-03
---

# Chrome 152 更新与使用指南

Chrome 152 已进入桌面 Stable 渠道。随后发布的补丁包含 26 项安全修复。

## 重点变化

- 滚动触发动画
- 历史记录导航识别
- 声明式命令调用

## 升级建议

打开 Chrome 菜单，进入“帮助” → “关于 Google Chrome”，完成更新并重新启动。`;

const wechatHtml = `<section style="font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;color:#242424;line-height:1.8;">
  <p style="font-size:12px;color:#1a73e8;font-weight:700;">CHROME 更新</p>
  <h1 style="font-size:26px;line-height:1.35;margin:8px 0 16px;">Chrome 152 更新与使用指南</h1>
  <p>Chrome 152 已进入桌面 Stable 渠道。随后发布的补丁包含 26 项安全修复。</p>
  <blockquote style="margin:20px 0;padding:14px 16px;border-left:3px solid #188038;background:#f4faf5;">建议桌面端用户尽快完成更新并重新启动浏览器。</blockquote>
  <h2 style="font-size:20px;margin-top:30px;">滚动触发动画</h2>
  <p>动画可以在元素进入指定滚动范围后开始执行。</p>
</section>`;

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function detectPlatform() {
  const platformName = navigator.platform.toLowerCase();
  if (platformName.includes("mac")) return "macos";
  if (platformName.includes("linux")) return "linux";
  return "windows";
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createIcon(name) {
  const icon = document.createElement("i");
  icon.dataset.lucide = name;
  return icon;
}

function safeSourceType(type) {
  return Object.hasOwn(sourceTypeMeta, type) ? type : "custom";
}

function safeSourceStatus(status) {
  return Object.hasOwn(sourceStatusMeta, status) ? status : "unverified";
}

function safeUrl(rawUrl, allowHttp) {
  try {
    const parsed = new URL(rawUrl, window.location.href);
    if (parsed.protocol === "https:") return parsed.href;
    if (allowHttp && parsed.protocol === "http:") return parsed.href;
  } catch {
    return null;
  }
  return null;
}

function createSourceLink(source, allowHttp, primary = false) {
  const href = safeUrl(source.url, allowHttp);
  const link = createElement("a", primary ? "button button-primary download-link" : "");
  link.append(document.createTextNode(source.actionLabel || "打开下载地址"), createIcon(primary ? "external-link" : "arrow-up-right"));

  if (!href) {
    link.classList.add("is-disabled");
    link.setAttribute("aria-disabled", "true");
    link.title = "配置中的 URL 无效或协议不受支持";
    return link;
  }

  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer noopener";
  return link;
}

function createPrimarySource(source, allowHttp) {
  const card = createElement("article", "download-primary-card");
  const head = createElement("div", "download-card-head");
  const iconWrap = createElement("div", "channel-icon official");
  iconWrap.append(createIcon("badge-check"));

  const titleWrap = document.createElement("div");
  titleWrap.append(
    createElement("span", "", `${source.provider || "Google"} 官方渠道`),
    createElement("h3", "", source.name || "Chrome 官方下载")
  );

  const badge = createElement("em", "source-badge official", "推荐");
  head.append(iconWrap, titleWrap, badge);
  card.append(head, createElement("p", "", source.description || ""));

  const details = createElement("dl", "download-details");
  (Array.isArray(source.details) ? source.details : []).forEach((detail) => {
    const row = document.createElement("div");
    row.append(createElement("dt", "", detail.label || ""), createElement("dd", "", detail.value || "-"));
    details.append(row);
  });
  card.append(details, createSourceLink(source, allowHttp, true));
  return card;
}

function createAlternativeSource(source, allowHttp) {
  const type = safeSourceType(source.type);
  const status = safeSourceStatus(source.status);
  const typeMeta = sourceTypeMeta[type];
  const statusMeta = sourceStatusMeta[status];
  const card = createElement("article", `download-route ${type}-route status-${status}`);
  const topline = createElement("div", "route-topline");
  const kind = createElement("span", `route-kind ${type}`);
  kind.append(createIcon(typeMeta.icon), document.createTextNode(typeMeta.label));
  topline.append(kind, createElement("em", "", source.provider || "自定义来源"));

  const metadata = createElement("div", "source-metadata");
  const statusItem = createElement("span", `source-state ${status}`);
  statusItem.append(createIcon(statusMeta.icon), document.createTextNode(statusMeta.label));
  metadata.append(statusItem);

  if (source.checkedAt) {
    const checked = document.createElement("span");
    checked.append(createIcon("clock-3"), document.createTextNode(`${source.checkedAt} 检查`));
    metadata.append(checked);
  }

  if (Array.isArray(source.formats) && source.formats.length) {
    const formats = document.createElement("span");
    formats.append(createIcon("package-check"), document.createTextNode(source.formats.join(" · ")));
    metadata.append(formats);
  }

  card.append(
    topline,
    createElement("h3", "", source.name || "备用下载地址"),
    createElement("p", "", source.description || ""),
    metadata,
    createSourceLink(source, allowHttp)
  );
  return card;
}

function createDownloadPanel(platform, platformConfig, allowHttp) {
  const panel = createElement("div", "download-panel");
  panel.dataset.platformPanel = platform;

  const primary = platformConfig?.primary;
  if (primary?.enabled !== false) {
    panel.append(createPrimarySource(primary || {}, allowHttp));
  }

  const alternatives = createElement("div", "download-alternatives");
  const enabledAlternatives = Array.isArray(platformConfig?.alternatives)
    ? platformConfig.alternatives.filter((source) => source?.enabled !== false)
    : [];
  enabledAlternatives.forEach((source) => alternatives.append(createAlternativeSource(source, allowHttp)));

  if (!enabledAlternatives.length) {
    alternatives.append(createElement("div", "download-empty", "当前平台没有启用备用下载源。"));
  }

  panel.append(alternatives);
  return panel;
}

function formatConfigTime(value) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "来源配置已载入";
  return `${new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short" }).format(parsed)} 已更新`;
}

async function loadDownloadSources() {
  try {
    const response = await fetch("config/download-sources.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const config = await response.json();
    if (!config.platforms || typeof config.platforms !== "object") throw new Error("缺少 platforms 配置");

    downloadPanels.replaceChildren();
    ["windows", "macos", "linux"].forEach((platform) => {
      downloadPanels.append(createDownloadPanel(platform, config.platforms[platform], config.allowHttp === true));
    });
    downloadCheckedAt.textContent = formatConfigTime(config.updatedAt);
    selectPlatform(selectedPlatform);
    refreshIcons();
  } catch (error) {
    const errorBox = createElement("div", "download-config-error");
    errorBox.append(
      createIcon("triangle-alert"),
      createElement("strong", "", "下载源配置读取失败"),
      createElement("span", "", "请检查 config/download-sources.json 的路径与 JSON 格式。")
    );
    downloadPanels.replaceChildren(errorBox);
    downloadCheckedAt.textContent = "来源配置不可用";
    console.error("Failed to load download sources:", error);
    refreshIcons();
  }
}

function showView(name, anchor) {
  if (!views[name]) return;

  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle("is-active", key === name);
  });

  document.querySelectorAll(".nav-link[data-nav]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.nav === name);
  });

  closeDialog(searchDialog);
  closeDialog(exportDialog);
  const hashes = { home: "#latest", article: "#article", download: "#download" };
  window.history.replaceState({}, "", hashes[name]);

  requestAnimationFrame(() => {
    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

function openDialog(dialog) {
  dialog.classList.add("is-open");
  dialog.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDialog(dialog) {
  dialog.classList.remove("is-open");
  dialog.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".dialog-backdrop.is-open")) {
    document.body.style.overflow = "";
  }
}

function showToast(message) {
  toast.querySelector("span").textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast(successMessage);
  }
}

async function copyExport() {
  if (exportMode === "markdown") {
    await copyText(markdownSample, "Markdown 已复制");
    return;
  }

  if (exportMode === "html") {
    await copyText(wechatHtml, "HTML 已复制");
    return;
  }

  try {
    if (window.ClipboardItem && navigator.clipboard.write) {
      const item = new ClipboardItem({
        "text/html": new Blob([wechatHtml], { type: "text/html" }),
        "text/plain": new Blob([markdownSample], { type: "text/plain" }),
      });
      await navigator.clipboard.write([item]);
      showToast("微信公众号样式已复制");
    } else {
      await copyText(wechatHtml, "微信公众号 HTML 已复制");
    }
  } catch {
    await copyText(wechatHtml, "微信公众号 HTML 已复制");
  }
}

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    event.preventDefault();
    showView(navButton.dataset.nav, navButton.dataset.anchor);
    return;
  }

  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "search") {
    openDialog(searchDialog);
    window.setTimeout(() => searchInput.focus(), 80);
  } else if (action === "close-search") {
    closeDialog(searchDialog);
  } else if (action === "export") {
    openDialog(exportDialog);
  } else if (action === "close-export") {
    closeDialog(exportDialog);
  } else if (action === "theme") {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    actionButton.innerHTML = dark ? '<i data-lucide="moon"></i>' : '<i data-lucide="sun"></i>';
    refreshIcons();
  } else if (action === "copy-markdown") {
    copyText(markdownSample, "Markdown 已复制");
  } else if (action === "copy-code") {
    copyText(".notice {\n  animation: reveal 450ms ease both;\n  animation-trigger: view();\n}", "代码已复制");
  } else if (action === "copy-export") {
    copyExport();
  } else if (action === "font") {
    readingSizeIndex = (readingSizeIndex + 1) % readingSizes.length;
    document.documentElement.style.setProperty("--reading-size", readingSizes[readingSizeIndex]);
    showToast(`正文字号 ${readingSizes[readingSizeIndex]}`);
  } else if (action === "details") {
    showToast("检测记录面板将在正式站点中接入");
  } else if (action === "asset-info") {
    showToast("图片将归档到独立 GitHub 资源仓库");
  }
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".release-row").forEach((row) => {
      row.hidden = filter !== "all" && !row.dataset.category?.split(" ").includes(filter);
    });
  });
});

function selectPlatform(platform) {
  selectedPlatform = platform;
  document.querySelectorAll(".platform-button").forEach((button) => {
    const active = button.dataset.platform === platform;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });

  document.querySelectorAll("[data-platform-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.platformPanel === platform);
  });
}

document.querySelectorAll(".platform-button").forEach((button) => {
  button.addEventListener("click", () => selectPlatform(button.dataset.platform));
});

document.querySelectorAll(".export-option").forEach((button) => {
  button.addEventListener("click", () => {
    exportMode = button.dataset.exportMode;
    document.querySelectorAll(".export-option").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    const labels = {
      wechat: "已选择：微信公众号 HTML",
      markdown: "已选择：原始 Markdown",
      html: "已选择：通用 HTML",
    };
    exportStatus.textContent = labels[exportMode];
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  document.querySelectorAll("[data-search-item]").forEach((item) => {
    item.hidden = query && !item.dataset.searchItem.includes(query);
  });
});

document.querySelectorAll(".dialog-backdrop").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDialog(searchDialog);
    closeDialog(exportDialog);
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openDialog(searchDialog);
    window.setTimeout(() => searchInput.focus(), 80);
  }
});

selectPlatform(selectedPlatform);
loadDownloadSources();

if (window.location.hash === "#article") {
  showView("article");
} else if (window.location.hash === "#download") {
  showView("download");
}

refreshIcons();
