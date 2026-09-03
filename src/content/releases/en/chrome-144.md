---
title: Chrome 144 Release and Usage Guide
locale: en
milestone: 144
version: "144.0.7559.59/60"
channel: Stable
publishedAt: 2026-09-03T13:10:00+08:00
updatedAt: 2026-09-03T13:10:00+08:00
stableReleasedAt: 2026-01-13T00:00:00-08:00
versionReleasedAt: 2026-01-13T00:00:00-08:00
status: published
summary: Chrome 144 adds customizable find-in-page highlights, a declarative geolocation element, and the JavaScript Temporal API.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Temporal]
audience: [user, developer, enterprise]
highlights:
  - title: Custom find-in-page highlights
    description: ::search-text lets sites improve the color and decoration of browser search results.
    audience: developer
  - title: Declarative geolocation entry point
    description: The geolocation element ties an explicit user action to permission and location delivery.
    audience: user
  - title: Temporal API
    description: JavaScript gains a clearer and more modern model for dates, times, time zones, and durations.
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
  - src: https://developer.chrome.com/static/blog/new-in-chrome-144/image/thumb.png?hl=en
    alt: Official Chrome 144 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-144/
    mirror: true
---

> Chrome 144 entered the desktop Stable channel on January 13, 2026. This guide is based on official Chrome developer and release materials.

## Release overview

Windows uses `144.0.7559.59/60`; macOS and Linux use `144.0.7559.59`. The initial Stable announcement lists 10 security fixes.

## Key features and how to use them

### Customize find-in-page highlights

Developers can use `::search-text` and `::search-text:current` to style the foreground, background, and text decoration of matches found by the browser. Verify contrast in both light and dark themes.

### Use a declarative geolocation control

The `<geolocation>` element provides a user-activated entry point for location access. It suits actions such as “use my location” or “find nearby stores.” Keep a traditional Geolocation API fallback until support is broad enough for your audience.

### Adopt Temporal for date and time logic

Temporal provides explicit objects for dates, times, time zones, and durations. Encapsulate business time boundaries and use feature detection or a polyfill instead of relying on implicit `Date` behavior.

## Guidance for users and administrators

Users should restart Chrome after updating. Enterprise administrators should test date calculations, location permissions, and custom search highlighting before staged rollout.

## How to update Chrome

Open the Chrome menu, choose **Help → About Google Chrome**, wait for the update to finish, restart the browser, and confirm the full version number.

## Sources

- [New in Chrome 144](https://developer.chrome.com/blog/new-in-chrome-144/)
- [Chrome 144 Release Notes](https://developer.chrome.com/release-notes/144/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/01/stable-channel-update-for-desktop_13.html)
