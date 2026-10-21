"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Product } from "@/data/products";
import { productSizeLabel } from "@/data/products";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { ProductCtaButton } from "@/components/products/ProductCtaButton";
import { ShapeOptionChips } from "@/components/products/ShapeOptionChips";
import { productMaterials, productShapes } from "@/lib/productFamily";
import { localePrefix } from "@/lib/inquirySource";
import { cleanProductHref, productPath } from "@/lib/productUrl";
import { uiText } from "@/lib/i18nCopy";
import { specLabel } from "@/lib/specI18n";
import { stegaText } from "@/lib/sanity/visual";
import type { CatalogCardEdit } from "@/lib/othersCatalog";

export function CatalogProductCard({
  item,
  compare,
  quoteLabel,
  onCompare,
  edit,
  showCompare = true,
  showViewProduct = true,
  othersLayout = false,
}: {
  item: Product;
  compare: boolean;
  quoteLabel: string;
  onCompare: (slug: string, on: boolean) => void;
  edit?: CatalogCardEdit;
  showCompare?: boolean;
  showViewProduct?: boolean;
  othersLayout?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const shapes = productShapes(item);
  const materials = productMaterials(item);
  const [shape, setShape] = useState(shapes[0] ?? "");
  const [material, setMaterial] = useState(materials[0] ?? "");
  const viewHref = cleanProductHref(item.viewProductLink, item.series, item.slug);
  const from = `${localePrefix(locale)}${productPath(item.series, item.slug)}`;
  const quoteQuery = [
    shape ? `shape=${encodeURIComponent(shape)}` : "",
    material ? `material=${encodeURIComponent(material)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const quoteHref =
    item.quoteLink ||
    `/contact?product=${item.slug}${quoteQuery ? `&${quoteQuery}` : ""}&from=${encodeURIComponent(from)}`;
  const docId = edit?.documentId || item._id;
  const docType = edit?.documentType || "product";
  const productDocId = docType === "sitePage" ? undefined : item._id;
  const s = (path: string, text: string) => stegaText(docId, docType, path, text);

  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white">
      <ImgPlaceholder
        documentId={docId}
        documentType={docType}
        path={edit?.imagePath || "mainImage"}
        alt={item.name}
        className="aspect-square w-full shrink-0"
        src={item.imageUrl}
        objectPosition={item.imageObjectPosition}
      />
      <div className="flex flex-1 flex-col p-4">
        {othersLayout ? null : (
          <div className="flex min-h-8 flex-wrap gap-2">
            <span className="rounded bg-black/5 px-2 py-1 text-xs">
              {s(edit?.axlePath || "axle", specLabel(t, item.axle))}
            </span>
            {item.stockStatus === "In Stock" ? (
              <span className="rounded bg-accent px-2 py-1 text-xs font-semibold">
                {stegaText(item._id, "product", "stockStatus", t("specs.inStock"))}
              </span>
            ) : null}
          </div>
        )}
        <h3 className={`${othersLayout ? "" : "mt-3"} min-h-[2.5rem] font-heading text-base leading-snug text-brand`}>
          {s(edit?.titlePath || "title", item.name)}
        </h3>
        {othersLayout ? null : (
          <>
            <ShapeOptionChips shapes={shapes} value={shape} onChange={shapes.length > 1 ? setShape : undefined} />
            <ShapeOptionChips
              shapes={materials}
              value={material}
              onChange={materials.length > 1 ? setMaterial : undefined}
              label={t("specs.material")}
            />
            <table className="type-body mt-3 w-full" suppressHydrationWarning>
              <tbody>
                <tr>
                  <td>{t("products.bodySize")}</td>
                  <td className="text-end">
                    {s(edit?.sizePath || "length", productSizeLabel(item))}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
        {showCompare ? (
          <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={compare} onChange={(e) => onCompare(item.slug, e.target.checked)} />
            {t("cta.compare")}
          </label>
        ) : null}
        <div className="mt-auto space-y-2 pt-2">
          {othersLayout ? (
            <ProductCtaButton
              textPath="title"
              linkPath="title"
              text={t("products.viewDetails")}
              href={productPath("others", item.slug)}
              previewNavigates
              className="min-touch inline-flex w-full items-center justify-center rounded border border-brand font-heading"
            />
          ) : null}
          {showViewProduct ? (
            <ProductCtaButton
              documentId={productDocId}
              textPath="viewProductText"
              linkPath="viewProductLink"
              text={uiText(locale, item.viewProductText, t("products.viewProduct"))}
              href={viewHref}
              previewNavigates
              className="min-touch inline-flex w-full items-center justify-center rounded border border-brand font-heading"
            />
          ) : null}
          <ProductCtaButton
            documentId={productDocId}
            textPath="quoteText"
            linkPath="quoteLink"
            text={uiText(locale, item.quoteText, quoteLabel)}
            href={quoteHref}
            className="min-touch inline-flex w-full items-center justify-center rounded bg-accent font-heading text-brand"
          />
        </div>
      </div>
    </article>
  );
}
