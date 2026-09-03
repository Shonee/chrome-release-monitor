# Chrome Release Site Prototype

## Recommended product name

Recommended public-facing name: **Release Radar for Chrome**

Recommended repository slug: `chrome-release-radar`

The wording keeps "Chrome" as the monitored product instead of presenting the project as an official Chrome property. The site and README should keep an explicit unofficial-project disclaimer.

Other viable names:

- Chrome Update Digest
- Chrome Version Watch
- Chrome Release Lens
- Chrome Update Atlas

## Framework recommendation

Use **Astro in static output mode** with Astro Content Collections.

### Framework comparison

| Option | Strengths | Main limitation for this project | Decision |
| --- | --- | --- | --- |
| Astro | Typed content collections, Markdown/MDX, RSS, custom pages, minimal client JavaScript | Requires a small custom theme instead of receiving a complete documentation UI | Recommended |
| VitePress | Very fast Markdown documentation setup and simple GitHub Pages deployment | Release archive, source-health panels and publishing tools require working around a documentation-shaped information architecture | Good fallback |
| Astro Starlight | Strong documentation navigation and search while retaining Astro | Its default sidebar-first documentation layout is not the intended release-publication experience | Use only for a separate project handbook |
| Docusaurus | Mature docs/blog/versioning and React ecosystem | Heavier runtime and configuration than this static publishing workflow needs | Not recommended for the first release |
| MkDocs Material | Excellent Python documentation workflow | Interactive export tools and custom release views are less natural than in Astro | Not recommended for the main site |

Why Astro fits this project:

- Markdown and MDX remain the source of truth.
- Content Collections can validate release metadata with a schema.
- The same static `dist/` output can be deployed to GitHub Pages and Cloudflare Pages.
- Custom release timelines, source-health UI, RSS, JSON Feed and export tools are easier to build than inside a documentation-first theme.
- Client-side JavaScript can be limited to search, filters, theme, and copy/export actions.

Suggested supporting tools:

- TypeScript and Zod for normalized release records.
- Astro Content Collections for Markdown article ingestion.
- Pagefind for static full-text search.
- Shiki for code highlighting.
- Unified/remark/rehype for Markdown transforms.
- Juice or an equivalent inliner for WeChat-compatible HTML export.
- GitHub Actions for scheduled collection, document generation and builds.

## Deployment boundary

Keep the site static. Do not introduce Cloudflare-only runtime APIs into the core site. Both deployment targets should build with the same command and publish the same `dist/` directory.

GitHub Pages should use a GitHub Actions deployment workflow because the repository already needs scheduled generation workflows. Cloudflare Pages can use Git integration or receive the same prebuilt artifact in a separate deployment job.

## Image storage recommendation

Do not place mirrored Chrome feature images in the main repository.

Use a separate public repository, for example `chrome-release-radar-assets`, with this layout:

```text
releases/m152/<sha256-prefix>-vertical-tabs.webp
releases/m152/<sha256-prefix>-feature-name.png
metadata/m152/images.json
```

The collection workflow should:

1. Download only images from an allowlist of official Google/Chromium domains.
2. Validate MIME type, dimensions, byte size and content hash.
3. Preserve the official source URL, retrieval date, license/usage note and article association in metadata.
4. Upload new hashes to the asset repository through GitHub's Contents or Git Data API.
5. Reference an immutable commit URL in generated Markdown.

The asset repository must be public from the beginning if deployed pages need anonymous image access while the main repository is still private. A cross-repository workflow cannot rely on the main repository's default `GITHUB_TOKEN`; use a narrowly scoped GitHub App installation token or fine-grained token stored as an Actions secret.

`raw.githubusercontent.com` commit URLs satisfy the GitHub-hosted requirement but do not provide a formal CDN SLA. jsDelivr can be an optional public-repository acceleration layer, not the only canonical URL. For higher traffic, the asset repository can also publish through GitHub Pages behind a dedicated asset domain.

## Page structure

The prototype includes two primary screens:

1. Latest-release page: version status, source completeness, major changes, official media and release archive.
2. Article page: sticky actions, readable content column, table of contents, release evidence metadata and publishing tools.
3. Download page: platform detection, official downloads, domestic community routes, enterprise packages, custom links and a separately labeled Linux mirror route.

The download center follows an official-first trust model. Google and Chrome Enterprise links are treated as official routes. Aliyun is shown as a currently reachable Linux RPM mirror and is explicitly labeled as third-party rather than as a Google download source.

Windows and macOS domestic routes require more careful wording. The currently checked community pages publish version and checksum information, but some final installer links still use Google download domains. They are therefore presented as community indexes or proxy entrances, not as Google-equivalent independent mirrors.

### Download source configuration

The page reads `config/download-sources.json` at runtime. There is intentionally no configuration editor in the site UI. Editing the JSON and rebuilding or refreshing the static site is enough to update the cards.

Each platform has one `primary` source and an `alternatives` array. A source supports these fields:

```json
{
  "id": "custom-macos-share",
  "name": "团队备用网盘",
  "provider": "Project Maintainer",
  "type": "custom",
  "url": "https://example.com/share",
  "enabled": true,
  "status": "verified",
  "checkedAt": "2026-09-03",
  "formats": ["DMG", "网盘"],
  "description": "维护者核验过的备用下载地址",
  "actionLabel": "打开备用下载"
}
```

Supported `type` values are `official`, `mirror`, `community`, `enterprise`, `cloud` and `custom`. Supported `status` values are `verified`, `monitoring`, `degraded`, `planned` and `unverified`. Unknown values fall back to the least-trusted visual treatment.

Set `enabled` to `false` to hide a source. HTTPS is required by default. HTTP links are accepted only when the top-level `allowHttp` option is explicitly set to `true`; production configuration should normally keep it disabled.

Configured text is inserted through DOM text nodes rather than trusted as HTML. Icons and CSS classes come from fixed allowlists, and invalid URLs render as disabled actions. If the JSON cannot be loaded, the page displays a source-configuration error instead of silently presenting stale hardcoded links.

The export dialog demonstrates three outputs:

- WeChat-compatible HTML with inline styles.
- Original Markdown with Frontmatter.
- Generic HTML for other publishing platforms.

## Visual direction

- Editorial release intelligence rather than a marketing landing page.
- White/charcoal base with Chrome's blue, red, green and yellow used as semantic accents.
- Square, restrained surfaces with a maximum 8px radius.
- Dense release metadata remains scannable while article content uses a wider Chinese reading line-height.
- Desktop uses a three-column article layout; mobile collapses to a single reading column.

## Prototype limitations

- Content is a representative Chrome 152 sample, not a generated production article.
- Official images are loaded from Google URLs to demonstrate layout. The production workflow should mirror approved files to the separate asset repository.
- GitHub, source and RSS links are placeholders.
- The copy/export interaction uses browser clipboard APIs and fallback plain-text copying.
