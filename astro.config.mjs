import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const base = process.env.BASE_PATH || "/";
const site = process.env.SITE_URL || "https://example.com";

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
  },
});
