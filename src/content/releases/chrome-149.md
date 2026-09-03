---
title: Chrome 149 更新与使用指南
milestone: 149
version: "149.0.7827.53/54"
channel: Stable
publishedAt: 2026-09-03T13:15:00+08:00
updatedAt: 2026-09-03T13:15:00+08:00
stableReleasedAt: 2026-06-02T00:00:00-07:00
versionReleasedAt: 2026-06-02T00:00:00-07:00
status: published
summary: Chrome 149 增加 CSS 间距装饰，改善含 WebSocket 页面的往返缓存，并补齐 Locale variants。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - Performance
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: CSS 间距装饰
    description: Grid 和 Flexbox 的间距可以直接设置规则线、颜色、宽度和显示范围。
    audience: developer
  - title: WebSocket 页面可进入 bfcache
    description: 页面进入往返缓存时主动断开 WebSocket，从而提升前进后退恢复速度。
    audience: user
  - title: Locale variants
    description: Intl.Locale.prototype.variants 提供语言区域标识中的变体信息。
    audience: developer
securityFixes: 429
sources:
  - label: New in Chrome 149
    url: https://developer.chrome.com/blog/new-in-chrome-149/
  - label: Chrome 149 Release Notes
    url: https://developer.chrome.com/release-notes/149/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-149/image/thumb.png?hl=zh-cn
    alt: Chrome 149 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-149/
    mirror: true
---

> Chrome 149 于 2026 年 6 月 2 日进入桌面稳定版渠道，初始公告列出 429 项安全修复。

## 本次更新概览

Windows 版本为 `149.0.7827.53/54`，macOS 与 Linux 为 `149.0.7827.54`。本次更新集中在 CSS 表现力、历史导航性能和国际化信息读取。

## 核心功能与使用方法

### 使用 CSS 间距装饰

开发者可以为 Grid、Flexbox 等容器的间距设置规则线，并控制宽度、颜色、插入范围和可见性。该能力适合表格化布局和分组列表，旧浏览器会保留间距而忽略装饰。

### 处理 bfcache 中的 WebSocket

活跃 WebSocket 不再直接阻止页面进入 bfcache，Chrome 会在页面进入缓存时断开连接。应用应监听 `pageshow`、`pagehide` 和连接状态，在恢复页面时安全重连并避免重复订阅。

### 读取 Locale variants

`Intl.Locale.prototype.variants` 可读取语言区域标识中的语言变体。国际化路由和内容选择仍应准备默认语言，避免把变体作为唯一匹配条件。

## 普通用户与企业管理员

使用前进、后退导航时，支持 bfcache 的页面恢复会更快。企业应用需要重点验证实时消息、行情、客服和协同编辑场景的断线重连。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成更新并重新启动浏览器。

## 来源

- [New in Chrome 149](https://developer.chrome.com/blog/new-in-chrome-149/)
- [Chrome 149 Release Notes](https://developer.chrome.com/release-notes/149/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop.html)
