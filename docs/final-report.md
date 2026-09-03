# Release Radar for Chrome 实现报告

完成日期：2026-09-03

## 交付内容

项目已经形成可公开维护的 Astro 静态站点，包含版本首页、归档、文章阅读、来源说明、下载中心、全文搜索、深色主题和跨平台发布导出。Markdown 是唯一内容来源，页面、RSS、JSON Feed、Sitemap、Pagefind 与三种导出格式由构建流程统一生成。

所有维护者需要修改的业务数据集中在 `config/*.json`。下载来源支持官方、第三方镜像、社区入口、企业包、对象存储、网盘和自定义 HTTPS 地址；页面没有配置编辑器，修改配置并重新构建即可生效。

## 自动化流程

`monitor-chrome.yml` 每 6 小时检查 Windows、macOS 和 Linux Stable 版本。只有里程碑或平台版本发生变化时才更新状态和文章，并通过自动化分支创建或更新 Pull Request。新里程碑文章默认是 `draft`，不会自动发布未经核验的功能描述。

`deploy-pages.yml` 面向 GitHub Pages 仓库子路径构建。Cloudflare Pages 推荐在 Web 控制台连接 GitHub 仓库，构建命令仍为 `npm run build`，输出目录为 `dist`；`deploy-cloudflare.yml` 仅作为需要外部 CI 时的备用方案。

站点同时生成 `/zh-cn/` 与 `/en/` 页面。根路径和旧版无语言路径通过浏览器语言或用户已保存偏好跳转，语言切换不依赖服务端运行时，适用于 GitHub Pages 与 Cloudflare Pages。

## 启用前配置

1. 在 `config/site.json` 中确认公开仓库、品牌文案和站点链接。
2. 在 `config/downloads.json` 中替换 `planned` 自定义地址并核验第三方下载源。
3. 创建独立图片资源仓库后启用 `config/assets.json`，再配置 `ASSET_REPO_TOKEN`。
4. GitHub Pages 选择 GitHub Actions 作为发布来源。
5. 在 Cloudflare Web 控制台导入 GitHub 仓库并设置 `BASE_PATH=/`、`SITE_URL` 和 `ASTRO_TELEMETRY_DISABLED=1`，默认不需要配置 Cloudflare API Token。

## 发布前检查

```bash
npm ci
npm run check
npm run build
npm run sync:assets -- --dry-run
```

远端发布前还应人工复核示例文章、下载链接、资源仓库权限和 Pages 自定义域名。
