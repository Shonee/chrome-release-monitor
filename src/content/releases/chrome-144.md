---
title: Chrome 144 更新与使用指南
milestone: 144
version: "144.0.7559.59/60"
channel: Stable
publishedAt: 2026-09-03T13:10:00+08:00
updatedAt: 2026-09-03T13:10:00+08:00
stableReleasedAt: 2026-01-13T00:00:00-08:00
versionReleasedAt: 2026-01-13T00:00:00-08:00
status: published
summary: Chrome 144 引入可定制的网页内查找高亮、声明式地理位置元素和 JavaScript Temporal API。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - Temporal
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: 自定义网页内查找高亮
    description: ::search-text 允许页面改善浏览器查找结果的颜色和文字装饰。
    audience: developer
  - title: 声明式地理位置入口
    description: geolocation 元素通过明确的用户点击承接权限请求和位置数据交付。
    audience: user
  - title: Temporal API
    description: JavaScript 获得更现代、清晰的日期与时间处理能力。
    audience: developer
securityFixes: 10
sources:
  - label: New in Chrome 144
    url: https://developer.chrome.com/blog/new-in-chrome-144/
  - label: Chrome 144 Release Notes
    url: https://developer.chrome.com/release-notes/144/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/01/stable-channel-update-for-desktop_13.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-144/image/thumb.png?hl=zh-cn
    alt: Chrome 144 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-144/
    mirror: true
---

> Chrome 144 于 2026 年 1 月 13 日进入桌面稳定版渠道。以下内容根据 Chrome 官方开发者资料整理。

## 本次更新概览

Windows 版本为 `144.0.7559.59/60`，macOS 与 Linux 为 `144.0.7559.59`。官方初始稳定版公告列出 10 项安全修复。

## 核心功能与使用方法

### 使用 ::search-text 改善查找高亮

开发者可以使用 `::search-text` 和 `::search-text:current` 调整网页内查找结果的前景色、背景色和文字装饰。使用时应确保高亮颜色在浅色、深色主题下都保持足够对比度。

### 使用 geolocation 元素承接权限请求

`<geolocation>` 是由用户主动点击的声明式控件。它将用户意图、浏览器权限提示和位置数据交付放在同一流程中，适合“附近门店”“使用当前位置”等明确操作入口。部署前仍应准备传统 Geolocation API 回退方案。

### 使用 Temporal 处理日期时间

Temporal 提供现代日期、时间、时区和持续时间对象。迁移时应优先封装业务时间边界，并通过特性检测决定使用原生实现还是 polyfill，避免直接依赖旧 `Date` 的隐式时区行为。

## 普通用户与企业管理员

普通用户应完成浏览器重启以应用安全修复。企业管理员应先验证依赖日期计算、定位权限和页面内搜索样式的业务系统，再按组织单元分阶段升级。

## 如何更新 Chrome

打开 Chrome 菜单，进入“帮助” → “关于 Google Chrome”，等待更新完成后重新启动，并确认完整版本号。

## 来源

- [New in Chrome 144](https://developer.chrome.com/blog/new-in-chrome-144/)
- [Chrome 144 Release Notes](https://developer.chrome.com/release-notes/144/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/01/stable-channel-update-for-desktop_13.html)
