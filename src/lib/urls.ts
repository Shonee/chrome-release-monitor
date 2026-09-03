export function withBase(
  pathname: string,
  base = import.meta.env.BASE_URL,
): string {
  if (/^https:\/\//.test(pathname)) return pathname;
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${pathname.replace(/^\//, "")}`;
}

export function isExternalUrl(value: string): boolean {
  return /^https:\/\//.test(value);
}
