import rss from "@astrojs/rss";
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
  const site = localizeSite(getSiteConfig(), locale);
  const releases = await getPublishedReleases(locale);
  const origin = baseSite || new URL("https://example.com");
  return rss({
    title: site.titleSuffix,
    description: site.description,
    site: new URL(localizedPath(locale), origin),
    items: releases.map((release) => ({
      title: release.data.title,
      description: release.data.summary,
      pubDate: release.data.publishedAt,
      link: withBase(releasePath(release, locale)),
    })),
  });
}
