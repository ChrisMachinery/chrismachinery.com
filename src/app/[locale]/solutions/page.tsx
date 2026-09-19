import { getTranslations, setRequestLocale } from "next-intl/server";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { getSitePage, getSolutions, getSolutionsBoardId, getCustomizeOptions } from "@/lib/sanity/fetch";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { DetailShotCarousel } from "@/components/home/DetailShotCarousel";
import { Hreflang } from "@/components/seo/JsonLd";
import { cmsEdit, plainText, stegaText } from "@/lib/sanity/visual";
import { equipmentPackageTotal, withSearchParams } from "@/lib/solutionQuote";
import { uiText } from "@/lib/i18nCopy";
import { solutionTitles } from "@/data/localizedHome";
import type { Metadata } from "next";
import type { ComponentProps } from "react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Custom Trailer Solutions & Equipment - Chris Machinery",
  description:
    "Turnkey coffee, fast food, ice cream, mobile bar and night market trailer setups.",
};

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [page, solutions, boardId, options] = await Promise.all([
    getSitePage("/solutions"),
    getSolutions(),
    getSolutionsBoardId(),
    getCustomizeOptions(),
  ]);
  const pageId = page?._id || "solutionsPage";
  const pageS = (path: string, text: string) => stegaText(page?._id, "sitePage", path, text);
  const photoCount = Math.max(6, page?.customerPhotos?.length ?? 0);
  const customerPhotos = Array.from({ length: photoCount }, (_, i) => {
    const cms = page?.customerPhotos?.[i];
    return {
      imageUrl: cms?.imageUrl,
      imageLabel: pageS(`customerPhotos[${i}].image`, "customer feedback"),
      alt: cms?.imageAlt,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path="/solutions" />
      <h1 className="type-page">{pageS("title", uiText(locale, page?.title, t("solutions.title")))}</h1>
      <p className="type-lede mt-3 w-full">
        {pageS("subtitle", uiText(locale, page?.subtitle, t("solutions.subtitle")))}
      </p>
      <div
        className="mt-10 grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
        {...cmsEdit(boardId, "solutionsBoard", "cards")}
      >
        {solutions.map((item) => {
          const s = (path: string, text: string) => stegaText(item._id, "solution", path, text);
          const first = item.recommendedProducts[0];
          const quoteHref = withSearchParams("/customize", {
            solution: item.slug,
            product: first?.slug,
          }) as ComponentProps<typeof PreviewNavLink>["href"];
          const packageUsd = equipmentPackageTotal(item.equipmentIds ?? [], options.kitchen);
          return (
            <article key={item.slug} className="card-hover flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-black/5 bg-white">
              <ImgPlaceholder
                documentId={item._id}
                documentType="solution"
                path="sceneImage"
                label={`场景图 ${item.name} food trailer`}
                className="aspect-[16/10] w-full shrink-0"
                src={item.imageUrl}
              />
              <div className="flex min-h-0 flex-1 flex-col p-5">
                <h2 className="type-sub line-clamp-1 min-h-[1.75rem]">
                  {s("title", uiText(locale, item.name, solutionTitles[locale]?.[item.slug] || item.name))}
                </h2>
                <p className="type-body mt-2">{t("solutions.recommendedModels")}</p>
                <ul className="type-body mt-2 min-h-[3.25rem] list-disc ps-5">
                  {item.recommendedProducts.slice(0, 2).map((product) => (
                    <li key={product.slug} className="line-clamp-1">
                      <PreviewNavLink href={product.href} className="underline">
                        {plainText(product.name)}
                      </PreviewNavLink>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-heading text-sm text-brand">{t("solutions.recommendedEquipment")}</p>
                <p className="type-body line-clamp-2 min-h-[2.5rem]">{s("equipment", item.equipment.join(" · "))}</p>
                <p className="mt-1 min-h-[1.25rem] text-sm text-black/60">
                  {packageUsd
                    ? t("solutions.packageFrom", { amount: packageUsd.toLocaleString() })
                    : "\u00a0"}
                </p>
                <PreviewNavLink
                  href={quoteHref}
                  className="mt-auto min-touch inline-flex items-center self-start rounded bg-accent px-5 font-heading text-brand"
                >
                  {t("solutions.quote")}
                </PreviewNavLink>
              </div>
            </article>
          );
        })}
      </div>
      <DetailShotCarousel
        documentId={pageId}
        documentType="sitePage"
        pathPrefix="customerPhotos"
        contained={false}
        showCaptions={false}
        ariaLabel="Customer feedback photos"
        heading={pageS("customerPhotosTitle", page?.customerPhotosTitle || t("solutions.feedback"))}
        slides={customerPhotos}
      />
    </div>
  );
}
