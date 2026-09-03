# Contributing

感谢参与 Release Radar for Chrome。

## 本地开发

```bash
npm install
npm run check
npm run build
```

## 内容贡献

- 更新文章必须保留官方来源链接。
- 不要把社区镜像描述为 Google 官方来源。
- 功能图片使用文章 `images` 元数据和外部资源仓库，不直接提交到主仓库。
- 自动创建的 `status: draft` 文章需要人工核验后才能改为 `published`。

## 代码贡献

- 配置项进入 `config/*.json` 和对应 Schema，不在组件中复制业务常量。
- 新增采集或导出行为时补充 Vitest 测试。
- 提交前运行 `npm run check`、`npm run build` 和 `git diff --check`。
- 不要在同一个 Pull Request 中混入无关重构或生成文件。
