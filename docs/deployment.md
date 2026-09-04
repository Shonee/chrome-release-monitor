# 部署指南

项目版本：0.1.0

部署日期：2026-09-04

## 部署方式

项目生成完全静态的 `dist/` 目录，可部署到 GitHub Pages 或 Cloudflare Pages：

- GitHub Pages：仓库已经包含自动部署工作流，适合直接使用当前发布链路。
- Cloudflare Pages 控制台导入：由 Cloudflare 监听 GitHub 仓库并自动构建，配置最少。
- GitHub Actions 部署 Cloudflare Pages：由 Actions 构建后直接上传，适合需要统一控制检查和部署步骤的场景。

GitHub Pages 与 Cloudflare Pages 可以同时启用，但默认分支每次更新会产生两次部署。如果只需要一个站点，应只启用选定平台的部署触发方式。

## GitHub Pages

### 首次配置

1. 进入仓库 **Settings > Pages**，将 Source 设置为 **GitHub Actions**。
2. 进入 **Settings > Actions > General > Workflow permissions**，选择 **Read and write permissions**。
3. 确认默认分支允许 `github-actions[bot]` 直接推送。若启用分支保护，需要为该自动化单独放行，否则监控任务会在推送阶段失败。
4. 手动运行一次 **Deploy GitHub Pages**，确认 Pages 环境和地址可用。
5. 手动运行一次 **Monitor Chrome releases**，确认采集权限与默认分支写入权限。

自动流程只使用仓库自带的 `GITHUB_TOKEN`，不需要个人访问令牌或额外 Secret。

### 构建地址

Pages 工作流默认使用：

```text
BASE_PATH=/<repository-name>
SITE_URL=https://<owner>.github.io
```

自定义域名或用户主页仓库通过 Repository Variables 覆盖：

```text
PAGES_BASE_PATH=/
SITE_URL=https://updates.example.com
```

### 自动发布顺序

```text
定时或手动监控
  -> 主源重试
  -> 备用源回退
  -> 无变化：成功结束
  -> 有变化：生成中英文文章
  -> npm run check
  -> npm run build
  -> 提交并推送默认分支
  -> 调用 deploy-pages.yml
  -> 按推送后的 commit SHA 再次构建并部署
```

监控工作流显式调用独立部署工作流，是因为 `GITHUB_TOKEN` 产生的普通 push 事件不会再次启动另一个 workflow。人工推送到 `master` 或 `main` 仍会直接触发 Pages 工作流。

### 故障与恢复

- 上游短暂失败：每个数据源最多尝试 3 次并指数退避。
- Chromium Dashboard 持续失败：自动切换 Version History API。
- Release Notes 失败：文章省略功能标题，版本发布继续。
- 三个平台任一无法从主备源取得数据：任务失败，不更新状态，不推送。
- 测试或构建失败：任务失败，不提交。
- 推送被拒绝：不 force push；处理分支保护或并发提交后重新运行。
- 部署失败：数据提交已经保留，可单独重新运行 **Deploy GitHub Pages**。
- 回滚：revert 对应的自动提交并推送默认分支，Pages 会部署回滚后的提交。

## Cloudflare Pages

Cloudflare Pages 通常部署在域名根路径，因此构建时应设置 `BASE_PATH=/`。`SITE_URL` 应填写最终的 `pages.dev` 地址或自定义域名，避免 Sitemap、RSS 和 JSON Feed 使用错误地址。

### 方法一：控制台导入 GitHub 仓库

该方法不需要新增 GitHub Actions 文件，也不需要在 GitHub 保存 Cloudflare API Token。

1. 登录 Cloudflare Dashboard，进入 **Workers & Pages**，选择创建 Pages 项目并连接 Git。
2. 授权 Cloudflare GitHub App 访问当前仓库，选择生产分支。当前仓库默认分支为 `master`。
3. 使用以下构建配置：

| 配置项                 | 值                 |
| ---------------------- | ------------------ |
| Framework preset       | Astro              |
| Build command          | `npm run build`    |
| Build output directory | `dist`             |
| Root directory         | 留空（仓库根目录） |

4. 在项目的构建环境变量中增加：

```text
NODE_VERSION=22
BASE_PATH=/
SITE_URL=https://<project-name>.pages.dev
```

5. 保存并执行首次部署。部署成功后检查生产地址，再按需在 **Custom domains** 中绑定自定义域名，并同步修改 `SITE_URL`。

Cloudflare Git 集成会监听默认分支。Chrome 监控工作流推送新文章后，Cloudflare 会自动开始构建；无版本变化时没有新提交，也不会触发部署。

### 方法二：通过 GitHub Actions 部署

该方法适用于 Cloudflare Pages Direct Upload 项目。先在 Cloudflare 创建 Pages 项目，再在仓库中配置：

- Repository Secret `CLOUDFLARE_API_TOKEN`：使用仅授予目标账户 **Cloudflare Pages: Edit** 的 API Token。
- Repository Secret `CLOUDFLARE_ACCOUNT_ID`：Cloudflare 账户 ID。
- Repository Variable `CLOUDFLARE_PAGES_PROJECT`：Pages 项目名称。
- Repository Variable `CLOUDFLARE_SITE_URL`：完整生产地址，例如 `https://chrome-release-monitor.pages.dev`。

以下内容是配置示例，不会在本项目中新增对应 YAML 文件：

```yaml
name: Deploy Cloudflare Pages

on:
  workflow_dispatch:
  push:
    branches: [master]

permissions:
  contents: read

concurrency:
  group: cloudflare-pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Validate
        run: npm run check

      - name: Build
        run: npm run build
        env:
          BASE_PATH: /
          SITE_URL: ${{ vars.CLOUDFLARE_SITE_URL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=${{ vars.CLOUDFLARE_PAGES_PROJECT }} --branch=${{ github.ref_name }}
```

如果默认分支不是 `master`，需要同步修改 `on.push.branches`。生产项目不要同时启用 Cloudflare Git 自动构建和上述 Direct Upload 工作流，否则同一次推送会触发重复部署。Cloudflare Pages 项目的 Git 集成模式与 Direct Upload 模式应在创建项目时确定；需要切换时建议新建项目并重新绑定域名。

### Cloudflare 故障排查

- 构建成功但静态资源 404：确认 `BASE_PATH=/`，然后重新部署。
- Sitemap 或 Feed 域名错误：确认 `SITE_URL` 是完整的 HTTPS 生产地址。
- Actions 返回鉴权错误：核对账户 ID、Token 所属账户和 **Cloudflare Pages: Edit** 权限，不要扩大 Token 权限。
- 项目名称不存在：确认 `CLOUDFLARE_PAGES_PROJECT` 与 Dashboard 中的项目名称完全一致。
- 自动采集有提交但 Cloudflare 未构建：控制台接入方式检查 GitHub App 仓库权限和生产分支；Actions 方式检查 workflow 的分支触发条件。

## 部署检查

重点检查：

```text
/
/zh-cn/
/en/
/archive/
/downloads/
/sources/
/rss.xml
/feed.json
/sitemap-index.xml
```

GitHub Pages 使用仓库子路径时，还应检查导航、搜索索引、导出文件和 Logo 地址是否保留 `BASE_PATH`。Cloudflare Pages 使用根路径时，应确认这些地址不包含 GitHub 仓库名路径前缀。

## 参考资料

- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/
- https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/
- https://github.com/cloudflare/wrangler-action
