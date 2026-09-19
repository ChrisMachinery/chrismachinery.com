import { getProduct } from "@/data/products";
import { SITE_URL } from "@/lib/site";

function stripLocale(pathname: string) {
  return pathname.replace(/^\/(en|es|fr|ar)(?=\/|$)/, "") || "/";
}

export function localePrefix(locale?: string) {
  if (!locale || locale === "en") return "";
  return `/${locale}`;
}

export function isInquiryFormPath(pathname: string) {
  const stripped = stripLocale(pathname);
  return stripped === "/contact" || stripped.startsWith("/contact/");
}

export function requestOrigin(headers: Headers) {
  const origin = headers.get("origin")?.replace(/\/$/, "");
  if (origin) return origin;
  const host = headers.get("x-forwarded-host") || headers.get("host") || "";
  const proto = headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host.split(",")[0].trim()}`;
  return SITE_URL.replace(/\/$/, "");
}

function toSiteUrl(raw: string, origin: string) {
  try {
    const url = raw.startsWith("http") ? new URL(raw) : new URL(raw, origin);
    if (isInquiryFormPath(url.pathname)) return "";
    return `${origin}${url.pathname}${url.hash}`;
  } catch {
    return "";
  }
}

export function resolveInquirySourceUrl(input: {
  origin: string;
  locale?: string;
  submitted?: string;
  referer?: string;
  productSlug?: string;
  productSeries?: string;
  stock?: boolean;
  stockId?: string;
  solutionSlug?: string;
}) {
  const origin = (input.origin || SITE_URL).replace(/\/$/, "");
  const submitted = input.submitted ? toSiteUrl(input.submitted, origin) : "";
  if (submitted) return submitted;
  const referer = input.referer ? toSiteUrl(input.referer, origin) : "";
  if (referer) return referer;

  const prefix = localePrefix(input.locale);
  if (input.stock) {
    const hash = input.stockId ? `#stock-${input.stockId}` : "";
    return `${origin}${prefix}/products/in-stock${hash}`;
  }
  if (input.solutionSlug) {
    return `${origin}${prefix}/solutions`;
  }
  const series =
    input.productSeries || (input.productSlug ? getProduct(input.productSlug)?.series : undefined);
  if (series && input.productSlug) {
    return `${origin}${prefix}/products/${series}/${input.productSlug}`;
  }
  return "";
}
