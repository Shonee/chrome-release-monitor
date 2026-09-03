---
title: Chrome 146 更新与使用指南
milestone: 146
version: "146.0.7680.71/72"
channel: Stable
publishedAt: 2026-09-03T13:12:00+08:00
updatedAt: 2026-09-03T13:12:00+08:00
stableReleasedAt: 2026-03-10T00:00:00-07:00
versionReleasedAt: 2026-03-10T00:00:00-07:00
status: published
summary: Chrome 146 提供滚动触发动画、范围限定的自定义元素注册表和新版 Sanitizer API。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - Web Platform
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: 滚动触发动画
    description: 使用 CSS 根据滚动位置声明式播放、暂停或重置动画。
    audience: developer
  - title: 范围限定自定义元素
    description: 同一标签名可在不同作用域中使用不同注册定义，减少组件库冲突。
    audience: developer
  - title: Sanitizer API
    description: 浏览器提供结构化 HTML 清理能力，帮助降低不可信内容引发的 XSS 风险。
    audience: enterprise
securityFixes: 29
sources:
  - label: New in Chrome 146
    url: https://developer.chrome.com/blog/new-in-chrome-146/
  - label: Chrome 146 Release Notes
    url: https://developer.chrome.com/release-notes/146/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/03/stable-channel-update-for-desktop_10.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-146/image/thumb.png?hl=zh-cn
    alt: Chrome 146 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-146/
    mirror: true
---

> Chrome 146 于 2026 年 3 月 10 日进入桌面稳定版渠道，初始公告列出 29 项安全修复。

## 本次更新概览

Windows 版本为 `146.0.7680.71/72`，macOS 与 Linux 为 `146.0.7680.72`。本次版本把一批常见 JavaScript 交互下沉为声明式 Web 平台能力，并在组件隔离和 HTML 安全处理方面提供新工具。

## 核心功能与使用方法

### 使用 CSS 创建滚动触发动画

开发者可以根据滚动位置控制动画开始、暂停和重置。实施时应尊重 `prefers-reduced-motion`，并避免让动画承担唯一的信息表达职责。

### 隔离自定义元素注册表

范围限定注册表允许不同组件树为同一标签名绑定不同实现。它适合大型应用加载多个组件库的场景，但仍需要规划组件生命周期和服务端渲染行为。

### 使用 Sanitizer API 清理 HTML

Sanitizer API 用于移除可能执行脚本的 HTML 内容。处理用户输入时应采用允许列表策略，并继续配合 CSP、输出编码和服务端校验，而不是把单一 API 当作完整安全边界。

## 普通用户与企业管理员

企业环境应回归富文本编辑器、组件库、滚动动画页面和内容管理系统。普通用户完成更新后，需要重新启动浏览器才能完整应用修复。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成下载和重启后确认版本为 Chrome 146。

## 来源

- [New in Chrome 146](https://developer.chrome.com/blog/new-in-chrome-146/)
- [Chrome 146 Release Notes](https://developer.chrome.com/release-notes/146/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/03/stable-channel-update-for-desktop_10.html)
