import { describe, expect, it } from "vitest";
import {
  renderGenericHtml,
  renderWechatHtml,
} from "../scripts/lib/exporter.mjs";

const markdown = `# Chrome 152 更新指南

<script>alert('unsafe')</script>

> 建议尽快更新。

[安全链接](https://developer.chrome.com/)`;

describe("article exporters", () => {
  it("sanitizes generic HTML", async () => {
    const html = await renderGenericHtml(markdown);
    expect(html).toContain("Chrome 152 更新指南");
    expect(html).not.toContain("<script");
  });

  it("creates WeChat-compatible inline styles", async () => {
    const html = await renderWechatHtml(markdown, {
      fontFamily: "sans-serif",
      textColor: "#242424",
      accentColor: "#1a73e8",
      quoteColor: "#188038",
      maxWidth: "677px",
    });
    expect(html).toContain("style=");
    expect(html).toContain("border-left");
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});
