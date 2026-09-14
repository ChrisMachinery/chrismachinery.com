import { SITE_URL } from "@/lib/site";
import { routing } from "@/i18n/routing";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function hreflangLinks(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const clean = normalized === "/" ? "/" : normalized;
  return routing.locales.map((locale) => {
    const href =
      locale === routing.defaultLocale
        ? `${SITE_URL}${clean}`
        : `${SITE_URL}/${locale}${clean === "/" ? "" : clean}`;
    return { locale, href };
  });
}

export function Hreflang({ path }: { path: string }) {
  const links = hreflangLinks(path);
  const defaultHref = links.find((item) => item.locale === "en")?.href;
  return (
    <>
      {links.map((item) => (
        <link
          key={item.locale}
          rel="alternate"
          hrefLang={item.locale}
          href={item.href}
        />
      ))}
      {defaultHref ? (
        <link rel="alternate" hrefLang="x-default" href={defaultHref} />
      ) : null}
    </>
  );
}
