---
title: Chrome 145 更新与使用指南
milestone: 145
version: "145.0.7632.45/46"
channel: Stable
publishedAt: 2026-09-03T13:11:00+08:00
updatedAt: 2026-09-03T13:11:00+08:00
stableReleasedAt: 2026-02-10T00:00:00-08:00
versionReleasedAt: 2026-02-10T00:00:00-08:00
status: published
summary: Chrome 145 带来多列布局换行、Origin API 和设备绑定会话凭证等能力。
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
  - title: 多列布局支持换行
    description: column-wrap 和 column-height 可减少受限高度多列布局产生的横向溢出。
    audience: developer
  - title: Origin API
    description: Origin 对象提供来源解析、比较和序列化能力。
    audience: developer
  - title: 设备绑定会话凭证
    description: DBSC 将登录会话与设备密钥绑定，降低被盗 Cookie 在其他设备重放的风险。
    audience: enterprise
securityFixes: 11
sources:
  - label: New in Chrome 145
    url: https://developer.chrome.com/blog/new-in-chrome-145/
  - label: Chrome 145 Release Notes
    url: https://developer.chrome.com/release-notes/145/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/02/stable-channel-update-for-desktop_10.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-145/image/thumb.png?hl=zh-cn
    alt: Chrome 145 官方版本功能封面
    officialSource: https://developer.chrome.com/blog/new-in-chrome-145/
    mirror: true
---

> Chrome 145 于 2026 年 2 月 10 日进入桌面稳定版渠道，初始公告列出 11 项安全修复。

## 本次更新概览

Windows 与 macOS 版本为 `145.0.7632.45/46`，Linux 为 `145.0.7632.45`。本次更新同时涉及布局、来源建模和登录会话安全。

## 核心功能与使用方法

### 控制多列布局的换行

`column-wrap` 与 `column-height` 可以把多列内容换到块方向的新行，减少固定高度容器在水平方向产生溢出列。使用时应同时检查容器高度、列宽和小屏断点。

### 使用 Origin API

Origin API 通过标准对象封装来源概念，适合执行来源解析、比较和序列化。涉及安全边界时仍应使用完整来源对象，不要退化为简单字符串前缀判断。

### 评估设备绑定会话凭证

DBSC 使用短期 Cookie 和设备支持的密钥对刷新会话。身份系统团队可以先在测试环境验证登录续期、设备迁移和异常恢复，再决定是否面向生产用户启用。

## 普通用户与企业管理员

普通用户只需正常更新并重启。企业管理员需要重点验证单点登录、代理环境、终端密钥能力和长会话业务，避免升级后出现重复登录。

## 如何更新 Chrome

进入“帮助” → “关于 Google Chrome”，完成下载和重启后确认完整版本号。

## 来源

- [New in Chrome 145](https://developer.chrome.com/blog/new-in-chrome-145/)
- [Chrome 145 Release Notes](https://developer.chrome.com/release-notes/145/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/02/stable-channel-update-for-desktop_10.html)
