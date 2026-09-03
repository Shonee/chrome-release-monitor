import rss from "@astrojs/rss";
import { getSiteConfig } from "../lib/config";
import { localizeSite, localizedPath } from "../lib/i18n";
import { getPublishedReleases, releasePath } from "../lib/releases";
import { withBase } from "../lib/urls";

export async function GET(context: { site?: URL }) {
  const site = localizeSite(getSiteConfig(), "zh-cn");
  const releases = await getPublishedReleases("zh-cn");
  const origin = context.site || new URL("https://example.com");
  return rss({
    title: site.titleSuffix,
    description: site.description,
    site: new URL(localizedPath("zh-cn"), origin),
    items: releases.map((release) => ({
      title: release.data.title,
      description: release.data.summary,
      pubDate: release.data.publishedAt,
      link: withBase(releasePath(release, "zh-cn")),
    })),
  });
}
