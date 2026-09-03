---
title: Chrome 150 Release and Usage Guide
locale: en
milestone: 150
version: "150.0.7871.46/47"
channel: Stable
publishedAt: 2026-09-03T13:16:00+08:00
updatedAt: 2026-09-03T13:16:00+08:00
stableReleasedAt: 2026-06-30T00:00:00-07:00
versionReleasedAt: 2026-06-30T00:00:00-07:00
status: published
summary: Chrome 150 introduces CSS text-fit, declarative focus groups, and background-clip:border-area.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Accessibility]
audience: [user, developer, enterprise]
highlights:
  - title: CSS text-fit
    description: Text can scale to fit its container without JavaScript-based layout measurement.
    audience: developer
  - title: Focusgroup
    description: Composite controls can declare arrow-key navigation, Tab stops, and focus memory.
    audience: user
  - title: Border-area background clipping
    description: Backgrounds can be clipped to the painted border area, simplifying gradient borders.
    audience: developer
securityFixes: 433
sources:
  - label: New in Chrome 150
    url: https://developer.chrome.com/blog/new-in-chrome-150/
  - label: Chrome 150 Release Notes
    url: https://developer.chrome.com/release-notes/150/
  - label: Stable Channel Update for Desktop
    url: https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop_0175352312.html
images:
  - src: https://developer.chrome.com/static/blog/new-in-chrome-150/image/thumb.png?hl=en
    alt: Official Chrome 150 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-150/
    mirror: true
---

> Chrome 150 entered the desktop Stable channel on June 30, 2026, with 433 security fixes listed in the initial announcement.

## Release overview

Windows uses `150.0.7871.46/47`; macOS and Linux use `150.0.7871.47`. The release focuses on adaptive typography, keyboard interaction, and simpler gradient borders.

## Key features and how to use them

### Fit short text to its container

`text-fit` scales text so it fits the available width. It works well for dashboards and short labels, but it should not replace responsive layout, wrapping, or a sensible minimum font size for longer content.

### Build keyboard-friendly composite controls

`focusgroup` declares arrow-key navigation, Tab behavior, and focus memory for toolbars, menus, and option groups. Continue to provide semantic roles, visible focus, and screen-reader testing.

### Create gradient borders

`background-clip: border-area` clips a background to the painted border region and can replace some `border-image` or pseudo-element techniques. Test transparent borders, high-contrast mode, and print output.

## Guidance for users and administrators

Keyboard users may benefit from more consistent composite-control navigation. Enterprise teams should regression-test internal component libraries, shortcuts, and automated selectors.

## How to update Chrome

Open **Help → About Google Chrome**, finish the update, and restart the browser.

## Sources

- [New in Chrome 150](https://developer.chrome.com/blog/new-in-chrome-150/)
- [Chrome 150 Release Notes](https://developer.chrome.com/release-notes/150/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/06/stable-channel-update-for-desktop_0175352312.html)
