import { getTranslations } from "next-intl/server";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { SocialLink } from "@/components/layout/SocialLink";
import { getPageContent } from "@/lib/sanity/fetch";
import { resolveFooterSocialLinks } from "@/lib/socialLinks";
import { plainText, stegaText } from "@/lib/sanity/visual";
import type { ComponentProps } from "react";

type FooterHref = ComponentProps<typeof PreviewNavLink>["href"];

const muted = "text-sm leading-relaxed text-white/65";
const linkClass = "text-sm text-white/65 transition-colors hover:text-accent";

function splitPhones(value?: string) {
  return plainText(value || "")
    .split(/[;；]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const page = await getPageContent();
  const id = page?._id;
  const s = (path: string, text: string) => stegaText(id, "pageContent", path, text);
  const footer = page?.footerInfo;
  const socialLinks = resolveFooterSocialLinks(page?.footerSocialLinks);
  const email = footer?.email;
  const phones = splitPhones(footer?.phone);
  const navLeft: { href: FooterHref; label: string }[] = [
    { href: "/", label: plainText(n("home")) },
    { href: "/solutions", label: plainText(n("solutions")) },
    { href: "/about", label: plainText(n("about")) },
    { href: "/contact", label: plainText(n("contact")) },
  ];
  const navRight: { href: FooterHref; label: string }[] = [
    { href: "/products/pod", label: plainText(n("products")) },
    { href: "/customize", label: plainText(n("customize")) },
    { href: "/blog", label: plainText(n("blog")) },
  ];

  return (
    <footer className="mt-16 border-t border-white/10 bg-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-10 gap-y-3 px-4 py-14 sm:grid-cols-2 md:grid-cols-4">
        <p className="font-heading text-lg text-accent sm:col-span-2 md:col-span-1 md:col-start-1 md:row-start-1">
          {s("brandName", page?.brandName || "Chris Machinery")}
        </p>
        <div className="space-y-2 md:col-start-1 md:row-start-2">
          <p className={muted}>{s("footerBlurb", page?.footerBlurb || footer?.blurb || t("rights"))}</p>
          <p className={`${muted} whitespace-pre-line`}>{s("footerAddress", footer?.address || "Factory address")}</p>
          {email ? (
            <p className={muted}>
              <a className="transition-colors hover:text-accent" href={`mailto:${plainText(email)}`}>
                {s("footerEmail", email)}
              </a>
            </p>
          ) : null}
          {phones.map((num, i) => (
            <p key={num} className={muted}>
              <a className="transition-colors hover:text-accent" href={`tel:${num.replace(/[^\d+]/g, "")}`}>
                {i === 0 ? s("footerPhone", num) : num}
              </a>
            </p>
          ))}
        </div>
        <nav className="flex flex-col gap-2.5 md:col-start-2 md:row-start-2">
          {navLeft.map((item) => (
            <PreviewNavLink key={String(item.href)} href={item.href} className={linkClass}>
              {item.label}
            </PreviewNavLink>
          ))}
        </nav>
        <nav className="flex flex-col gap-2.5 md:col-start-3 md:row-start-2">
          {navRight.map((item) => (
            <PreviewNavLink key={String(item.href)} href={item.href} className={linkClass}>
              {item.label}
            </PreviewNavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 md:col-start-4 md:row-start-2">
          {socialLinks.map((item) => (
            <SocialLink
              key={`${item.key}-${item.index}`}
              socialKey={item.key}
              label={s(`footerSocialLinks[${item.index}].platform`, item.label)}
              url={item.url}
              documentId={id}
              index={item.index}
              className={linkClass}
            />
          ))}
        </div>
      </div>
    </footer>
  );
}
