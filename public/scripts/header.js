const root = document.documentElement;
const themeButton = document.querySelector("[data-theme-toggle]");
const dialog = document.querySelector("[data-search-dialog]");
const input = document.querySelector("[data-search-input]");
const items = [...document.querySelectorAll("[data-search-item]")];
const pagefindResults = document.querySelector("[data-pagefind-results]");
const empty = document.querySelector("[data-search-empty]");
const locale = dialog?.dataset.searchLocale || "zh-cn";
let pagefind = null;
let searchSequence = 0;

function createPagefindResult(data) {
  const anchor = document.createElement("a");
  const marker = document.createElement("span");
  const copy = document.createElement("span");
  const title = document.createElement("strong");
  const excerpt = document.createElement("small");
  anchor.className = "search-result";
  anchor.href = data.url;
  marker.className = "search-version";
  marker.textContent = "DOC";
  title.textContent =
    data.meta?.title || dialog?.dataset.searchFallbackTitle || "Chrome release";
  excerpt.textContent =
    data.excerpt?.replace(/<[^>]+>/g, "") ||
    dialog?.dataset.searchFallbackSummary ||
    "Matched in article content";
  copy.append(title, excerpt);
  anchor.append(marker, copy);
  return anchor;
}

async function searchPagefind(query, sequence, existingHrefs) {
  if (!dialog?.dataset.pagefindUrl || !pagefindResults) return 0;
  try {
    pagefind ||= await import(dialog.dataset.pagefindUrl);
    const response = await pagefind.search(query, {
      filters: { lang: locale },
    });
    if (sequence !== searchSequence) return 0;
    const resultData = await Promise.all(
      response.results.slice(0, 6).map((result) => result.data()),
    );
    if (sequence !== searchSequence) return 0;
    const uniqueResults = resultData.filter((data) => {
      const href = new URL(data.url, window.location.href).pathname;
      if (existingHrefs.has(href)) return false;
      existingHrefs.add(href);
      return true;
    });
    pagefindResults.replaceChildren(...uniqueResults.map(createPagefindResult));
    return uniqueResults.length;
  } catch (error) {
    console.info("Pagefind index is not available in this environment.", error);
    pagefindResults.replaceChildren();
    return 0;
  }
}

function setDialog(open) {
  dialog?.classList.toggle("is-open", open);
  dialog?.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) window.setTimeout(() => input?.focus(), 80);
}

themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("release-radar-theme", next);
});

document
  .querySelector("[data-locale-choice]")
  ?.addEventListener("click", (event) => {
    localStorage.setItem(
      "release-radar-locale",
      event.currentTarget.dataset.localeChoice,
    );
  });

document
  .querySelector("[data-search-open]")
  ?.addEventListener("click", () => setDialog(true));
document
  .querySelector("[data-search-close]")
  ?.addEventListener("click", () => setDialog(false));
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) setDialog(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setDialog(false);
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    setDialog(true);
  }
});
input?.addEventListener("input", async () => {
  const query = input.value.trim().toLowerCase();
  const sequence = ++searchSequence;
  let visible = 0;
  const existingHrefs = new Set();
  items.forEach((item) => {
    const matches = !query || item.dataset.keywords?.includes(query);
    item.hidden = !matches;
    if (matches) {
      visible += 1;
      if (item instanceof HTMLAnchorElement)
        existingHrefs.add(new URL(item.href).pathname);
    }
  });
  pagefindResults?.replaceChildren();
  if (query.length >= 2)
    visible += await searchPagefind(query, sequence, existingHrefs);
  if (empty) empty.hidden = visible > 0;
});
