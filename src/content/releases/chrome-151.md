---
title: Chrome 151 更新与使用指南
milestone: 151
version: "151.0.7922.71/72"
channel: Stable
publishedAt: 2026-09-03T13:17:00+08:00
updatedAt: 2026-09-03T13:17:00+08:00
stableReleasedAt: 2026-07-29T00:00:00-07:00
versionReleasedAt: 2026-07-29T00:00:00-07:00
status: published
summary: Chrome 151 增加 usermedia 能力元素、声明式手动插槽分配和 SPA 软导航性能指标。
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
  - title: usermedia 能力元素
    description: 浏览器通过明确的用户操作处理摄像头、麦克风权限并交付 MediaStream。
    audience: user
  - title: 声明式手动插槽分配
    description: Declarative Shadow DOM 可以直接声明 manual slot assignment。
    audience: developer
  - title: SPA 软导航性能指标
    description: 新 PerformanceEntry 类型帮助按单页应用路由归因交互和渲染性能。
    audience: developer
securityFixes: 371
sources:
  - label: New in Chrome 151
    url: https://developer.chrome.com/blog/new-in-chrome-151/
  - label: Chrome 151 Release Notes
    url: https://developer.chrome.com/release-notes/151/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/07/stable-channel-update-for-desktop_0887107924.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-151/image/thumb.png
    alt: Chrome 151 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-151/
    mirror: true
---

> Chrome 151 于 2026 年 7 月 29 日进入桌面稳定版渠道，初始公告列出 371 项安全修复。

## 本次更新概览

Windows 版本为 `151.0.7922.71/72`，macOS 与 Linux 为 `151.0.7922.72`。本次更新聚焦媒体权限、Web Components 和单页应用性能观测。

## 核心功能与使用方法

### 使用 usermedia 能力元素

`<usermedia>` 通过浏览器控制的界面捕获用户意图、显示摄像头或麦克风权限提示，并向应用交付 `MediaStream`。接入时需要提供清晰用途说明，并保留 `getUserMedia()` 回退路径。

### 声明手动插槽分配

Declarative Shadow DOM 的 `<template>` 支持 `shadowrootslotassignment="manual"`。服务端可以直接输出手动插槽分配模式，但客户端仍需调用组件逻辑完成具体节点分配。

### 观测 SPA 软导航性能

`soft-navigation` 与 `interaction-contentful-paint` PerformanceEntry 可把同文档路由切换后的性能数据归因到当前 SPA 页面。团队应按路由记录交互和内容渲染指标，而不是只观察首次加载。

## 普通用户与企业管理员

摄像头和麦克风授权流程会更明确。企业管理员应验证视频会议、录音、虚拟设备和浏览器权限策略；前端团队应同步更新性能采集 SDK。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成更新后重新启动并确认完整版本号。

## 来源

- [New in Chrome 151](https://developer.chrome.com/blog/new-in-chrome-151/)
- [Chrome 151 Release Notes](https://developer.chrome.com/release-notes/151/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/07/stable-channel-update-for-desktop_0887107924.html)
