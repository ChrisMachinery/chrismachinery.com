import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { InStockBoard } from "@/components/products/InStockBoard";
import { SeriesArcGuide } from "@/components/products/SeriesArcGuide";
import { CatalogSeriesGuide } from "@/components/products/CatalogSeriesGuide";
import { faqJsonLd, isGuideSeries, resolveSeriesFaq, SERIES_GUIDE_DEFAULTS } from "@/lib/seriesGuides";
import { AIRSTREAM_ARC_GUIDE_DEFAULTS, AIRSTREAM_ARC_IMAGES } from "@/lib/airstreamArc";
import { POD_SHAPE_GUIDE_DEFAULTS, POD_SHAPE_IMAGES } from "@/lib/podShapeGuide";
import { Hreflang, JsonLd } from "@/components/seo/JsonLd";
import { getProductsBySeries, getSitePage, getStockBoardId, getStockCards } from "@/lib/sanity/fetch";
import { seriesList, seriesMeta, type SeriesSlug } from "@/lib/site";
import { productJsonLd } from "@/lib/seo";
import { stegaText } from "@/lib/sanity/visual";
import { uiText } from "@/lib/i18nCopy";
import { localizedAirstreamGuide, localizedPodGuide, localizedSeries } from "@/data/localizedHome";
import type { Product } from "@/data/products";
import type { Metadata } from "next";

export const revalidate = 60;

export function generateStaticParams() {
  return seriesList.map((series) => ({ series }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series } = await params;
  if (series === "in-stock") {
    return {
      title: "In Stock Food Trailers | Chris Machinery",
      description: "Cross-series units available for immediate shipment.",
    };
  }
  if (isGuideSeries(series)) {
    const guide = SERIES_GUIDE_DEFAULTS[series];
    return {
      title: guide.metaTitle,
      description: guide.metaDescription,
    };
  }
  const meta = seriesMeta[series as Exclude<SeriesSlug, "in-stock">];
  if (!meta) return {};
  return {
    title: `${meta.name} for Sale | Custom Manufacturer - Chris Machinery`,
    description: `Explore our ${meta.name}. Factory-built, CE certified. Get a quote today!`,
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ locale: string; series: string }>;
}) {
  const { locale, series } = await params;
  setRequestLocale(locale);
  if (!seriesList.includes(series as SeriesSlug)) notFound();

  const isStock = series === "in-stock";
  const isOthers = series === "others";
  const [items, stockCards, stockBoardId]: [Product[], Awaited<ReturnType<typeof getStockCards>>, string] = isStock
    ? [[], await getStockCards(), await getStockBoardId()]
    : [
        await getProductsBySeries(isOthers ? "others" : (series as "pod")),
        [],
        "stockBoard",
      ];
  const seriesCopy = localizedSeries[locale]?.[series] || localizedSeries.en[series] || {
    title: series,
    blurb: "",
  };
  const title = seriesCopy.title;
  const blurb = seriesCopy.blurb;
  const page = await getSitePage(`/products/${series}`);
  const s = (path: string, text: string) => stegaText(page?._id, "sitePage", path, text);
  const airstreamGuide = localizedAirstreamGuide[locale] ?? AIRSTREAM_ARC_GUIDE_DEFAULTS;
  const podGuide = localizedPodGuide[locale] ?? POD_SHAPE_GUIDE_DEFAULTS;
  const guideSeries = isGuideSeries(series) ? series : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path={`/products/${series}`} />
      {items.slice(0, 3).map((item) => (
        <JsonLd key={item.sku} data={productJsonLd(item)} />
      ))}
      {guideSeries ? <JsonLd data={faqJsonLd(resolveSeriesFaq(guideSeries, page?.podGuide))} /> : null}
      <h1 className="type-page">{s("title", uiText(locale, page?.title, title))}</h1>
      {guideSeries ? null : (
        <p className="type-lede mt-3 max-w-3xl">{s("subtitle", uiText(locale, page?.subtitle, blurb))}</p>
      )}
      {guideSeries ? (
        <CatalogSeriesGuide
          series={guideSeries}
          documentId={page?._id}
          cms={page?.podGuide}
          shapeGuide={
            series === "pod" ? (
              <SeriesArcGuide
                documentId={page?._id}
                title={uiText(locale, page?.arcGuideTitle, podGuide.title)}
                note={uiText(locale, page?.arcGuideNote, podGuide.note)}
                items={
                  locale === "en"
                    ? page?.arcGuides
                    : podGuide.items.map((item, i) => ({
                        ...item,
                        imageUrl: page?.arcGuides?.[i]?.imageUrl,
                        imageAlt: page?.arcGuides?.[i]?.imageAlt,
                      }))
                }
                defaults={podGuide}
                imageAlts={POD_SHAPE_IMAGES}
                sectionId="shape-guide"
                placeholderSuffix="造型示意 · 4:3 · 1200×900 JPG"
                columns={2}
                imageAspectClass="aspect-[4/3]"
              />
            ) : series === "airstream" ? (
              <SeriesArcGuide
                documentId={page?._id}
                title={uiText(locale, page?.arcGuideTitle, airstreamGuide.title)}
                note={uiText(locale, page?.arcGuideNote, airstreamGuide.note)}
                items={
                  locale === "en"
                    ? page?.arcGuides
                    : airstreamGuide.items.map((item, i) => ({
                        ...item,
                        imageUrl: page?.arcGuides?.[i]?.imageUrl,
                        imageAlt: page?.arcGuides?.[i]?.imageAlt,
                      }))
                }
                defaults={airstreamGuide}
                imageAlts={AIRSTREAM_ARC_IMAGES}
                sectionId="arc-guide"
                placeholderSuffix="弧度示意 · 5:2 · 1000×400 JPG"
                columns={3}
              />
            ) : undefined
          }
        />
      ) : null}
      {isStock ? (
        <InStockBoard boardId={stockBoardId} cards={stockCards} />
      ) : (
        <div id="series-catalog" className="mt-10 scroll-mt-24">
          <ProductCatalog
            series={isOthers ? "others" : (series as "pod")}
            items={items}
            mode={isOthers ? "others" : "filter"}
          />
        </div>
      )}
    </div>
  );
}
