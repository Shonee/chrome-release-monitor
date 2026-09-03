import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { createAssetPath, validateAssetSource } from "./lib/collector.mjs";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const config = JSON.parse(
  await fs.readFile(path.join(root, "config/assets.json"), "utf8"),
);

if (!config.enabled && !dryRun) {
  console.log("Asset synchronization is disabled in config/assets.json");
  process.exit(0);
}

const token = process.env[config.tokenEnv];
if (!token && !dryRun)
  throw new Error(`Missing required environment variable: ${config.tokenEnv}`);

async function listMarkdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMarkdownFiles(fullPath);
      return entry.isFile() && /\.mdx?$/.test(entry.name) ? [fullPath] : [];
    }),
  );
  return files.flat();
}

async function githubRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!response.ok && response.status !== 404) {
    throw new Error(`GitHub API ${response.status}: ${await response.text()}`);
  }
  return response;
}

async function uploadAsset(assetPath, bytes, message) {
  const encodedPath = assetPath.split("/").map(encodeURIComponent).join("/");
  const endpoint = `${config.githubApiUrl}/repos/${config.repository}/contents/${encodedPath}`;
  const existing = await githubRequest(
    `${endpoint}?ref=${encodeURIComponent(config.branch)}`,
  );
  const existingData = existing.ok ? await existing.json() : null;
  const body = {
    message,
    content: Buffer.from(bytes).toString("base64"),
    branch: config.branch,
    ...(existingData?.sha ? { sha: existingData.sha } : {}),
  };
  await githubRequest(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const releasesDirectory = path.join(root, "src/content/releases");
let synchronized = 0;

for (const filePath of await listMarkdownFiles(releasesDirectory)) {
  const parsed = matter(await fs.readFile(filePath, "utf8"));
  const images = Array.isArray(parsed.data.images) ? parsed.data.images : [];
  let articleChanged = false;

  for (const image of images) {
    if (!image.mirror || image.src.startsWith(config.cdnBaseUrl)) continue;
    if (!validateAssetSource(image.src, config.allowedSourceHosts)) {
      throw new Error(`Image source is not allowed: ${image.src}`);
    }

    const response = await fetch(image.src, {
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok)
      throw new Error(`Image download failed ${response.status}: ${image.src}`);
    const mimeType = response.headers.get("content-type")?.split(";")[0] || "";
    if (!config.allowedMimeTypes.includes(mimeType))
      throw new Error(`Image MIME type is not allowed: ${mimeType}`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > config.maxFileBytes)
      throw new Error(`Image exceeds maxFileBytes: ${image.src}`);

    const hash = crypto.createHash("sha256").update(bytes).digest("hex");
    const assetPath = createAssetPath(
      parsed.data.milestone,
      hash,
      mimeType,
      config.pathPrefix,
    );
    if (!dryRun) {
      await uploadAsset(
        assetPath,
        bytes,
        `assets: mirror Chrome ${parsed.data.milestone} image ${hash.slice(0, 12)}`,
      );
      image.officialSource = image.officialSource || image.src;
      image.src = `${config.cdnBaseUrl.replace(/\/$/, "")}/${assetPath}`;
      articleChanged = true;
    }
    synchronized += 1;
  }

  if (articleChanged)
    await fs.writeFile(
      filePath,
      matter.stringify(parsed.content, parsed.data),
      "utf8",
    );
}

console.log(
  `${dryRun ? "Validated" : "Synchronized"} ${synchronized} image(s)`,
);
