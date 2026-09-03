---
title: Chrome 145 Release and Usage Guide
locale: en
milestone: 145
version: "145.0.7632.45/46"
channel: Stable
publishedAt: 2026-09-03T13:11:00+08:00
updatedAt: 2026-09-03T13:11:00+08:00
stableReleasedAt: 2026-02-10T00:00:00-08:00
versionReleasedAt: 2026-02-10T00:00:00-08:00
status: published
summary: Chrome 145 adds multicolumn wrapping, the Origin API, and device-bound session credentials.
platforms: [Windows, macOS, Linux]
tags: [Chrome, Stable, Security]
audience: [user, developer, enterprise]
highlights:
  - title: Multicolumn layout wrapping
    description: column-wrap and column-height reduce horizontal overflow in height-constrained multicolumn layouts.
    audience: developer
  - title: Origin API
    description: Origin objects provide structured parsing, comparison, and serialization of web origins.
    audience: developer
  - title: Device-bound session credentials
    description: DBSC binds sessions to device keys to reduce replay of stolen cookies on another device.
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
  - src: https://developer.chrome.com/static/blog/new-in-chrome-145/image/thumb.png?hl=en
    alt: Official Chrome 145 feature cover
    officialSource: https://developer.chrome.com/blog/new-in-chrome-145/
    mirror: true
---

> Chrome 145 entered the desktop Stable channel on February 10, 2026, with 11 security fixes listed in the initial announcement.

## Release overview

Windows and macOS use `145.0.7632.45/46`; Linux uses `145.0.7632.45`. The release combines layout improvements, structured origin handling, and session-security work.

## Key features and how to use them

### Wrap multicolumn layouts

`column-wrap` and `column-height` can move columns into a new block-direction row instead of creating horizontal overflow. Test container height, column width, and narrow breakpoints together.

### Work with structured origins

The Origin API provides a standard object for parsing, comparing, and serializing origins. Security-sensitive code should compare complete origins rather than string prefixes.

### Evaluate device-bound session credentials

DBSC combines short-lived cookies with device-supported keys. Identity teams should test session renewal, device migration, recovery, proxy behavior, and single sign-on before production enablement.

## Guidance for users and administrators

Users only need to update and restart. Administrators should pay particular attention to authentication, terminal key support, and long-running sessions.

## How to update Chrome

Open **Help → About Google Chrome**, complete the update, restart, and confirm the full version number.

## Sources

- [New in Chrome 145](https://developer.chrome.com/blog/new-in-chrome-145/)
- [Chrome 145 Release Notes](https://developer.chrome.com/release-notes/145/)
- [Stable Channel Update for Desktop](https://chromereleases.googleblog.com/2026/02/stable-channel-update-for-desktop_10.html)
