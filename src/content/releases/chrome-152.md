---
title: Chrome 152 更新与使用指南
milestone: 152
version: "152.0.7977.75/76"
channel: Stable
publishedAt: 2026-09-03T12:00:00+08:00
updatedAt: 2026-09-03T13:18:00+08:00
stableReleasedAt: 2026-08-25T00:00:00-07:00
versionReleasedAt: 2026-09-01T00:00:00-07:00
status: published
summary: Chrome 152 扩展 CSSPseudoElement 支持，引入 CPU Performance API，并通过 Connection Allowlists 限制页面网络连接。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - Security
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: 更多伪元素可由 JavaScript 访问
    description: CSSPseudoElement 扩展到 backdrop、scroll-marker 和 view-transition 等伪元素。
    audience: developer
  - title: CPU Performance API
    description: Web 应用可以依据设备 CPU 性能等级调整图形质量、计算任务和后台工作。
    audience: developer
  - title: Connection Allowlists
    description: 站点可通过响应头明确限制文档和 Worker 允许连接的外部端点。
    audience: enterprise
securityFixes: 26
sources:
  - label: New in Chrome 152
    url: https://developer.chrome.com/blog/new-in-chrome-152/
  - label: Chrome 152 Release Notes
    url: https://developer.chrome.com/release-notes/152/
  - label: Chrome 152 Stable Release
    url: https://chromereleases.googleblog.com/2026/08/stable-channel-update-for-desktop_0256176589.html
  - label: Chrome 152 Current Version Update
    url: https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-152/image/thumb.png
    alt: Chrome 152 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-152/
    mirror: true
---

> Chrome 152 于 2026 年 8 月 25 日进入桌面稳定版渠道。当前记录的 `152.0.7977.75/76` 更新发布于 2026 年 9 月 1 日，并包含 26 项公告列出的安全修复。

## 本次更新概览

Chrome 152 的初始稳定版为 Windows `152.0.7977.53/54`、macOS 与 Linux `152.0.7977.54`。本文跟踪的当前桌面版本为 Windows 与 macOS `152.0.7977.75/76`、Linux `152.0.7977.75`。

## 核心功能与使用方法

### 从 JavaScript 访问更多 CSS 伪元素

CSSPseudoElement 支持范围扩展到 `::backdrop`、`::scroll-marker` 和视图过渡伪元素。开发者可以在 JavaScript 中更精确地关联动画和交互，但仍应通过特性检测处理旧浏览器。

### 根据 CPU 性能调整体验

CPU Performance API 提供设备 CPU 性能等级，应用可以据此降低图形质量、拆分高成本计算或调整后台任务。该等级不应被用于设备指纹或用户身份判断，并应与实时 Compute Pressure 信息区分。

### 配置 Connection Allowlists

Connection Allowlists 允许站点通过 `Connection-Allowlist` HTTP 响应头定义文档和 Worker 可以访问的 URL 模式。上线前应先盘点接口、遥测、CDN 和第三方服务，避免遗漏必要端点造成业务请求失败。

## 普通用户与企业管理员

普通用户应优先完成 9 月 1 日的补丁更新并重新启动浏览器。企业管理员需要验证网络访问白名单、代理、监控脚本以及依赖硬件能力分级的应用。

## 如何更新 Chrome

打开 Chrome 菜单，进入“帮助” → “关于 Google Chrome”，等待安装完成后重新启动，并确认 Windows/macOS 为 `152.0.7977.75/76` 或 Linux 为 `152.0.7977.75`。

## 来源

- [New in Chrome 152](https://developer.chrome.com/blog/new-in-chrome-152/)
- [Chrome 152 Release Notes](https://developer.chrome.com/release-notes/152/)
- [Chrome 152 Stable Release](https://chromereleases.googleblog.com/2026/08/stable-channel-update-for-desktop_0256176589.html)
- [Chrome 152 Current Version Update](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop.html)
