import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const httpsUrl = z
  .url()
  .refine((value) => value.startsWith("https://"), "HTTPS URL required");
const internalOrHttpsUrl = z
  .string()
  .refine(
    (value) => value.startsWith("/") || value.startsWith("https://"),
    "Internal path or HTTPS URL required",
  );

const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: internalOrHttpsUrl,
});

const siteTranslationSchema = z.object({
  titleSuffix: z.string().min(1),
  description: z.string().min(1),
  navigation: z.array(navigationItemSchema).min(1),
  home: z.object({
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    summary: z.string().min(1),
    downloadLabel: z.string().min(1),
  }),
});

const siteSchema = z.object({
  name: z.string().min(1),
  productName: z.string().min(1),
  titleSuffix: z.string().min(1),
  description: z.string().min(1),
  language: z.string().min(2),
  locale: z.string().min(2),
  timezone: z.string().min(1),
  repositoryUrl: httpsUrl,
  brand: z.object({
    logoUrl: httpsUrl,
    logoAlt: z.string().min(1),
    unofficialLabel: z.string().min(1),
  }),
  navigation: z.array(navigationItemSchema).min(1),
  links: z.object({
    rss: internalOrHttpsUrl,
    jsonFeed: internalOrHttpsUrl,
    license: internalOrHttpsUrl,
  }),
  home: z.object({
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    summary: z.string().min(1),
    downloadLabel: z.string().min(1),
  }),
  translations: z.object({
    en: siteTranslationSchema,
  }),
});

const sourceTypeSchema = z.enum([
  "official",
  "mirror",
  "community",
  "enterprise",
  "cloud",
  "custom",
]);
const sourceStatusSchema = z.enum([
  "verified",
  "monitoring",
  "degraded",
  "planned",
  "unverified",
]);

const downloadDetailsSchema = z.array(
  z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
);

const downloadSourceTranslationSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  actionLabel: z.string().min(1).optional(),
  details: downloadDetailsSchema.optional(),
});

const downloadSourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  provider: z.string().min(1),
  type: sourceTypeSchema,
  url: z.url(),
  enabled: z.boolean().default(true),
  status: sourceStatusSchema,
  checkedAt: z.string().min(1),
  formats: z.array(z.string().min(1)).optional(),
  description: z.string().min(1),
  details: downloadDetailsSchema.optional(),
  actionLabel: z.string().min(1),
  translations: z
    .object({
      en: downloadSourceTranslationSchema.optional(),
    })
    .optional(),
});

const platformDownloadSchema = z.object({
  primary: downloadSourceSchema,
  alternatives: z.array(downloadSourceSchema),
});

const downloadSchema = z
  .object({
    updatedAt: z.iso.datetime({ offset: true }),
    allowHttp: z.boolean().default(false),
    platforms: z.object({
      windows: platformDownloadSchema,
      macos: platformDownloadSchema,
      linux: platformDownloadSchema,
    }),
  })
  .superRefine((config, context) => {
    if (config.allowHttp) return;
    for (const [platform, sources] of Object.entries(config.platforms)) {
      for (const source of [sources.primary, ...sources.alternatives]) {
        if (!source.url.startsWith("https://")) {
          context.addIssue({
            code: "custom",
            message: `HTTP source ${source.id} is disabled by allowHttp=false`,
            path: ["platforms", platform],
          });
        }
      }
    }
  });

const sourcesSchema = z.object({
  updatedAt: z.iso.datetime({ offset: true }),
  collector: z.object({
    apiType: z.enum(["chromiumdash", "versionhistory"]),
    releaseEndpoint: httpsUrl,
    platforms: z.array(z.string().min(1)).min(1),
    channel: z.string().min(1),
    requestTimeoutMs: z.number().int().min(1000).max(120000),
    userAgent: z.string().min(1),
  }),
  officialSources: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        type: z.string().min(1),
        url: httpsUrl.optional(),
        urlTemplate: httpsUrl.optional(),
        description: z.string().min(1),
        translations: z
          .object({
            en: z
              .object({
                name: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
              })
              .optional(),
          })
          .optional(),
      }),
    )
    .min(1),
});

const assetsSchema = z.object({
  enabled: z.boolean(),
  repository: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
  branch: z.string().min(1),
  pathPrefix: z.string().min(1),
  cdnBaseUrl: httpsUrl,
  githubApiUrl: httpsUrl,
  tokenEnv: z.string().regex(/^[A-Z][A-Z0-9_]+$/),
  maxFileBytes: z.number().int().positive(),
  allowedMimeTypes: z.array(z.string().startsWith("image/")).min(1),
  allowedSourceHosts: z.array(z.string().min(1)).min(1),
});

const publishingSchema = z.object({
  exportsDirectory: z.string().min(1),
  siteAuthor: z.string().min(1),
  includeSourceLinks: z.boolean(),
  wechat: z.object({
    fontFamily: z.string().min(1),
    textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    quoteColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    maxWidth: z.string().regex(/^\d+px$/),
  }),
});

function readConfig<T>(filename: string, schema: z.ZodType<T>): T {
  const filePath = path.join(process.cwd(), "config", filename);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid config/${filename}: ${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export type SiteConfig = z.infer<typeof siteSchema>;
export type DownloadConfig = z.infer<typeof downloadSchema>;
export type DownloadSource = z.infer<typeof downloadSourceSchema>;
export type SourcesConfig = z.infer<typeof sourcesSchema>;
export type AssetsConfig = z.infer<typeof assetsSchema>;
export type PublishingConfig = z.infer<typeof publishingSchema>;

export const getSiteConfig = () => readConfig("site.json", siteSchema);
export const getDownloadConfig = () =>
  readConfig("downloads.json", downloadSchema);
export const getSourcesConfig = () => readConfig("sources.json", sourcesSchema);
export const getAssetsConfig = () => readConfig("assets.json", assetsSchema);
export const getPublishingConfig = () =>
  readConfig("publishing.json", publishingSchema);

export function getVisibleDownloadSources(
  sources: DownloadSource[],
): DownloadSource[] {
  return sources.filter((source) => source.enabled !== false);
}

const downloadSourceOrder: Record<DownloadSource["type"], number> = {
  enterprise: 0,
  mirror: 1,
  community: 1,
  custom: 2,
  cloud: 2,
  official: 3,
};

export function getOrderedDownloadSources(
  sources: DownloadSource[],
): DownloadSource[] {
  return getVisibleDownloadSources(sources)
    .map((source, index) => ({ source, index }))
    .sort(
      (left, right) =>
        downloadSourceOrder[left.source.type] -
          downloadSourceOrder[right.source.type] || left.index - right.index,
    )
    .map(({ source }) => source);
}
