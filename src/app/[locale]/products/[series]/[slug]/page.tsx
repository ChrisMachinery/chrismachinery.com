import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCatalogProduct, getCatalogProducts, getPageContent, getProductsBySeries, getSitePage } from "@/lib/sanity/fetch";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { ProductDetailActions } from "@/components/products/ProductDetailActions";
import { productMaterials, productShapes } from "@/lib/productFamily";
import { AIRSTREAM_ARC_PDP_NOTE } from "@/lib/airstreamArc";
import { POD_SHAPE_PDP_NOTE } from "@/lib/podShapeGuide";
import { ProductGallery } from "@/components/products/ProductGallery";
import { PreviewNavLink } from "@/components/layout/PreviewNavLink";
import { Hreflang, JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd } from "@/lib/seo";
import { productCustomizable, productIncluded, productKgLabel, productOverallLength, productOverallWidth, productSizeLabel } from "@/data/products";
import { cmsEdit, stegaText } from "@/lib/sanity/visual";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const mapped = await getCatalogProducts();
  const items = mapped.length ? mapped : [];
  return items.map((item) => ({ series: item.series, slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} (${productSizeLabel(product)} ${product.axle}) Food Trailer - Chris Machinery`,
    description: `Buy ${product.name} custom food trailer (body ${productSizeLabel(product)}, ${productShapes(product).join(" / ") || "standard"}, ${productMaterials(product).join(" / ") || "factory finish"}). Fast shipping worldwide.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; series: string; slug: string }>;
}) {
  const { locale, series, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const product = await getCatalogProduct(slug);
  if (!product || product.series !== series) notFound();
  const [relatedRaw, seriesPage, pageContent] = await Promise.all([
    getProductsBySeries(product.series),
    getSitePage(`/products/${product.series}`),
    getPageContent(),
  ]);
  const id = product._id;
  const s = (path: string, text: string) => stegaText(id, "product", path, text);
  const related = relatedRaw.filter((item) => item.slug !== product.slug).slice(0, 6);
  const includedFromCms = Boolean(seriesPage?.included?.length);
  const customFromCms = Boolean(pageContent?.productCustomOptions?.length);
  const included = productIncluded(product, seriesPage?.included);
  const customizable = productCustomizable(product, pageContent?.productCustomOptions);
  const overallLength = productOverallLength(product.length);
  const overallWidth = productOverallWidth(product.width);
  const seriesId = seriesPage?._id;
  const contentId = pageContent?._id;
  const gallery = [
    product.imageUrl
      ? { url: product.imageUrl, objectPosition: product.imageObjectPosition, path: "mainImage" }
      : undefined,
    ...(product.galleryImages ?? [])
      .map((image, i) => ({ ...image, path: `gallery[${i}]` }))
      .filter((image) => image.url !== product.imageUrl),
  ].filter((image): image is { url: string; objectPosition?: string; path: string } => Boolean(image));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Hreflang path={`/products/${series}/${slug}`} />
      <JsonLd data={productJsonLd(product)} />
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          documentId={id}
          label={`${product.series}系列 - ${productSizeLabel(product)} ${product.axle}白底图`}
          images={gallery}
        />
        <div>
          <p className="text-sm uppercase tracking-wide">{s("sku", product.sku)}</p>
          <h1 className="type-page mt-2">{s("title", product.name)}</h1>
          <p className="type-lede mt-4">{s("description", product.description)}</p>
          <table className="mt-6 w-full border-collapse text-center text-sm" suppressHydrationWarning>
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
              <col className="w-1/4" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">{t("products.bodyLength")}</td>
                <td className="border border-black/20 px-2 py-2.5">{s("length", `${product.length} mm`)}</td>
                <td className="border border-black/20 px-2 py-2.5">{t("products.overallLength")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {overallLength ? s("length", `${overallLength} mm`) : "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">{t("products.bodyWidth")}</td>
                <td className="border border-black/20 px-2 py-2.5">{s("width", `${product.width} mm`)}</td>
                <td className="border border-black/20 px-2 py-2.5">{t("products.overallWidth")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {overallWidth ? s("width", `${overallWidth} mm`) : "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">{t("products.bodyHeight")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {product.height ? s("height", `${product.height} mm`) : "—"}
                </td>
                <td className="border border-black/20 px-2 py-2.5">{t("products.overallHeight")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {product.overallHeight ? s("overallHeight", `${product.overallHeight} mm`) : "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">{t("products.weight")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {product.weight ? s("weight", productKgLabel(product.weight)) : "—"}
                </td>
                <td className="border border-black/20 px-2 py-2.5">{t("products.loadCapacity")}</td>
                <td className="border border-black/20 px-2 py-2.5">
                  {product.loadCapacity ? s("loadCapacity", productKgLabel(product.loadCapacity)) : "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">Axle</td>
                <td className="border border-black/20 px-2 py-2.5" colSpan={3}>{s("axle", product.axle)}</td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">Shape</td>
                <td className="border border-black/20 px-2 py-2.5" colSpan={3}>
                  {productShapes(product).join(" / ") || "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">Material</td>
                <td className="border border-black/20 px-2 py-2.5" colSpan={3}>
                  {productMaterials(product).join(" / ") || "—"}
                </td>
              </tr>
              <tr>
                <td className="border border-black/20 px-2 py-2.5">Stock</td>
                <td className="border border-black/20 px-2 py-2.5" colSpan={3}>{s("stockStatus", product.stockStatus)}</td>
              </tr>
            </tbody>
          </table>
          <Suspense>
            <ProductDetailActions
              documentId={id}
              slug={product.slug}
              shapes={productShapes(product)}
              materials={productMaterials(product)}
              quoteText={product.quoteText}
              quoteLink={product.quoteLink}
              customizeText={product.customizeText}
              customizeLink={product.customizeLink}
              quoteLabel={t("products.getQuote")}
              customizeLabel={t("cta.customize")}
              seriesGuideHref={
                product.series === "airstream"
                  ? { pathname: "/products/airstream", hash: "arc-guide" }
                  : product.series === "pod"
                    ? { pathname: "/products/pod", hash: "shape-guide" }
                    : undefined
              }
              seriesGuideText={
                product.series === "airstream"
                  ? AIRSTREAM_ARC_PDP_NOTE
                  : product.series === "pod"
                    ? POD_SHAPE_PDP_NOTE
                    : undefined
              }
            />
          </Suspense>
        </div>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <section {...cmsEdit(seriesId, "sitePage", "included")}>
          <h2 className="type-section">{t("products.included")}</h2>
          <ul className="type-body mt-4 list-disc space-y-2 ps-5">
            {included.map((item, i) => (
              <li key={`${item}-${i}`}>
                {includedFromCms ? stegaText(seriesId, "sitePage", `included[${i}]`, item) : item}
              </li>
            ))}
          </ul>
        </section>
        <section {...cmsEdit(contentId, "pageContent", "productCustomOptions")}>
          <h2 className="type-section">{t("products.customizable")}</h2>
          <ul className="type-body mt-4 list-disc space-y-2 ps-5">
            {customizable.map((item, i) => (
              <li key={`${item}-${i}`}>
                {customFromCms
                  ? stegaText(contentId, "pageContent", `productCustomOptions[${i}]`, item)
                  : item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {related.length ? (
        <section className="mt-16">
          <h2 className="type-section">{t("products.moreInSeries")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => (
              <article key={item.slug} className="overflow-hidden rounded-lg border border-black/5 bg-white">
                <PreviewNavLink href={`/products/${item.series}/${item.slug}`} className="block">
                  <ImgPlaceholder
                    documentId={item._id}
                    documentType="product"
                    path="mainImage"
                    label={item.name}
                    className="aspect-square w-full"
                    src={item.imageUrl}
                    objectPosition={item.imageObjectPosition}
                  />
                  <div className="p-4">
                    <h3 className="type-card">{stegaText(item._id, "product", "title", item.name)}</h3>
                    <p className="type-body mt-2">{productSizeLabel(item)}</p>
                    <p className="type-body mt-1">{productShapes(item).join(" / ")}</p>
                  </div>
                </PreviewNavLink>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
