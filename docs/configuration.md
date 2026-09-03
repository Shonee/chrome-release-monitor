# 配置指南

配置文件使用 JSON，启动开发服务或执行构建时会经过 Zod Schema 校验。字段缺失、枚举错误或不安全 URL 会使构建失败，而不是静默回退到组件中的硬编码值。

## 站点配置

`config/site.json` 管理品牌名、产品名、描述、Logo、导航、仓库地址、RSS 和首页主要文案。内部链接以 `/` 开头，外部链接必须使用 HTTPS。

部署到 GitHub Pages 子路径时无需修改导航，构建会通过 `BASE_PATH` 自动添加仓库路径。

`translations.en` 保存英文站点标题、描述、导航和首页文案。基础字段作为简体中文版本；英文配置缺失会使构建失败，避免公开页面出现不完整导航。

## 多语言行为

站点当前支持 `zh-cn` 和 `en`：

1. `/` 和旧的无语言页面路径在浏览器端读取已保存偏好。
2. 没有偏好时，`navigator.languages` 中存在 `zh` 开头语言则进入 `/zh-cn/`，否则进入 `/en/`。
3. 顶部语言按钮保持当前页面路径并切换语言，同时写入 `release-radar-locale`。
4. 中文文章使用默认 `locale: zh-cn`；英文文章必须显式设置 `locale: en`。
5. Pagefind、RSS、JSON Feed 和文章导出均按语言生成。

英文文章位于 `src/content/releases/en/`。同一里程碑的中英文文件应保持 `version`、发布时间、来源和图片一致，标题、摘要、重点功能与正文分别翻译。

## 下载来源

`config/downloads.json` 按 `windows`、`macos`、`linux` 分组。每个平台包含一个 `primary` 和任意数量的 `alternatives`。

```json
{
  "id": "team-macos-share",
  "name": "团队维护的 macOS 备用包",
  "provider": "Project Maintainer",
  "type": "cloud",
  "url": "https://example.com/chrome-macos-share",
  "enabled": true,
  "status": "verified",
  "checkedAt": "2026-09-03",
  "formats": ["DMG", "网盘"],
  "description": "维护者完成签名和版本核验的备用地址。",
  "actionLabel": "打开备用下载"
}
```

可用 `type`：

- `official`：Google 官方渠道。
- `mirror`：第三方镜像站。
- `community`：社区索引或代理入口。
- `enterprise`：Chrome Enterprise 下载。
- `cloud`：OSS、网盘或对象存储。
- `custom`：其他自定义 HTTPS 地址。

可用 `status`：`verified`、`monitoring`、`degraded`、`planned`、`unverified`。

设置 `enabled: false` 可以隐藏来源。默认只接受 HTTPS；确需展示 HTTP 内网地址时，需要同时设置顶层 `allowHttp: true`，公开站点不建议启用。

页面不会判断网盘密码、有效期或文件签名，这些信息应写入 `description`，并由维护者定期核验。

下载源可直接增加可选英文覆盖：

```json
{
  "name": "团队维护的备用包",
  "description": "维护者核验的备用地址。",
  "actionLabel": "打开备用下载",
  "translations": {
    "en": {
      "name": "Maintainer fallback package",
      "description": "A fallback location reviewed by the maintainers.",
      "actionLabel": "Open fallback download"
    }
  }
}
```

`translations.en` 未配置时，英文页面回退到基础字段，因此新增自定义地址不会因为缺少翻译而消失。

页面会忽略 JSON 数组中的原始顺序，按照以下规则稳定展示备选下载源：

1. `enterprise` 企业下载页。
2. `mirror`、`community` 国内第三方镜像或社区入口。
3. `custom`、`cloud` 自定义直链、对象存储或网盘。

未配置的类型不会生成占位区域，`enabled: false` 的来源不会展示。

## 采集来源

`config/sources.json` 支持两类 JSON 接口：

- `chromiumdash`：Chromium Dashboard 发布接口。
- `versionhistory`：Chrome VersionHistory API。

`releaseEndpoint` 使用 `{platform}` 占位符。采集脚本会根据 `platforms` 逐个平台请求，并使用 `requestTimeoutMs` 控制超时。

GitHub Actions 的 Cron 表达式仍位于工作流 YAML，因为 GitHub 调度器不会在启动任务前读取仓库 JSON 配置。

## 图片资源

`config/assets.json` 默认 `enabled: false`。启用后需要：

1. 创建独立公开资源仓库。
2. 修改 `repository`、`branch` 与 `cdnBaseUrl`。
3. 创建只拥有资源仓库 Contents 写权限的细粒度 Token。
4. 将 Token 保存为仓库 Secret `ASSET_REPO_TOKEN`。
5. 在文章 `images` 中设置 `mirror: true`。

```yaml
images:
  - src: https://developer.chrome.com/static/example.png
    alt: Chrome 功能界面
    mirror: true
```

脚本会校验 HTTPS、来源域名、MIME 和大小，在内存中计算 SHA-256，并使用内容哈希作为资源文件名。

所有 `published` 文章必须至少配置一张图片。第一张图片会作为文章封面，并进入 Markdown、通用 HTML 和微信公众号 HTML 导出；其余图片显示在正文末尾。

即使图片仓库尚未启用，也可以验证文章中的官方图片是否可下载：

```bash
npm run sync:assets -- --dry-run
```

正式同步后，脚本会把 `src` 替换为 `cdnBaseUrl` 下的 GitHub CDN 地址，并把原始官方地址保存在 `officialSource`。图片二进制只在内存中处理，不会写入主仓库目录。

## 文章时间字段

- `publishedAt`：本站文章首次发布或录入时间。
- `updatedAt`：本站文章最后编辑时间。
- `stableReleasedAt`：该 Chrome 里程碑正式进入 Stable 渠道的时间。
- `versionReleasedAt`：文章中 `version` 对应完整版本的官方发布时间。

## 发布格式

`config/publishing.json` 管理导出目录和微信公众号样式。微信公众号导出会将 CSS 内联到元素，并清理脚本、危险协议和未允许标签。
