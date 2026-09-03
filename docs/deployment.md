# 部署指南

项目版本：0.1.0

部署日期：2026-09-03

## 通用构建

```bash
npm ci
npm run build
```

构建产物为 `dist/`。GitHub Pages 与 Cloudflare Pages 必须使用同一构建命令和同一份静态产物，避免平台环境产生不同页面行为。

## GitHub Pages

仓库公开并准备开启 Pages 后：

1. 进入仓库 Settings → Pages。
2. 将 Source 设置为 GitHub Actions。
3. 确认 Actions 允许执行 `.github/workflows/deploy-pages.yml`。
4. 推送到默认分支或手动运行工作流。

工作流默认使用以下值：

```text
BASE_PATH=/<repository-name>
SITE_URL=https://<owner>.github.io
```

使用自定义域名或用户主页仓库时，在 Repository Variables 中设置：

```text
PAGES_BASE_PATH=/
SITE_URL=https://updates.example.com
```

## Cloudflare Pages Web 控制台导入（推荐）

推荐直接使用 Cloudflare Pages 的 Git 集成。Cloudflare 通过 GitHub App 读取授权仓库并自动构建，私有仓库和公开仓库都可以选择，不需要在 GitHub Secrets 中保存 Cloudflare API Token。

### 1. 导入 GitHub 仓库

1. 登录 Cloudflare Dashboard，进入 **Workers & Pages**。
2. 选择 **Create application**。
3. 进入 **Pages**，选择 **Import an existing Git repository** 或 **Connect to Git**。
4. 首次使用时按提示安装并授权 Cloudflare Pages GitHub App。
5. 只授权需要部署的仓库，选择 `Shonee/chrome-release-monitor`。
6. 选择 **Begin setup**。

Cloudflare Pages 支持私有 GitHub 仓库。仓库后续公开不需要重新创建 Pages 项目。

### 2. 配置构建

在 **Set up builds and deployments** 中填写：

```text
Project name: chrome-release-monitor（可自定义）
Production branch: master
Framework preset: Astro
Build command: npm run build
Build output directory: dist
Root directory: 留空
```

仓库根目录的 `.nvmrc` 固定为 Node.js 22；若 Cloudflare 构建环境未自动读取，可额外设置 `NODE_VERSION=22`。

在 **Environment variables** 中添加生产环境变量：

```text
BASE_PATH=/
SITE_URL=https://<project>.pages.dev
ASTRO_TELEMETRY_DISABLED=1
```

项目名决定默认的 `*.pages.dev` 域名。确认最终项目名后再填写 `SITE_URL`；如果第一次部署后域名与预期不同，在 **Settings → Environment variables** 修正并重新部署。

### 3. 保存并部署

1. 选择 **Save and Deploy**。
2. 等待依赖安装、Astro 构建和静态资源上传完成。
3. 进入项目概览，打开生产 URL 检查页面。
4. 后续推送到 `master` 会自动部署生产环境；其他分支和 Pull Request 可生成预览部署。

### 4. 配置自定义域名

在 Pages 项目的 **Custom domains** 中添加正式域名。域名生效后，将 `SITE_URL` 改为正式域名并重新部署，确保 Sitemap、RSS 和 JSON Feed 使用正确的绝对地址。

Git 集成项目后续不能直接切换为 Direct Upload 项目。若明确需要完全由外部 CI 上传，应在创建项目时选择对应模式。

## Cloudflare Pages GitHub Actions 部署（可选，不推荐）

仓库保留 `.github/workflows/deploy-cloudflare.yml` 作为高级备用方案。它需要额外维护 Cloudflare API Token 和账户 ID，不是本项目推荐的默认部署方式。

只有无法使用 Cloudflare Git 集成、需要外部 CI 控制发布时，再配置：

Repository Secrets：

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

Repository Variables：

```text
CLOUDFLARE_PAGES_PROJECT
CLOUDFLARE_SITE_URL
```

API Token 只授予目标账户的 Pages Edit 权限。不要将全局 API Key 写入仓库或工作流。

## 自动检测权限

`.github/workflows/monitor-chrome.yml` 需要仓库允许 GitHub Actions 创建分支和 Pull Request。图片同步还需要单独的 `ASSET_REPO_TOKEN`，默认配置关闭时不会访问资源仓库。

## 部署检查

部署完成后检查：

```text
/
/archive/
/downloads/
/sources/
/releases/chrome-152/
/rss.xml
/feed.json
/sitemap-index.xml
/exports/chrome-152.wechat.html
```

GitHub Pages 使用子路径时，重点检查导航、搜索索引、导出文件和 Logo 地址没有丢失仓库基础路径。

## 参考资料

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/configuration/build-configuration/
