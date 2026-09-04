# Release Radar for Chrome

自动维护的 Chrome Stable 更新追踪、双语文章与下载入口。项目不隶属于 Google，Chrome 及其标识归相应权利人所有。

## 功能

- 定时检测 Windows、macOS、Linux Stable 版本变化。
- 从 Chromium Dashboard 获取发布时间，并在不可用时回退到 Chrome Version History API。
- 新版本按完整版本号生成中英文 Markdown 文章，不覆盖已有人工文章。
- 自动文章只包含版本、平台、检测时间、官方更新条目和来源等可验证信息。
- 提供首页、版本归档、文章、来源说明、下载中心、RSS、JSON Feed、Sitemap 和 Pagefind 搜索。
- 构建时生成 Markdown、通用 HTML 和微信公众号内联样式 HTML。
- 数据变化后先执行完整检查和生产构建，通过后才推送默认分支并部署 GitHub Pages。

## 本地运行

环境要求：Node.js 22.12 或更高版本。

```bash
npm ci
npm run check
npm run build
npm run dev
```

只检查远端版本、不修改文件：

```bash
npm run collect -- --dry-run
```

执行采集并写入文章和状态：

```bash
npm run collect
```

## 配置

维护配置集中在 `config/`：

| 文件              | 用途                                 |
| ----------------- | ------------------------------------ |
| `site.json`       | 品牌、站点文案、导航和 Feed 链接     |
| `downloads.json`  | Windows、macOS、Linux 下载来源       |
| `sources.json`    | 主备版本接口、重试参数和官方资料来源 |
| `publishing.json` | Markdown、HTML、微信公众号导出规则   |

详细字段见 [配置指南](docs/configuration.md)。

## 内容

中文文章位于 `src/content/releases/`，英文文章位于 `src/content/releases/en/`。页面和 Feed 只包含 `status: published` 的内容。

自动文章使用版本级文件名，例如：

```text
src/content/releases/chrome-153-153-0-8000-1.md
src/content/releases/en/chrome-153-153-0-8000-1.md
```

自动流程不会改写现有人工文章。若功能说明暂时不可用，文章仍会使用官方版本数据完成发布，并明确链接到 Chrome Release Notes。

## 自动更新与部署

`.github/workflows/monitor-chrome.yml` 每天 01:00 UTC（北京时间 09:00）运行：

1. 从主接口获取三个桌面平台的 Stable 版本，每次请求最多尝试 3 次。
2. 主接口持续失败时，切换到 Chrome Version History API。
3. 与 `data/release-state.json` 比较；没有变化则正常结束。
4. 有变化时按受影响里程碑生成中英文文章。
5. 执行 `npm run check` 和 `npm run build`。
6. 只有验证全部通过才提交并推送默认分支。
7. 推送成功后调用独立的 `deploy-pages.yml` 部署刚刚验证过的提交。

流程不创建自动化分支或 Pull Request，不需要额外 Token。仓库必须允许 GitHub Actions 写入 Contents。

## GitHub Pages

首次启用步骤见 [部署指南](docs/deployment.md)。默认部署到 `/<repository-name>/`；自定义域名或用户主页仓库可设置：

```text
PAGES_BASE_PATH=/
SITE_URL=https://updates.example.com
```

## License

[MIT](LICENSE)
