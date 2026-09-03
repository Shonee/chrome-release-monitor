---
title: Chrome 148 Release and Usage Guide
locale: en
milestone: 148
version: "148.0.7778.96/97"
channel: Stable
publishedAt: 2026-09-03T13:14:00+08:00
updatedAt: 2026-09-03T13:14:00+08:00
stableReleasedAt: 2026-05-05T00:00:00-07:00
versionReleasedAt: 2026-05-05T00:00:00-07:00
status: published
summary: Chrome 148 supports name-only container queries, lazy-loaded audio and video, and the on-device Prompt API.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, AI]
audience: [user, developer, enterprise]
highlights:
  - title: Name-only container queries
    description: "@container can target container-name without requiring container-type."
    audience: developer
  - title: Lazy-loaded audio and video
    description: video and audio support loading="lazy" to defer media outside the viewport.
    audience: user
  - title: Prompt API
    description: Web applications can call an on-device language model and constrain structured output.
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
  - src: https://developer.chrome.com/static/blog/new-in-chrome-148/image/thumb.png?hl=en
    alt: Official Chrome 148 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-148/
    mirror: true
---

> Chrome 148 entered the desktop Stable channel on May 5, 2026, with 126 security fixes listed in the initial announcement.

## Release overview

Windows uses `148.0.7778.96/97`; macOS and Linux use `148.0.7778.97`. The release improves responsive layout, media loading, and access to on-device AI capabilities.

## Key features and how to use them

### Query containers by name

Named containers can now be selected by `@container` without setting `container-type`. This reduces unnecessary containment when a component only needs identity-based style changes.

### Lazy-load video and audio

Set `loading="lazy"` on `<video>` or `<audio>` to defer media far from the viewport. Do not lazy-load critical above-the-fold media, and continue to provide dimensions, posters, and loading states.

### Evaluate the Prompt API

The Prompt API can send text, image, or audio input to the browser-provided on-device model and constrain output with regular expressions or JSON Schema. Detect support and keep a server model or traditional implementation as a fallback.

## Guidance for users and administrators

Media-heavy pages may use less startup bandwidth. Organizations should evaluate model availability, hardware requirements, data boundaries, and policy controls before enabling on-device AI features.

## How to update Chrome

Open **Help → About Google Chrome**, complete the update, and restart the browser.

## Sources

- [New in Chrome 148](https://developer.chrome.com/blog/new-in-chrome-148/)
- [Chrome 148 Release Notes](https://developer.chrome.com/release-notes/148/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/05/stable-channel-update-for-desktop.html)
