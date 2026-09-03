# 实现审查记录

审查日期：2026-09-03

## 审查范围

- Astro 页面、内容集合、配置 Schema 与静态链接。
- Chrome Stable 版本检测、文章草稿生成和状态去重。
- 独立 GitHub 图片仓库同步与安全边界。
- Markdown、通用 HTML、微信公众号 HTML 导出。
- GitHub Pages、Cloudflare Pages 和定时检测工作流。
- 桌面端与 `390×844` 手机视口交互。

## 已解决问题

- 定时检测不再因为 `lastCheckedAt` 变化而每 6 小时创建无意义 Pull Request。
- 任一平台版本变化都会更新状态文件和文章检测记录。
- 下载主来源不再固定标记为官方，而是按 `type` 配置显示来源类型。
- GitHub Pages 子路径已覆盖导航、文章、导出、Feed、Sitemap、脚本和 Pagefind。
- RSS 主页地址已包含仓库基础路径。
- 全文搜索改为浏览器原生加载构建后生成的 Pagefind 索引。
- Pagefind 脚本地址统一通过基础路径工具生成，避免 GitHub Pages 仓库子路径缺少分隔符而返回 404。
- 剪贴板权限失败时会展示并选中可手动复制的导出内容。

## 验证结果

- Astro：0 errors、0 warnings、0 hints。
- Vitest：5 个测试文件、15 项测试通过。
- GitHub Pages 子路径生产构建通过。
- Pagefind 成功索引文章正文，并可搜索正文关键词。
- Windows、macOS、Linux 下载标签切换正常。
- Markdown 导出复制内容正确。
- Chrome 144 至 152 的中英文共 18 篇文章进入对应语言的归档、Feed、导出和全文索引。
- 18 篇文章均配置 Chrome for Developers 官方封面、正式版时间和完整版本发布时间。
- 构建生成 39 个静态页面，Pagefind 分别建立 `zh-cn` 与 `en` 索引。
- 根路径可按浏览器语言选择站点，手动切换会保持当前页面并保存偏好。
- 浅色与深色主题正常，无浏览器控制台错误。
- 桌面端和手机端页面均无横向溢出。
- Wrangler 4.128.0 支持工作流使用的 `pages deploy`、`--project-name` 和 `--branch` 参数。

## 保留边界

- 示例文章用于展示页面与发布链路，正式公开前应继续按官方资料核验具体功能和安全修复数据。
- 国内社区入口和第三方镜像不代表 Google 官方背书，维护者需要定期更新 `checkedAt` 与状态。
- 图片同步默认关闭，需要单独创建资源仓库并配置最小权限 Token。
- 本次没有提交、推送、开启 GitHub Pages 或部署 Cloudflare Pages。
