---
title: Chrome 147 更新与使用指南
milestone: 147
version: "147.0.7727.55/56"
channel: Stable
publishedAt: 2026-09-03T13:13:00+08:00
updatedAt: 2026-09-03T13:13:00+08:00
stableReleasedAt: 2026-04-07T00:00:00-07:00
versionReleasedAt: 2026-04-07T00:00:00-07:00
status: published
summary: Chrome 147 带来元素范围视图过渡、CSS contrast-color() 和 border-shape。
platforms:
  - Windows
  - macOS
  - Linux
tags:
  - Chrome
  - Stable
  - CSS
audience:
  - user
  - developer
  - enterprise
highlights:
  - title: 元素范围视图过渡
    description: 单个元素可以启动局部视图过渡，并允许多个过渡并行运行。
    audience: developer
  - title: 自动选择对比色
    description: contrast-color() 根据背景色返回对比更高的黑色或白色。
    audience: developer
  - title: 非矩形边框
    description: border-shape 可使用多边形、圆形和 shape() 定义边框形状。
    audience: developer
sources:
  - label: New in Chrome 147
    url: https://developer.chrome.com/blog/new-in-chrome-147/
  - label: Chrome 147 Release Notes
    url: https://developer.chrome.com/release-notes/147/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/04/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-147/image/thumb.png?hl=zh-cn
    alt: Chrome 147 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-147/
    mirror: true
---

> Chrome 147 于 2026 年 4 月 7 日进入桌面稳定版渠道。

## 本次更新概览

Windows 版本为 `147.0.7727.55/56`，macOS 与 Linux 为 `147.0.7727.56`。本次更新重点增强局部页面过渡和 CSS 图形表现力。

## 核心功能与使用方法

### 创建元素范围视图过渡

通过 `element.startViewTransition()` 可以仅为目标元素建立过渡范围。局部过渡会受到祖先裁剪和变换影响，页面其他区域仍可保持互动，适合列表重排和局部状态切换。

### 使用 contrast-color() 保持对比度

`contrast-color()` 接收一个颜色值，并返回对比更高的黑色或白色。它适合动态主题和用户自定义颜色，但发布前仍应使用无障碍工具验证实际组件对比度。

### 使用 border-shape 创建异形边框

`border-shape` 可以定义多边形、圆形或 `shape()` 边框。与 `clip-path` 不同，它面向边框绘制和内部裁剪，适合标签、徽章和视觉化控件。

## 普通用户与企业管理员

普通用户主要获得更丰富的页面过渡和视觉效果。企业管理员应回归依赖复杂 CSS、截图识别或自动化定位的内部系统。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，等待更新完成后重新启动浏览器。

## 来源

- [New in Chrome 147](https://developer.chrome.com/blog/new-in-chrome-147/)
- [Chrome 147 Release Notes](https://developer.chrome.com/release-notes/147/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/04/stable-channel-update-for-desktop.html)
