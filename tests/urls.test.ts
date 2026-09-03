import { describe, expect, it } from "vitest";
import { withBase } from "../src/lib/urls";

describe("site URLs", () => {
  it("keeps a separator between a deployment base and static assets", () => {
    expect(withBase("/pagefind/pagefind.js", "/chrome-release-monitor")).toBe(
      "/chrome-release-monitor/pagefind/pagefind.js",
    );
  });
});
