"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { productNavItems } from "@/lib/site";

const localeLabel: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  ar: "العربية",
};

export function Header({
  cms,
}: {
  cms?: {
    documentId?: string;
    logoUrl?: string;
    brand: string;
    home: string;
    products: string;
    solutions: string;
    about: string;
    customize: string;
    blog: string;
    contact: string;
  };
}) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  useEffect(() => {
    setProdOpen(false);
    setLangOpen(false);
    setOpen(false);
  }, [pathname]);

  const links = [
    { href: "/", label: cms?.home ?? t("home") },
    { href: "/products/pod", label: cms?.products ?? t("products"), mega: true },
    { href: "/solutions", label: cms?.solutions ?? t("solutions") },
    { href: "/about", label: cms?.about ?? t("about") },
    { href: "/customize", label: cms?.customize ?? t("customize") },
    { href: "/blog", label: cms?.blog ?? t("blog") },
    { href: "/contact", label: cms?.contact ?? t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex min-h-11 items-center gap-3">
          <ImgPlaceholder
            documentId={cms?.documentId}
            documentType="pageContent"
            path="logo"
            label="网站Logo"
            className="h-10 w-10 shrink-0 rounded-sm"
            src={cms?.logoUrl}
          />
          <PreviewNavLink href="/" className="font-heading text-sm font-bold text-brand">
            {cms?.brand ?? "Chris Machinery"}
          </PreviewNavLink>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((item) =>
            "mega" in item && item.mega ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setProdOpen(true)}
                onMouseLeave={() => setProdOpen(false)}
              >
                <PreviewNavLink
                  href={item.href}
                  className="min-touch inline-flex items-center px-3 text-sm font-semibold text-brand hover:text-black"
                >
                  {item.label}
                </PreviewNavLink>
                {prodOpen ? (
                  <div className="absolute left-0 top-full z-50 w-48 rounded-md border border-black/10 bg-white p-2 shadow-lg">
                    {productNavItems.map((p) => (
                      <PreviewNavLink
                        key={p.href}
                        href={p.href}
                        className="min-touch flex items-center rounded px-3 text-sm hover:bg-accent/40"
                        onClick={() => setProdOpen(false)}
                      >
                        {p.label}
                      </PreviewNavLink>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <PreviewNavLink
                key={item.href}
                href={item.href}
                className={`min-touch inline-flex items-center px-3 text-sm font-semibold hover:text-black ${
                  pathname === item.href ? "text-black" : "text-brand"
                }`}
              >
                {item.label}
              </PreviewNavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              className="min-touch rounded border border-black/10 px-3 text-sm font-semibold"
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Language"
            >
              {localeLabel[locale]}
            </button>
            {langOpen ? (
              <div className="absolute end-0 mt-1 w-40 rounded-md border border-black/10 bg-white p-1 shadow-lg">
                {routing.locales.map((code) => (
                  <Link
                    key={code}
                    href={pathname}
                    locale={code}
                    className="min-touch flex items-center rounded px-3 text-sm hover:bg-accent/40"
                    onClick={() => setLangOpen(false)}
                  >
                    {localeLabel[code]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="min-touch lg:hidden rounded border border-black/10 px-3 text-xl"
            aria-label="Menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 end-0 w-[min(100%,20rem)] bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="min-touch mb-6 font-semibold" onClick={() => setOpen(false)}>
              ✕
            </button>
            <div className="flex flex-col gap-2">
              {links.map((item) => (
                <PreviewNavLink
                  key={item.href}
                  href={item.href}
                  className="min-touch flex items-center text-lg font-heading"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </PreviewNavLink>
              ))}
              <p className="mt-4 text-xs uppercase tracking-wide text-foreground">Products</p>
              {productNavItems.map((p) => (
                <PreviewNavLink
                  key={p.href}
                  href={p.href}
                  className="min-touch flex items-center ps-3"
                  onClick={() => setOpen(false)}
                >
                  {p.label}
                </PreviewNavLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
