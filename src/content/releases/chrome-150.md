---
title: Chrome 150 更新与使用指南
milestone: 150
version: "150.0.7871.46/47"
channel: Stable
publishedAt: 2026-09-03T13:16:00+08:00
updatedAt: 2026-09-03T13:16:00+08:00
stableReleasedAt: 2026-06-30T00:00:00-07:00
versionReleasedAt: 2026-06-30T00:00:00-07:00
status: published
summary: Chrome 150 引入 CSS text-fit、声明式 Focusgroup 和 background-clip:border-area。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - Accessibility
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: CSS text-fit
    description: 文本字号可以自动适配容器宽度，减少依赖 JavaScript 的排版计算。
    audience: developer
  - title: Focusgroup
    description: 复合控件可声明箭头键导航、Tab 停靠和上次焦点记忆。
    audience: user
  - title: border-area 背景裁剪
    description: 背景可以裁剪到边框绘制区域，简化渐变边框实现。
    audience: developer
securityFixes: 433
sources:
  - label: New in Chrome 150
    url: https://developer.chrome.com/blog/new-in-chrome-150/
  - label: Chrome 150 Release Notes
    url: https://developer.chrome.com/release-notes/150/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop_0175352312.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-150/image/thumb.png?hl=zh-cn
    alt: Chrome 150 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-150/
    mirror: true
---

> Chrome 150 于 2026 年 6 月 30 日进入桌面稳定版渠道，初始公告列出 433 项安全修复。

## 本次更新概览

Windows 版本为 `150.0.7871.46/47`，macOS 与 Linux 为 `150.0.7871.47`。本次版本重点改善自适应排版、键盘操作和渐变边框。

## 核心功能与使用方法

### 使用 CSS text-fit

`text-fit` 会缩放文本节点字号，使内容适应容器宽度。它适合数字看板和短标题，不应替代正常的响应式布局；长文本仍需设置合理的换行和最小字号策略。

### 使用 Focusgroup 构建键盘友好控件

`focusgroup` 可以声明复合控件的方向键导航、Tab 停靠和焦点记忆。适合工具栏、菜单和选项组，但仍需补齐语义角色、可见焦点和屏幕阅读器测试。

### 创建渐变边框

`background-clip: border-area` 将背景裁剪到边框描边区域，可减少 `border-image` 或伪元素方案。使用透明边框时应检查高对比度模式和打印样式。

## 普通用户与企业管理员

键盘用户会从更一致的复合控件导航中受益。企业管理员应回归内部组件库、快捷键和自动化测试定位规则。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成更新后重新启动浏览器。

## 来源

- [New in Chrome 150](https://developer.chrome.com/blog/new-in-chrome-150/)
- [Chrome 150 Release Notes](https://developer.chrome.com/release-notes/150/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop_0175352312.html)
