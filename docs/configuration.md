# 配置指南

配置文件使用 JSON。站点构建时通过 Zod 校验字段、枚举和 URL，错误配置会直接中止构建。

## 站点配置

`config/site.json` 管理品牌、描述、导航、仓库地址、RSS 和首页文案。内部链接以 `/` 开头，外部链接必须使用 HTTPS。

`translations.en` 保存英文站点文案。站点支持 `zh-cn` 和 `en`，Pagefind、RSS、JSON Feed 和文章导出均按语言生成。

## 下载来源

`config/downloads.json` 按 `windows`、`macos`、`linux` 分组。每个平台包含一个 `primary` 和若干 `alternatives`。

来源类型包括 `official`、`mirror`、`community`、`enterprise`、`cloud` 和 `custom`；状态包括 `verified`、`monitoring`、`degraded`、`planned` 和 `unverified`。

设置 `enabled: false` 可以隐藏来源。默认只接受 HTTPS。页面不会自动核验网盘密码、有效期或安装包签名，这些信息仍由维护者负责。

## 采集配置

`config/sources.json` 的核心字段：

| 字段                      | 说明                                                               |
| ------------------------- | ------------------------------------------------------------------ |
| `releaseEndpoint`         | Chromium Dashboard 主接口，`{platform}` 替换为 Windows、Mac、Linux |
| `fallbackReleaseEndpoint` | Chrome Version History 回退接口                                    |
| `fallbackPlatformMap`     | 将页面平台名映射为回退接口的平台参数                               |
| `platforms`               | 需要完整获取的平台列表                                             |
| `requestTimeoutMs`        | 每次网络请求的超时                                                 |
| `maxAttempts`             | 每个数据源的最大尝试次数，范围 1 到 5                              |
| `retryBaseDelayMs`        | 指数退避的初始等待时间                                             |
| `userAgent`               | 请求标识                                                           |
| `officialSources`         | Release Notes、Chrome Releases 等页面来源                          |

采集器只对超时、网络错误、429 和 5xx 重试；其他 4xx 立即失败。主源耗尽重试后切换备用源。Release Notes 仅用于补充功能标题，即使不可用也不会阻塞版本文章生成。

GitHub Actions 的 Cron 表达式位于 workflow YAML，因为调度器不会在任务启动前读取 JSON 配置。

## 文章字段

- `publishedAt`：文章生成时间。
- `updatedAt`：文章最后更新时间。
- `stableReleasedAt`：主接口可提供时取官方发布时间，否则取检测时间。
- `versionReleasedAt`：当前完整版本的官方发布时间或检测时间。
- `generatedBy`：自动文章固定为 `chrome-release-monitor`。
- `status`：自动文章为 `published`，人工文章仍可使用 `draft`、`review`、`published`。

自动文章不要求封面图；人工文章仍可使用 `images` 展示官方图片和来源。

## 发布格式

`config/publishing.json` 管理导出目录和微信公众号样式。微信公众号导出会内联 CSS，并清理脚本、危险协议和未允许标签。
