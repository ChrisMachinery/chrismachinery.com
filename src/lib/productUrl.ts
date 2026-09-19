/** Public product URLs never include ?shape= / ?material= / other query. */

export function productPath(series: string, slug: string) {
  return `/products/${series}/${slug}`;
}

export function isProductDetailPath(pathname: string) {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] === "products") return parts.length === 3;
  if (["es", "fr", "ar"].includes(parts[0]) && parts[1] === "products") return parts.length === 4;
  return false;
}

export function cleanProductHref(raw: string | undefined, series: string, slug: string) {
  const fallback = productPath(series, slug);
  const value = (raw || "").trim();
  if (!value) return fallback;
  try {
    const absolute = /^https?:\/\//i.test(value);
    const url = absolute ? new URL(value) : new URL(value, "https://www.chrismachinery.com");
    if (isProductDetailPath(url.pathname)) {
      return absolute ? `${url.origin}${url.pathname}` : url.pathname.replace(/^\/(en)(?=\/)/, "") || url.pathname;
    }
  } catch {
    /* keep fallback */
  }
  if (value.includes("/products/") && value.includes("?")) {
    return value.slice(0, value.indexOf("?"));
  }
  return value;
}
