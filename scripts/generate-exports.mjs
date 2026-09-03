import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { renderGenericHtml, renderWechatHtml } from "./lib/exporter.mjs";

const root = process.cwd();
const publishing = JSON.parse(
  await fs.readFile(path.join(root, "config/publishing.json"), "utf8"),
);
const releasesDirectory = path.join(root, "src/content/releases");
const outputDirectory = path.join(root, publishing.exportsDirectory);

async function listMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(fullPath);
      return /\.mdx?$/.test(entry.name) ? [fullPath] : [];
    }),
  );
  return files.flat();
}

await fs.rm(outputDirectory, { recursive: true, force: true });
await fs.mkdir(outputDirectory, { recursive: true });

const manifest = [];
for (const filePath of await listMarkdownFiles(releasesDirectory)) {
  const raw = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(raw);
  if (data.status !== "published") continue;

  const slug = path.basename(filePath).replace(/\.mdx?$/, "");
  const locale = data.locale || "zh-cn";
  const outputStem = locale === "en" ? path.join("en", slug) : slug;
  const outputBasePath = path.join(outputDirectory, outputStem);
  await fs.mkdir(path.dirname(outputBasePath), { recursive: true });
  const coverImage = data.images?.[0];
  const imageSourceLabel =
    locale === "en" ? "View official image source" : "查看官方图片来源";
  const coverMarkdown = coverImage
    ? `![${coverImage.alt}](${coverImage.src})\n\n${coverImage.officialSource ? `[${imageSourceLabel}](${coverImage.officialSource})\n\n` : ""}`
    : "";
  const exportMarkdown = `# ${data.title}\n\n${coverMarkdown}${content.trim()}\n`;
  const genericHtml = await renderGenericHtml(exportMarkdown);
  const wechatHtml = await renderWechatHtml(exportMarkdown, publishing.wechat);

  await Promise.all([
    fs.writeFile(`${outputBasePath}.md`, exportMarkdown, "utf8"),
    fs.writeFile(`${outputBasePath}.html`, genericHtml, "utf8"),
    fs.writeFile(`${outputBasePath}.wechat.html`, wechatHtml, "utf8"),
  ]);

  manifest.push({
    slug,
    locale,
    title: data.title,
    milestone: data.milestone,
    updatedAt: new Date(data.updatedAt).toISOString(),
    files: {
      markdown: `${outputStem}.md`,
      html: `${outputStem}.html`,
      wechat: `${outputStem}.wechat.html`,
    },
  });
}

await fs.writeFile(
  path.join(outputDirectory, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(
  `Generated ${manifest.length} release export set(s) in ${publishing.exportsDirectory}`,
);
