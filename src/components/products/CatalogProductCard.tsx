"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";
import { productSizeLabel } from "@/data/products";
import { ImgPlaceholder } from "@/components/media/ImgPlaceholder";
import { ProductCtaButton } from "@/components/products/ProductCtaButton";
import { ShapeOptionChips } from "@/components/products/ShapeOptionChips";
import { productMaterials, productShapes } from "@/lib/productFamily";
import { stegaText } from "@/lib/sanity/visual";

export function CatalogProductCard({
  item,
  compare,
  quoteLabel,
  onCompare,
}: {
  item: Product;
  compare: boolean;
  quoteLabel: string;
  onCompare: (slug: string, on: boolean) => void;
}) {
  const t = useTranslations();
  const shapes = productShapes(item);
  const materials = productMaterials(item);
  const [shape, setShape] = useState(shapes[0] ?? "");
  const [material, setMaterial] = useState(materials[0] ?? "");
  const q = [
    shape ? `shape=${encodeURIComponent(shape)}` : "",
    material ? `material=${encodeURIComponent(material)}` : "",
  ]
    .filter(Boolean)
    .join("&");
  const qs = q ? `?${q}` : "";
  const viewHref = item.viewProductLink?.trim() || `/products/${item.series}/${item.slug}${qs}`;
  const quoteHref = item.quoteLink || `/contact?product=${item.slug}${q ? `&${q}` : ""}`;

  return (
    <article className="card-hover flex h-full flex-col overflow-hidden rounded-lg border border-black/5 bg-white">
      <ImgPlaceholder
        documentId={item._id}
        documentType="product"
        path="mainImage"
        label={`${item.series}系列白底图`}
        className="aspect-square w-full shrink-0"
        src={item.imageUrl}
        objectPosition={item.imageObjectPosition}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex min-h-8 flex-wrap gap-2">
          <span className="rounded bg-black/5 px-2 py-1 text-xs">
            {stegaText(item._id, "product", "axle", item.axle)}
          </span>
          {item.stockStatus === "In Stock" ? (
            <span className="rounded bg-accent px-2 py-1 text-xs font-semibold">
              {stegaText(item._id, "product", "stockStatus", "In Stock")}
            </span>
          ) : null}
        </div>
        <h3 className="mt-3 min-h-[2.5rem] font-heading text-base leading-snug text-brand">
          {stegaText(item._id, "product", "title", item.name)}
        </h3>
        <ShapeOptionChips shapes={shapes} value={shape} onChange={shapes.length > 1 ? setShape : undefined} />
        <ShapeOptionChips
          shapes={materials}
          value={material}
          onChange={materials.length > 1 ? setMaterial : undefined}
          label="Material"
        />
        <table className="type-body mt-3 w-full" suppressHydrationWarning>
          <tbody>
            <tr>
              <td>{t("products.bodySize")}</td>
              <td className="text-end">
                {stegaText(item._id, "product", "length", productSizeLabel(item))}
              </td>
            </tr>
          </tbody>
        </table>
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={compare} onChange={(e) => onCompare(item.slug, e.target.checked)} />
          {t("cta.compare")}
        </label>
        <div className="mt-auto space-y-2 pt-2">
          <ProductCtaButton
            documentId={item._id}
            textPath="viewProductText"
            linkPath="viewProductLink"
            text={item.viewProductText || "View product"}
            href={viewHref}
            previewNavigates
            className="min-touch inline-flex w-full items-center justify-center rounded border border-brand font-heading"
          />
          <ProductCtaButton
            documentId={item._id}
            textPath="quoteText"
            linkPath="quoteLink"
            text={item.quoteText || quoteLabel}
            href={quoteHref}
            className="min-touch inline-flex w-full items-center justify-center rounded bg-accent font-heading text-brand"
          />
        </div>
      </div>
    </article>
  );
}
