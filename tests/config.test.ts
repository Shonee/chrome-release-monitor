import { describe, expect, it } from "vitest";
import {
  getAssetsConfig,
  getDownloadConfig,
  getOrderedDownloadSources,
  getPublishingConfig,
  getSiteConfig,
  getSourcesConfig,
  getVisibleDownloadSources,
} from "../src/lib/config";
import { localizeDownloadSource, localizeSite } from "../src/lib/i18n";

describe("project configuration", () => {
  it("loads every supported configuration file", () => {
    expect(getSiteConfig().navigation.length).toBeGreaterThan(0);
    expect(getSourcesConfig().collector.platforms).toContain("Windows");
    expect(getAssetsConfig().allowedSourceHosts).toContain(
      "developer.chrome.com",
    );
    expect(getPublishingConfig().exportsDirectory).toBe("public/exports");
  });

  it("keeps custom download sources and hides disabled entries", () => {
    const config = getDownloadConfig();
    const visible = getVisibleDownloadSources(
      config.platforms.windows.alternatives,
    );

    expect(visible.some((source) => source.type === "custom")).toBe(true);
    expect(visible.every((source) => source.enabled !== false)).toBe(true);
  });

  it("orders alternative downloads by enterprise, domestic, then custom", () => {
    const sources = getDownloadConfig().platforms.windows.alternatives;
    const orderedTypes = getOrderedDownloadSources(sources).map(
      (source) => source.type,
    );

    expect(orderedTypes).toEqual([
      "enterprise",
      "community",
      "community",
      "custom",
    ]);
  });

  it("rejects HTTP download URLs unless allowHttp is enabled", () => {
    const config = getDownloadConfig();
    expect(config.allowHttp).toBe(false);
    expect(() => new URL(config.platforms.windows.primary.url)).not.toThrow();
  });

  it("provides English site and download-source translations", () => {
    const site = localizeSite(getSiteConfig(), "en");
    const source = localizeDownloadSource(
      getDownloadConfig().platforms.linux.alternatives[0],
      "en",
    );
    expect(site.navigation[0].label).toBe("Latest");
    expect(site.language).toBe("en");
    expect(source.name).toContain("Alibaba Cloud");
  });
});
