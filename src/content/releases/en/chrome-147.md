---
title: Chrome 147 Release and Usage Guide
locale: en
milestone: 147
version: "147.0.7727.55/56"
channel: Stable
publishedAt: 2026-09-03T13:13:00+08:00
updatedAt: 2026-09-03T13:13:00+08:00
stableReleasedAt: 2026-04-07T00:00:00-07:00
versionReleasedAt: 2026-04-07T00:00:00-07:00
status: published
summary: Chrome 147 adds scoped view transitions, CSS contrast-color(), and border-shape.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, CSS]
audience: [user, developer, enterprise]
highlights:
  - title: Scoped view transitions
    description: Individual elements can start local view transitions while multiple transitions run in parallel.
    audience: developer
  - title: Automatic contrast colors
    description: contrast-color() selects black or white according to the supplied background color.
    audience: developer
  - title: Non-rectangular borders
    description: border-shape defines polygon, circle, and shape-based border geometry.
    audience: developer
sources:
  - label: New in Chrome 147
    url: https://developer.chrome.com/blog/new-in-chrome-147/
  - label: Chrome 147 Release Notes
    url: https://developer.chrome.com/release-notes/147/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/04/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-147/image/thumb.png?hl=en
    alt: Official Chrome 147 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-147/
    mirror: true
---

> Chrome 147 entered the desktop Stable channel on April 7, 2026.

## Release overview

Windows uses `147.0.7727.55/56`; macOS and Linux use `147.0.7727.56`. The release focuses on localized page transitions and more expressive CSS geometry and color handling.

## Key features and how to use them

### Create element-scoped view transitions

`element.startViewTransition()` starts a transition within one element. The transition remains affected by ancestor clipping and transforms while the rest of the page can stay interactive, which suits list reordering and local state changes.

### Maintain contrast with contrast-color()

`contrast-color()` accepts a color and returns black or white with stronger contrast. It helps with dynamic themes and user-defined colors, but production components still need accessibility testing.

### Draw shaped borders

`border-shape` can define polygon, circle, or `shape()` geometry. Unlike `clip-path`, it is designed around border painting and inner clipping, making it useful for labels, badges, and visual controls.

## Guidance for users and administrators

Users may see richer transitions and visual treatments. Enterprise teams should regression-test applications that depend on complex CSS, screenshot comparison, or automated element positioning.

## How to update Chrome

Open **Help → About Google Chrome**, wait for installation to complete, and restart the browser.

## Sources

- [New in Chrome 147](https://developer.chrome.com/blog/new-in-chrome-147/)
- [Chrome 147 Release Notes](https://developer.chrome.com/release-notes/147/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/04/stable-channel-update-for-desktop.html)
