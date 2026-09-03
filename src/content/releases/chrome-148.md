---
title: Chrome 148 更新与使用指南
milestone: 148
version: "148.0.7778.96/97"
channel: Stable
publishedAt: 2026-09-03T13:14:00+08:00
updatedAt: 2026-09-03T13:14:00+08:00
stableReleasedAt: 2026-05-05T00:00:00-07:00
versionReleasedAt: 2026-05-05T00:00:00-07:00
status: published
summary: Chrome 148 支持仅按名称查询容器、音视频延迟加载，以及面向设备端模型的 Prompt API。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - AI
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: 仅按名称查询容器
    description: "@container 可以只依据 container-name 定位容器，不再强制要求 container-type。"
    audience: developer
  - title: 音视频延迟加载
    description: video 和 audio 支持 loading="lazy"，可推迟视口外媒体资源加载。
    audience: user
  - title: Prompt API
    description: Web 应用可访问浏览器提供的设备端语言模型，并约束结构化输出。
    audience: developer
securityFixes: 126
sources:
  - label: New in Chrome 148
    url: https://developer.chrome.com/blog/new-in-chrome-148/
  - label: Chrome 148 Release Notes
    url: https://developer.chrome.com/release-notes/148/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/05/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-148/image/thumb.png?hl=zh-cn
    alt: Chrome 148 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-148/
    mirror: true
---

> Chrome 148 于 2026 年 5 月 5 日进入桌面稳定版渠道，初始公告列出 126 项安全修复。

## 本次更新概览

Windows 版本为 `148.0.7778.96/97`，macOS 与 Linux 为 `148.0.7778.97`。本次更新同时改善响应式布局、媒体加载和设备端 AI 接口。

## 核心功能与使用方法

### 仅按 container-name 查询容器

命名容器现在可以不设置 `container-type` 就被 `@container` 查询。适合只需要根据组件身份切换样式的场景，也能减少无必要的尺寸包含设置。

### 延迟加载 video 和 audio

为 `<video>` 或 `<audio>` 设置 `loading="lazy"`，浏览器会推迟加载距离视口较远的媒体。关键首屏媒体不应延迟加载，并应继续配置封面、尺寸和加载状态。

### 评估 Prompt API

Prompt API 可将文本、图片或音频发送给浏览器提供的设备端模型，并通过正则表达式或 JSON Schema 约束输出。使用前必须做可用性检测，并准备服务器模型或传统逻辑作为回退。

## 普通用户与企业管理员

媒体密集页面可能减少初始流量和加载压力。企业环境启用设备端 AI 前，应评估模型可用性、数据边界、硬件要求和组织策略。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成更新后重新启动浏览器。

## 来源

- [New in Chrome 148](https://developer.chrome.com/blog/new-in-chrome-148/)
- [Chrome 148 Release Notes](https://developer.chrome.com/release-notes/148/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/05/stable-channel-update-for-desktop.html)
