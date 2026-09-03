---
title: Chrome 146 Release and Usage Guide
locale: en
milestone: 146
version: "146.0.7680.71/72"
channel: Stable
publishedAt: 2026-09-03T13:12:00+08:00
updatedAt: 2026-09-03T13:12:00+08:00
stableReleasedAt: 2026-03-10T00:00:00-07:00
versionReleasedAt: 2026-03-10T00:00:00-07:00
status: published
summary: Chrome 146 introduces scroll-triggered animations, scoped custom element registries, and the updated Sanitizer API.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Web Platform]
audience: [user, developer, enterprise]
highlights:
  - title: Scroll-triggered animations
    description: CSS can declaratively play, pause, or reset animations according to scroll position.
    audience: developer
  - title: Scoped custom element registries
    description: Different scopes can assign different definitions to the same custom-element tag name.
    audience: developer
  - title: Sanitizer API
    description: Structured HTML sanitization helps reduce XSS exposure when handling untrusted markup.
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
  - src: https://developer.chrome.com/static/blog/new-in-chrome-146/image/thumb.png?hl=en
    alt: Official Chrome 146 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-146/
    mirror: true
---

> Chrome 146 entered the desktop Stable channel on March 10, 2026. The initial announcement lists 29 security fixes.

## Release overview

Windows uses `146.0.7680.71/72`; macOS and Linux use `146.0.7680.72`. The release moves more interaction patterns into declarative platform features and adds tools for component isolation and safer HTML handling.

## Key features and how to use them

### Create scroll-triggered animations with CSS

Developers can control animation start, pause, and reset behavior from scroll position. Respect `prefers-reduced-motion` and never make animation the only way information is communicated.

### Isolate custom element registries

Scoped registries let separate component trees bind different implementations to the same tag name. This is useful when large applications load multiple design systems, but lifecycle and server-rendering behavior still need explicit planning.

### Sanitize HTML with a platform API

The Sanitizer API removes executable or unsafe markup from HTML. Use an allowlist and combine it with CSP, output encoding, and server-side validation rather than treating one API as the entire security boundary.

## Guidance for users and administrators

Enterprise testing should cover rich-text editors, component libraries, scroll-driven pages, and content-management systems. Users must restart Chrome to apply all fixes.

## How to update Chrome

Open **Help → About Google Chrome**, finish the update, restart, and confirm Chrome 146 is installed.

## Sources

- [New in Chrome 146](https://developer.chrome.com/blog/new-in-chrome-146/)
- [Chrome 146 Release Notes](https://developer.chrome.com/release-notes/146/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/03/stable-channel-update-for-desktop_10.html)
