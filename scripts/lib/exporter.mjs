import juice from "juice";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const sanitizeOptions = {
  allowedTags: [
    "article",
    "section",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "a",
    "strong",
    "em",
    "blockquote",
    "ul",
    "ol",
    "li",
    "pre",
    "code",
    "hr",
    "br",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel", "style"],
    img: ["src", "alt", "title", "width", "height", "style"],
    "*": ["class", "style"],
  },
  allowedSchemes: ["https"],
  allowedSchemesByTag: { img: ["https"] },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, target: "_blank", rel: "noreferrer noopener" },
    }),
  },
};

async function markdownToSafeHtml(markdown) {
  const rendered = await marked.parse(markdown, { gfm: true, breaks: false });
  return sanitizeHtml(rendered, sanitizeOptions);
}

export async function renderGenericHtml(markdown) {
  const html = await markdownToSafeHtml(markdown);
  return `<article class="release-article">${html}</article>`;
}

export async function renderWechatHtml(markdown, theme) {
  const html = await markdownToSafeHtml(markdown);
  const css = `
    .wechat-article { max-width: ${theme.maxWidth}; margin: 0 auto; color: ${theme.textColor}; font-family: ${theme.fontFamily}; font-size: 16px; line-height: 1.85; }
    .wechat-article h1 { margin: 0 0 24px; color: ${theme.textColor}; font-size: 28px; line-height: 1.35; }
    .wechat-article h2 { margin: 36px 0 14px; color: ${theme.textColor}; font-size: 22px; line-height: 1.4; }
    .wechat-article h3 { margin: 28px 0 12px; color: ${theme.textColor}; font-size: 18px; line-height: 1.5; }
    .wechat-article p { margin: 14px 0; }
    .wechat-article a { color: ${theme.accentColor}; text-decoration: none; }
    .wechat-article blockquote { margin: 22px 0; padding: 14px 16px; border-left: 3px solid ${theme.quoteColor}; background: #f4faf5; color: #3c4043; }
    .wechat-article pre { margin: 20px 0; padding: 16px; overflow-wrap: anywhere; background: #161b22; color: #e6edf3; font-size: 13px; line-height: 1.65; }
    .wechat-article code { font-family: SFMono-Regular, Consolas, monospace; }
    .wechat-article img { display: block; max-width: 100%; height: auto; margin: 20px auto; }
    .wechat-article table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .wechat-article th, .wechat-article td { padding: 9px; border: 1px solid #dadce0; text-align: left; }
  `;
  return juice.inlineContent(
    `<section class="wechat-article">${html}</section>`,
    css,
    {
      removeStyleTags: true,
      preserveMediaQueries: false,
    },
  );
}
