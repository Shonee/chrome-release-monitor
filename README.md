# Release Radar for Chrome

社区维护的 Chrome 更新追踪、中文使用指南与下载入口。项目不隶属于 Google，Chrome 及其标识归相应权利人所有。

## 功能

- 定时检测 Windows、macOS、Linux Stable 版本变化。
- 以 Markdown 沉淀更新文章，保留版本、平台、受众和来源元数据。
- 提供首页、版本归档、文章阅读、来源说明和下载中心。
- 支持简体中文与英文静态页面，首次访问按浏览器语言选择，之后可在页面顶部手动切换。
- 下载源完全由配置驱动，支持官方地址、国内镜像、社区入口、对象存储、直链和网盘分享。
- 构建时生成原始 Markdown、通用 HTML、微信公众号内联样式 HTML。
- 生成 RSS、JSON Feed、Sitemap 和 Pagefind 搜索索引。
- 同一份 `dist/` 可部署到 GitHub Pages 与 Cloudflare Pages，Cloudflare 推荐通过 Web 控制台导入 GitHub 仓库。
- 官方功能图片可直接同步到独立 GitHub 资源仓库，不写入主仓库。

## 快速开始

环境要求：Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

生产检查与构建：

```bash
npm run check
npm run build
```

## 配置

所有需要维护者自定义的业务项集中在 [`config/`](config/)：

| 文件              | 用途                                          |
| ----------------- | --------------------------------------------- |
| `site.json`       | 品牌、站点文案、导航、仓库和 Feed 链接        |
| `downloads.json`  | Windows、macOS、Linux 下载来源及状态          |
| `sources.json`    | Chrome 版本检测接口、平台和官方资料来源       |
| `assets.json`     | 外部图片仓库、CDN、允许域名、大小和 MIME 限制 |
| `publishing.json` | Markdown、HTML、微信公众号导出规则            |

详细字段和自定义下载地址示例见 [`docs/configuration.md`](docs/configuration.md)。页面中不提供配置编辑器；修改配置后重新构建即可。

## 内容

中文发布文章存放在 `src/content/releases/`，对应英文文章存放在 `src/content/releases/en/`。Frontmatter 由 `src/content.config.ts` 校验，只有 `status: published` 且至少包含一张图片的文章会进入对应语言的公开页面和 Feed。

```text
src/content/releases/chrome-152.md
src/content/releases/en/chrome-152.md
```

构建生成的跨平台发布文件位于：

```text
public/exports/chrome-152.md
public/exports/chrome-152.html
public/exports/chrome-152.wechat.html
public/exports/en/chrome-152.md
public/exports/en/chrome-152.html
public/exports/en/chrome-152.wechat.html
```

该目录是构建产物，不提交到 Git。

## 多语言路由

- `/zh-cn/`：简体中文站点。
- `/en/`：英文站点。
- `/`：读取 `release-radar-locale` 偏好；没有偏好时根据 `navigator.languages` 选择中文或英文。
- 顶部语言按钮会切换到当前页面的另一语言版本，并保存选择。
- 旧的无语言页面路径继续存在，并自动转到相同内容的本地化路径。

站点、下载源和资料来源的英文文案通过配置中的 `translations.en` 维护。没有配置英文覆盖的自定义下载源会回退到基础文案，详细格式见 [`docs/configuration.md`](docs/configuration.md)。

## 自动检测

```bash
npm run collect -- --dry-run
npm run collect
```

当发现新里程碑时，脚本会创建 `status: draft` 的中文文章骨架。检测到同一里程碑的新补丁时，会更新版本和检测记录，不会把未经核验的功能描述自动标记为已发布。

GitHub Actions 定时任务位于 `.github/workflows/monitor-chrome.yml`，默认每 6 小时运行并通过自动化分支创建或更新 Pull Request。

## 图片仓库

启用前先修改 `config/assets.json`，然后配置 `ASSET_REPO_TOKEN`。同步脚本只接受允许域名和 MIME 类型，文件在内存中计算 SHA-256 后直接上传到资源仓库：

```bash
npm run sync:assets -- --dry-run
npm run sync:assets
```

## 部署

参见 [`docs/deployment.md`](docs/deployment.md)。本地构建、提交、推送、开启 Pages 和正式部署是独立步骤，本仓库不会因本地检查通过而自动修改远端设置。

## 项目文档

- [`docs/design.md`](docs/design.md)：架构、数据边界与设计决策。
- [`docs/implementation-plan.md`](docs/implementation-plan.md)：实现阶段与完成范围。
- [`docs/configuration.md`](docs/configuration.md)：全部配置项与自定义下载源示例。
- [`docs/deployment.md`](docs/deployment.md)：GitHub Pages 与 Cloudflare Pages 部署。
- [`docs/review.md`](docs/review.md)：代码、工作流和页面验收记录。
- [`docs/final-report.md`](docs/final-report.md)：启用前配置与交付总结。

## 参与贡献

提交 Issue 或 Pull Request 前请阅读 [`CONTRIBUTING.md`](CONTRIBUTING.md) 和 [`SECURITY.md`](SECURITY.md)。

## License

[MIT](LICENSE)
