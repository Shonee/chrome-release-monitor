# Security Policy

## 报告安全问题

请通过 GitHub Security Advisory 私下报告凭据泄露、脚本注入、供应链风险、下载源劫持或资源同步漏洞。不要先创建公开 Issue。

## 下载来源边界

本站只整理和展示下载入口，不托管 Chrome 安装包。第三方镜像、网盘和自定义链接不代表 Google 背书。用户仍需核对最终域名、版本号、数字签名和文件哈希。

## 自动化凭据

- `GITHUB_TOKEN` 只用于当前仓库的自动化分支和 Pull Request。
- `ASSET_REPO_TOKEN` 只授予独立资源仓库 Contents 写权限。
- `CLOUDFLARE_API_TOKEN` 只授予目标账户的 Pages Edit 权限。
- 不接受在配置文件、文章或日志中提交任何 Token。
