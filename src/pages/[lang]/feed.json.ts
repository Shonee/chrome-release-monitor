import { getSiteConfig } from "../../lib/config";
import {
  getLocaleStaticPaths,
  localizeSite,
  localizedPath,
  requireLocale,
} from "../../lib/i18n";
import { getPublishedReleases, releasePath } from "../../lib/releases";
import { withBase } from "../../lib/urls";

export function getStaticPaths() {
  return getLocaleStaticPaths();
}

export async function GET({
  params,
  site: baseSite,
}: {
  params: { lang?: string };
  site?: URL;
}) {
  const locale = requireLocale(params.lang);
  const config = localizeSite(getSiteConfig(), locale);
  const releases = await getPublishedReleases(locale);
  const origin = baseSite || new URL("https://example.com");
  const feedUrl = new URL(localizedPath(locale, "/feed.json"), origin).href;
  const homeUrl = new URL(localizedPath(locale), origin).href;
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
          const url = new URL(withBase(releasePath(release, locale)), origin)
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
