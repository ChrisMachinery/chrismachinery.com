"use client";

import type { ComponentProps } from "react";
import { useLocale } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type Href = ComponentProps<typeof Link>["href"];

function previewUrl(href: Href, locale: Locale) {
  return getPathname({ href: href as Parameters<typeof getPathname>[0]["href"], locale });
}

export function PreviewNavLink({
  href,
  className,
  children,
  onClick,
  locale: localeProp,
  ...rest
}: {
  href: Href;
  className?: string;
  children: React.ReactNode;
  onClick?: ComponentProps<typeof Link>["onClick"];
  locale?: Locale;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const currentLocale = useLocale() as Locale;
  const locale = localeProp ?? currentLocale;

  return (
    <Link
      href={href}
      {...(localeProp ? { locale: localeProp } : {})}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (window.self === window.top) return;
        event.preventDefault();
        event.stopPropagation();
        window.location.assign(previewUrl(href, locale));
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
