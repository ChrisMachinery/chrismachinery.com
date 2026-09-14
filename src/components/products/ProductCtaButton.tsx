"use client";

import type { ComponentProps, MouseEvent } from "react";
import { useLocale } from "next-intl";
import { Link, getPathname } from "@/i18n/navigation";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { cmsLinkEdit, plainText, stegaText } from "@/lib/sanity/visual";
import type { Locale } from "@/i18n/routing";

type AppHref = ComponentProps<typeof Link>["href"];

function followLinkPastOverlays(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.stopPropagation();
  if (typeof window === "undefined" || window.self === window.top) return;
  const url = event.currentTarget.href;
  if (!url) return;
  event.preventDefault();
  window.location.assign(url);
}

export function ProductCtaButton({
  documentId,
  textPath,
  linkPath,
  text,
  href,
  className,
  wrapClassName = "relative mt-3 block w-full",
  previewNavigates = false,
}: {
  documentId?: string;
  textPath: string;
  linkPath: string;
  text: string;
  href: string;
  className?: string;
  wrapClassName?: string;
  previewNavigates?: boolean;
}) {
  const locale = useLocale() as Locale;
  const cleanHref = plainText(href).trim();
  const label = previewNavigates
    ? plainText(text)
    : stegaText(documentId, "product", textPath, text);
  const linkMarker = previewNavigates ? null : stegaText(documentId, "product", linkPath, cleanHref || "link");
  const edit = previewNavigates ? undefined : cmsLinkEdit(documentId, "product", linkPath);
  const isExternal = cleanHref.startsWith("http://") || cleanHref.startsWith("https://");
  let internalPath = cleanHref;
  if (!isExternal && cleanHref) {
    try {
      internalPath = getPathname({ href: cleanHref as Parameters<typeof getPathname>[0]["href"], locale });
    } catch {
      internalPath = cleanHref;
    }
  }

  if (previewNavigates) {
    return (
      <span className={wrapClassName}>
        <a
          href={isExternal ? cleanHref : internalPath}
          className={`${className ?? ""} relative z-[2]`.trim()}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
          onClickCapture={followLinkPastOverlays}
        >
          {label}
        </a>
      </span>
    );
  }

  return (
    <span className={wrapClassName} {...edit}>
      {isExternal ? (
        <a href={cleanHref} className={className} target="_blank" rel="noreferrer">
          {label}
        </a>
      ) : (
        <PreviewNavLink href={cleanHref as AppHref} className={className}>
          {label}
        </PreviewNavLink>
      )}
      {linkMarker ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden text-[0px] text-transparent"
        >
          {linkMarker}
        </span>
      ) : null}
    </span>
  );
}
