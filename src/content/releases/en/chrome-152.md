---
title: Chrome 152 Release and Usage Guide
locale: en
milestone: 152
version: "152.0.7977.75/76"
channel: Stable
publishedAt: 2026-09-03T12:00:00+08:00
updatedAt: 2026-09-03T13:18:00+08:00
stableReleasedAt: 2026-08-25T00:00:00-07:00
versionReleasedAt: 2026-09-01T00:00:00-07:00
status: published
summary: Chrome 152 expands CSSPseudoElement support, introduces the CPU Performance API, and adds Connection Allowlists for network restrictions.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Security]
audience: [user, developer, enterprise]
highlights:
  - title: More pseudo-elements available to JavaScript
    description: CSSPseudoElement expands to backdrop, scroll-marker, and view-transition pseudo-elements.
    audience: developer
  - title: CPU Performance API
    description: Applications can adapt graphics, computation, and background work to a device performance class.
    audience: developer
  - title: Connection Allowlists
    description: Response headers can restrict the external endpoints available to documents and workers.
    audience: enterprise
securityFixes: 26
sources:
  - label: New in Chrome 152
    url: https://developer.chrome.com/blog/new-in-chrome-152/
  - label: Chrome 152 Release Notes
    url: https://developer.chrome.com/release-notes/152/
  - label: Chrome 152 Stable Release
    url: https://chromereleases.googleblog.com/2026/08/stable-channel-update-for-desktop_0256176589.html
  - label: Chrome 152 Current Version Update
    url: https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-152/image/thumb.png
    alt: Official Chrome 152 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-152/
    mirror: true
---

> Chrome 152 entered the desktop Stable channel on August 25, 2026. The recorded `152.0.7977.75/76` update was published on September 1 and lists 26 security fixes.

## Release overview

The initial Stable build was Windows `152.0.7977.53/54` and macOS/Linux `152.0.7977.54`. This article tracks Windows and macOS `152.0.7977.75/76`, with Linux on `152.0.7977.75`.

## Key features and how to use them

### Access more CSS pseudo-elements from JavaScript

CSSPseudoElement support expands to `::backdrop`, `::scroll-marker`, and view-transition pseudo-elements. Developers can associate animation and interaction logic more precisely, while feature detection remains necessary for older browsers.

### Adapt experiences to CPU performance

The CPU Performance API exposes a device performance class so applications can reduce graphics quality, divide expensive computation, or adjust background work. Do not use the class for fingerprinting or identity, and distinguish it from live Compute Pressure signals.

### Restrict network destinations with Connection Allowlists

The `Connection-Allowlist` response header defines URL patterns that documents and workers may contact. Inventory APIs, telemetry, CDNs, and third-party services before rollout so required endpoints are not accidentally blocked.

## Guidance for users and administrators

Users should apply the September 1 patch and restart Chrome. Enterprise teams should test connection policies, proxies, monitoring scripts, and applications that adapt to hardware capability.

## How to update Chrome

Open the Chrome menu, choose **Help → About Google Chrome**, wait for installation, restart, and confirm Windows/macOS `152.0.7977.75/76` or Linux `152.0.7977.75`.

## Sources

- [New in Chrome 152](https://developer.chrome.com/blog/new-in-chrome-152/)
- [Chrome 152 Release Notes](https://developer.chrome.com/release-notes/152/)
- [Chrome 152 Stable Release](https://chromereleases.googleblog.com/2026/08/stable-channel-update-for-desktop_0256176589.html)
- [Chrome 152 Current Version Update](https://chromereleases.googleblog.com/2026/09/stable-channel-update-for-desktop.html)
