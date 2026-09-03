---
title: Chrome 151 Release and Usage Guide
locale: en
milestone: 151
version: "151.0.7922.71/72"
channel: Stable
publishedAt: 2026-09-03T13:17:00+08:00
updatedAt: 2026-09-03T13:17:00+08:00
stableReleasedAt: 2026-07-29T00:00:00-07:00
versionReleasedAt: 2026-07-29T00:00:00-07:00
status: published
summary: Chrome 151 adds a usermedia capability element, declarative manual slot assignment, and SPA soft-navigation performance entries.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Performance]
audience: [user, developer, enterprise]
highlights:
  - title: usermedia capability element
    description: The browser handles camera and microphone permission through an explicit user action and delivers a MediaStream.
    audience: user
  - title: Declarative manual slot assignment
    description: Declarative Shadow DOM can specify manual slot assignment directly in markup.
    audience: developer
  - title: SPA soft-navigation metrics
    description: New PerformanceEntry types attribute interaction and rendering performance to client-side routes.
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
    alt: Official Chrome 151 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-151/
    mirror: true
---

> Chrome 151 entered the desktop Stable channel on July 29, 2026. The initial announcement lists 371 security fixes.

## Release overview

Windows uses `151.0.7922.71/72`; macOS and Linux use `151.0.7922.72`. The release focuses on media permissions, Web Components, and performance attribution for single-page applications.

## Key features and how to use them

### Request media through a capability element

`<usermedia>` captures an explicit user action, displays browser-controlled camera or microphone permission UI, and delivers a `MediaStream`. Explain the purpose clearly and retain a `getUserMedia()` fallback.

### Declare manual slot assignment

Declarative Shadow DOM templates can use `shadowrootslotassignment="manual"`. Servers can emit the mode directly, while client-side component logic still performs the actual node assignment.

### Measure SPA soft navigations

`soft-navigation` and `interaction-contentful-paint` entries let analytics systems attribute interactions and rendering work to same-document route changes. Record metrics by route rather than only measuring the initial page load.

## Guidance for users and administrators

Camera and microphone permission flows become more explicit. Organizations should test conferencing, recording, virtual devices, browser policy, and performance collection libraries.

## How to update Chrome

Open **Help → About Google Chrome**, finish the update, restart, and confirm the full version number.

## Sources

- [New in Chrome 151](https://developer.chrome.com/blog/new-in-chrome-151/)
- [Chrome 151 Release Notes](https://developer.chrome.com/release-notes/151/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/07/stable-channel-update-for-desktop_0887107924.html)
