import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

/** Locale-prefixed public path. English (default) has no prefix. */
export function localizedPath(locale: string, path: string) {
  const clean = !path || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

export function localizedHref(locale: string, path: string) {
  const loc = localizedPath(locale, path);
  return loc === "/" ? `${SITE_URL}/` : `${SITE_URL}${loc}`;
}

export function localeLanguageMap(path: string) {
  const languages: Record<string, string> = {
    "x-default": localizedHref(routing.defaultLocale, path),
  };
  for (const locale of routing.locales) {
    languages[locale] = localizedHref(locale, path);
  }
  return languages;
}

export function withCanonical(locale: string, path: string, meta: Metadata = {}): Metadata {
  const url = localizedHref(locale, path);
  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      canonical: url,
      languages: localeLanguageMap(path),
    },
    openGraph: {
      ...meta.openGraph,
      url,
    },
  };
}
