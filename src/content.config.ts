import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const releases = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/releases" }),
  schema: z
    .object({
      title: z.string(),
      locale: z.enum(["zh-cn", "en"]).default("zh-cn"),
      milestone: z.number().int().positive(),
      version: z.string(),
      channel: z.enum(["Stable", "Extended Stable", "Beta", "Dev", "Canary"]),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      stableReleasedAt: z.coerce.date().optional(),
      versionReleasedAt: z.coerce.date().optional(),
      status: z.enum(["draft", "review", "published"]),
      summary: z.string(),
      platforms: z.array(z.string()).min(1),
      tags: z.array(z.string()).default([]),
      audience: z
        .array(z.enum(["user", "developer", "enterprise"]))
        .default([]),
      highlights: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
            audience: z.enum(["user", "developer", "enterprise"]),
            icon: z.string().optional(),
          }),
        )
        .default([]),
      securityFixes: z.number().int().nonnegative().optional(),
      sources: z.array(z.object({ label: z.string(), url: z.url() })).min(1),
      images: z
        .array(
          z.object({
            src: z.url(),
            alt: z.string(),
            officialSource: z.url().optional(),
            mirror: z.boolean().default(false),
          }),
        )
        .default([]),
    })
    .superRefine((release, context) => {
      if (release.status === "published" && release.images.length === 0) {
        context.addIssue({
          code: "custom",
          message: "Published releases require at least one official image",
          path: ["images"],
        });
      }
    }),
});

export const collections = { releases };
