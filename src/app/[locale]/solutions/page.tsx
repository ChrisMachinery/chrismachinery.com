import { getTranslations, setRequestLocale } from "next-intl/server";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { getSitePage, getSolutions, getSolutionsBoardId } from "@/lib/sanity/fetch";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { DetailShotCarousel } from "@/components/home/DetailShotCarousel";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import { solutionTitles } from "@/data/localizedHome";
import type { Metadata } from "next";
import { withCanonical } from "@/lib/seoCanonical";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return withCanonical(locale, "/solutions", {
    title: "Custom Trailer Solutions & Equipment - Chris Machinery",
    description:
      "Coffee, fast food, ice cream, mobile bar and night market trailer chapters. Open a card for the full article, then get a quote.",
  });
}

export default async function SolutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [page, solutions, boardId] = await Promise.all([
    getSitePage("/solutions"),
    getSolutions(),
    getSolutionsBoardId(),
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
  const catalogSubtitle =
    "Menu chapters, not a quote sheet. Open a card for the 800–1500 word article, recommended models, and Get Quote.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="type-page">{pageS("title", uiText(locale, page?.title, t("solutions.title")))}</h1>
      <p className="type-lede mt-3 w-full">
        {pageS("subtitle", uiText(locale, page?.subtitle, t("solutions.subtitle") || catalogSubtitle))}
      </p>
      <div
        className="mt-10 grid auto-rows-fr grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3"
        {...cmsEdit(boardId, "solutionsBoard", "cards")}
      >
        {solutions.map((item) => {
          const s = (path: string, text: string) => stegaText(item._id, "solution", path, text);
          const title = uiText(locale, item.name, solutionTitles[locale]?.[item.slug] || item.name);
          return (
            <article key={item.slug} className="card-hover flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-black/5 bg-white">
              <PreviewNavLink href={`/solutions/${item.slug}`} className="flex h-full min-h-0 flex-col">
                <ImgPlaceholder
                  documentId={item._id}
                  documentType="solution"
                  path="sceneImage"
                  alt={`${title} food trailer`}
                  className="aspect-[16/10] w-full shrink-0"
                  src={item.imageUrl}
                />
                <div className="flex min-h-0 flex-1 flex-col p-5">
                  <h2 className="type-sub line-clamp-2 min-h-[3.5rem]">{s("title", title)}</h2>
                  <p className="type-body mt-3 line-clamp-4 flex-1">{s("lede", item.lede || item.advice)}</p>
                  <span className="mt-6 min-touch inline-flex items-center self-start rounded bg-accent px-5 font-heading text-brand">
                    {t("solutions.readArticle")}
                  </span>
                </div>
              </PreviewNavLink>
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
