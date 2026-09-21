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
  return loc === "/" ? SITE_URL : `${SITE_URL}${loc}`;
}

/** ISO 639-1 codes Google expects, plus x-default → English. */
export function localeLanguageMap(path: string) {
  const languages: Record<string, string> = {
    "x-default": localizedHref(routing.defaultLocale, path),
  };
  for (const locale of routing.locales) {
    languages[locale] = localizedHref(locale, path);
  }
  return languages;
}

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  ar: "ar_AE",
};

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
      locale: OG_LOCALE[locale] ?? "en_US",
      alternateLocale: routing.locales
        .filter((item) => item !== locale)
        .map((item) => OG_LOCALE[item] ?? item),
    },
  };
}
