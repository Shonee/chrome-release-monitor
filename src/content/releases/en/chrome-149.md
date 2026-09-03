---
title: Chrome 149 Release and Usage Guide
locale: en
milestone: 149
version: "149.0.7827.53/54"
channel: Stable
publishedAt: 2026-09-03T13:15:00+08:00
updatedAt: 2026-09-03T13:15:00+08:00
stableReleasedAt: 2026-06-02T00:00:00-07:00
versionReleasedAt: 2026-06-02T00:00:00-07:00
status: published
summary: Chrome 149 adds CSS gap decorations, improves back-forward cache behavior for WebSocket pages, and exposes locale variants.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Performance]
audience: [user, developer, enterprise]
highlights:
  - title: CSS gap decorations
    description: Grid and Flexbox gaps can render rule lines with configurable color, width, and range.
    audience: developer
  - title: WebSocket pages in bfcache
    description: Chrome disconnects WebSockets when caching a page so back and forward navigation can recover faster.
    audience: user
  - title: Locale variants
    description: Intl.Locale.prototype.variants exposes variant subtags from a locale identifier.
    audience: developer
securityFixes: 429
sources:
  - label: New in Chrome 149
    url: https://developer.chrome.com/blog/new-in-chrome-149/
  - label: Chrome 149 Release Notes
    url: https://developer.chrome.com/release-notes/149/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-149/image/thumb.png?hl=en
    alt: Official Chrome 149 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-149/
    mirror: true
---

> Chrome 149 entered the desktop Stable channel on June 2, 2026. The initial announcement lists 429 security fixes.

## Release overview

Windows uses `149.0.7827.53/54`; macOS and Linux use `149.0.7827.54`. The main themes are CSS presentation, history-navigation performance, and locale metadata.

## Key features and how to use them

### Decorate CSS gaps

Grid and Flexbox containers can draw rules in their gaps and control width, color, inset, and visibility. Older browsers retain the gap while ignoring the decoration.

### Reconnect WebSockets after bfcache restoration

An active WebSocket no longer blocks back-forward caching by itself. Chrome disconnects the socket when the page enters bfcache, so applications should handle `pagehide`, `pageshow`, and connection state without creating duplicate subscriptions.

### Read locale variants

`Intl.Locale.prototype.variants` exposes language-variant subtags. Internationalized routing and content selection should still define a default locale instead of treating variants as the only match condition.

## Guidance for users and administrators

Users can see faster back and forward navigation. Enterprise applications should test reconnect behavior in messaging, market-data, support, and collaborative editing systems.

## How to update Chrome

Open **Help → About Google Chrome**, finish the update, and restart the browser.

## Sources

- [New in Chrome 149](https://developer.chrome.com/blog/new-in-chrome-149/)
- [Chrome 149 Release Notes](https://developer.chrome.com/release-notes/149/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop.html)
