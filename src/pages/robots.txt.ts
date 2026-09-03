export function GET({ site }: { site?: URL }) {
  const origin = site || new URL("https://example.com");
  const sitemap = new URL(
    `${import.meta.env.BASE_URL}sitemap-index.xml`.replace(/\/+/g, "/"),
    origin,
  );
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
