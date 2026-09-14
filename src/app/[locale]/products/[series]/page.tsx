import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { SeriesArcGuide } from "@/components/products/SeriesArcGuide";
import { AIRSTREAM_ARC_GUIDE_DEFAULTS, AIRSTREAM_ARC_IMAGES } from "@/lib/airstreamArc";
import { POD_SHAPE_GUIDE_DEFAULTS, POD_SHAPE_IMAGES } from "@/lib/podShapeGuide";
import { Hreflang, JsonLd } from "@/components/seo/JsonLd";
import { getInStockProducts, getProductsBySeries, getSitePage } from "@/lib/sanity/fetch";
import { seriesList, seriesMeta, type SeriesSlug } from "@/lib/site";
import { productJsonLd } from "@/lib/seo";
import { stegaText } from "@/lib/sanity/visual";
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
  const items = isStock
    ? await getInStockProducts()
    : await getProductsBySeries(isOthers ? "others" : (series as "pod"));
  const title = isStock ? "In Stock Food Trailers" : seriesMeta[series as Exclude<SeriesSlug, "in-stock">].name;
  const blurb = isStock
    ? "Ready-to-ship units across series. Sold units disappear automatically when stock status changes."
    : seriesMeta[series as Exclude<SeriesSlug, "in-stock">].blurb;
  const page = await getSitePage(`/products/${series}`);
  const s = (path: string, text: string) => stegaText(page?._id, "sitePage", path, text);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path={`/products/${series}`} />
      {items.slice(0, 3).map((item) => (
        <JsonLd key={item.sku} data={productJsonLd(item)} />
      ))}
      <h1 className="type-page">{s("title", page?.title ?? title)}</h1>
      <p className="type-lede mt-3 max-w-3xl">{s("subtitle", page?.subtitle ?? blurb)}</p>
      {series === "airstream" ? (
        <SeriesArcGuide
          documentId={page?._id}
          title={page?.arcGuideTitle}
          note={page?.arcGuideNote}
          items={page?.arcGuides}
          defaults={AIRSTREAM_ARC_GUIDE_DEFAULTS}
          imageAlts={AIRSTREAM_ARC_IMAGES}
          sectionId="arc-guide"
          placeholderSuffix="弧度示意 · 5:2 · 1000×400 JPG"
          columns={3}
        />
      ) : null}
      {series === "pod" ? (
        <SeriesArcGuide
          documentId={page?._id}
          title={page?.arcGuideTitle}
          note={page?.arcGuideNote}
          items={page?.arcGuides}
          defaults={POD_SHAPE_GUIDE_DEFAULTS}
          imageAlts={POD_SHAPE_IMAGES}
          sectionId="shape-guide"
          placeholderSuffix="造型示意 · 4:3 · 1200×900 JPG"
          columns={2}
          imageAspectClass="aspect-[4/3]"
        />
      ) : null}
      <div className="mt-10">
        <ProductCatalog
          series={isStock ? "in-stock" : (series as "pod")}
          items={items}
          mode={isStock ? "stock" : isOthers ? "others" : "filter"}
        />
      </div>
    </div>
  );
}
