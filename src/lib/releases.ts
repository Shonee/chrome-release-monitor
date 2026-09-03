import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";

export type ReleaseEntry = CollectionEntry<"releases">;

export async function getPublishedReleases(
  locale: Locale = "zh-cn",
): Promise<ReleaseEntry[]> {
  const showDrafts = import.meta.env.SHOW_DRAFTS === "true";
  const releases = await getCollection(
    "releases",
    ({ data }) =>
      data.locale === locale && (showDrafts || data.status === "published"),
  );
  return releases.sort((left, right) => {
    if (right.data.milestone !== left.data.milestone)
      return right.data.milestone - left.data.milestone;
    return right.data.updatedAt.getTime() - left.data.updatedAt.getTime();
  });
}

export function releaseSlug(release: ReleaseEntry): string {
  return (
    release.id
      .split("/")
      .at(-1)
      ?.replace(/\.(md|mdx)$/, "") || release.id
  );
}

export function releasePath(release: ReleaseEntry, locale: Locale): string {
  return `/${locale}/releases/${releaseSlug(release)}/`;
}
