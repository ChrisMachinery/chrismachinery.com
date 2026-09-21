import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { getCustomizeOptions, getSolution, getSolutions } from "@/lib/sanity/fetch";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { MarkdownBody } from "@/components/media/MarkdownBody";
import { PortableText } from "@/components/sanity/PortableText";
import { Hreflang } from "@/components/seo/JsonLd";
import { cmsEdit, plainText, stegaText } from "@/lib/sanity/visual";
import { equipmentPackageTotal, withSearchParams } from "@/lib/solutionQuote";
import { uiText } from "@/lib/i18nCopy";
import { solutionTitles } from "@/data/localizedHome";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";
import type { ComponentProps } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getSolutions();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getSolution(slug);
  if (!item) return {};
  return withCanonical(locale, `/solutions/${item.slug}`, {
    title: `${item.name} Food Trailer Solution | Chris Machinery`,
    description: item.lede || item.advice,
  });
}

export default async function SolutionArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [item, options] = await Promise.all([getSolution(slug), getCustomizeOptions()]);
  if (!item) notFound();

  const s = (path: string, text: string) => stegaText(item._id, "solution", path, text);
  const title = uiText(locale, item.name, solutionTitles[locale]?.[item.slug] || item.name);
  const first = item.recommendedProducts[0];
  const quoteHref = withSearchParams("/contact", {
    solution: item.slug,
    product: first?.slug,
    from: `/solutions/${item.slug}`,
  }) as ComponentProps<typeof PreviewNavLink>["href"];
  const customizeHref = withSearchParams("/customize", {
    solution: item.slug,
    product: first?.slug,
  }) as ComponentProps<typeof PreviewNavLink>["href"];
  const packageUsd = equipmentPackageTotal(item.equipmentIds ?? [], options.kitchen);
  const hasCmsBody = Boolean(item.content?.length);

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Hreflang path={`/solutions/${item.slug}`} />
      <PreviewNavLink href="/solutions" className="text-sm font-semibold text-brand underline underline-offset-2">
        {t("solutions.backToCatalog")}
      </PreviewNavLink>
      <h1 className="type-page mt-4">{s("title", title)}</h1>
      <p className="type-lede mt-3">{s("lede", item.lede || item.advice)}</p>
      <ImgPlaceholder
        documentId={item._id}
        documentType="solution"
        path="sceneImage"
        label={`场景图 ${item.name} food trailer`}
        className="mt-8 min-h-56 w-full rounded-lg"
        src={item.imageUrl}
      />
      <div className="mt-8" {...cmsEdit(item._id, "solution", "content")}>
        {hasCmsBody ? (
          <PortableText value={item.content} documentId={item._id} documentType="solution" pathPrefix="content" />
        ) : (
          <MarkdownBody text={item.articleBody} />
        )}
      </div>

      <section className="mt-14 rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="type-section">{t("solutions.recommendedModels")}</h2>
        <ul className="type-body mt-3 list-disc ps-5">
          {item.recommendedProducts.slice(0, 3).map((product) => (
            <li key={product.slug}>
              <PreviewNavLink href={product.href} className="underline underline-offset-2">
                {plainText(product.name)}
              </PreviewNavLink>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-heading text-sm text-brand">{t("solutions.recommendedEquipment")}</p>
        <p className="type-body mt-2">{s("equipment", item.equipment.join(" · "))}</p>
        {packageUsd ? (
          <p className="mt-1 text-sm text-black/60">{t("solutions.packageFrom", { amount: packageUsd.toLocaleString() })}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <PreviewNavLink
            href={quoteHref}
            className="min-touch inline-flex items-center rounded bg-accent px-5 font-heading text-brand"
          >
            {t("solutions.quote")}
          </PreviewNavLink>
          <PreviewNavLink
            href={customizeHref}
            className="min-touch inline-flex items-center rounded border border-brand px-5 font-heading text-brand"
          >
            {t("cta.customize")}
          </PreviewNavLink>
        </div>
      </section>
    </article>
  );
}
