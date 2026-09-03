import { getSiteConfig } from "../lib/config";
import { localizeSite, localizedPath } from "../lib/i18n";
import { getPublishedReleases, releasePath } from "../lib/releases";
import { withBase } from "../lib/urls";

export async function GET({ site: baseSite }: { site?: URL }) {
  const config = localizeSite(getSiteConfig(), "zh-cn");
  const releases = await getPublishedReleases("zh-cn");
  const origin = baseSite || new URL("https://example.com");
  const feedUrl = new URL(withBase("/feed.json"), origin).href;
  const homeUrl = new URL(localizedPath("zh-cn"), origin).href;
  return new Response(
    JSON.stringify(
      {
        version: "https://jsonfeed.org/version/1.1",
        title: config.titleSuffix,
        home_page_url: homeUrl,
        feed_url: feedUrl,
        description: config.description,
        language: config.language,
        items: releases.map((release) => {
          const url = new URL(withBase(releasePath(release, "zh-cn")), origin)
            .href;
          return {
            id: url,
            url,
            title: release.data.title,
            summary: release.data.summary,
            date_published: release.data.publishedAt.toISOString(),
            date_modified: release.data.updatedAt.toISOString(),
            tags: release.data.tags,
          };
        }),
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/feed+json; charset=utf-8" } },
  );
}
